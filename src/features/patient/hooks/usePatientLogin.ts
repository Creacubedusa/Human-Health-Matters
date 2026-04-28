import { useMemo, useState } from 'react';
import { loginWithEmail, loginWithPhone } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';
import type { LoginErrors, LoginForm, LoginMethod } from '../types/patient.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /^\d{7,15}$/;

type Status = 'idle' | 'loading' | 'error' | 'success';

function validate(form: LoginForm, method: LoginMethod): LoginErrors {
  const e: LoginErrors = {};
  if (method === 'email') {
    if (!form.email.trim()) e.email = 'patientLogin.errors.emailRequired';
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'patientLogin.errors.emailInvalid';
  } else {
    const digits = form.phone.replace(/\D/g, '');
    if (!form.phone.trim()) e.phone = 'patientLogin.errors.phoneRequired';
    else if (!PHONE_DIGITS_RE.test(digits)) e.phone = 'patientLogin.errors.phoneInvalid';
  }
  if (!form.password) e.password = 'patientLogin.errors.passwordRequired';
  return e;
}

const EMPTY_FORM: LoginForm = { email: '', phone: '', password: '' };

export interface UsePatientLoginResult {
  form: LoginForm;
  errors: LoginErrors;
  signInMethod: LoginMethod;
  status: Status;
  isFormValid: boolean;
  showPassword: boolean;
  setSignInMethod: (method: LoginMethod) => void;
  handleChange: (field: keyof LoginForm, value: string) => void;
  handleBlur: (field: keyof LoginForm) => void;
  toggleShowPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function usePatientLogin(): UsePatientLoginResult {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState<LoginForm>(EMPTY_FORM);
  const [signInMethod, setSignInMethod] = useState<LoginMethod>('email');
  const [touched, setTouched] = useState<Set<keyof LoginForm>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [showPassword, setShowPassword] = useState(false);

  const allErrors = useMemo(() => validate(form, signInMethod), [form, signInMethod]);

  const errors: LoginErrors = useMemo(() => {
    if (submitted) return allErrors;
    const visible: LoginErrors = {};
    for (const key of touched) {
      const k = key as keyof LoginErrors;
      if (allErrors[k]) visible[k] = allErrors[k];
    }
    return visible;
  }, [allErrors, touched, submitted]);

  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  function handleChange(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof LoginForm) {
    setTouched((prev) => new Set(prev).add(field));
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  async function handleSubmit(onSuccess: () => void) {
    setSubmitted(true);
    if (!isFormValid) return;
    setStatus('loading');
    try {
      const { userId } = signInMethod === 'email'
        ? await loginWithEmail(form.email.trim(), form.password)
        : await loginWithPhone(form.phone.trim(), form.password);
      setAuth(userId, 'patient');
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  return {
    form,
    errors,
    signInMethod,
    status,
    isFormValid,
    showPassword,
    setSignInMethod,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  };
}
