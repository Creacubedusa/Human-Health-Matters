import { useMemo, useState } from 'react';
import { loginWithEmail, loginWithPhone } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';
import { setAccessToken } from '@shared/api/token';
import { kvSet } from '@shared/storage/kv';
import type {
  DoctorLoginErrors,
  DoctorLoginForm,
  DoctorLoginMethod,
} from '../types/doctor.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /^\d{7,15}$/;

type Status = 'idle' | 'loading' | 'error' | 'success';

const EMPTY_FORM: DoctorLoginForm = {
  email: '',
  phone: '',
  phoneCountryCode: '+1',
  password: '',
};

function validate(form: DoctorLoginForm, method: DoctorLoginMethod): DoctorLoginErrors {
  const errors: DoctorLoginErrors = {};

  if (method === 'email') {
    if (!form.email.trim()) errors.email = 'doctorLogin.errors.emailRequired';
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'doctorLogin.errors.emailInvalid';
  } else {
    const digits = form.phone.replace(/\D/g, '');
    if (!form.phone.trim()) errors.phone = 'doctorLogin.errors.phoneRequired';
    else if (!PHONE_DIGITS_RE.test(digits)) errors.phone = 'doctorLogin.errors.phoneInvalid';
  }

  if (!form.password) errors.password = 'doctorLogin.errors.passwordRequired';

  return errors;
}

export interface UseDoctorLoginResult {
  form: DoctorLoginForm;
  errors: DoctorLoginErrors;
  signInMethod: DoctorLoginMethod;
  status: Status;
  isFormValid: boolean;
  showPassword: boolean;
  setSignInMethod: (method: DoctorLoginMethod) => void;
  handleChange: (field: keyof DoctorLoginForm, value: string) => void;
  handleBlur: (field: keyof DoctorLoginForm) => void;
  toggleShowPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function useDoctorLogin(): UseDoctorLoginResult {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setToken = useAuthStore((state) => state.setAccessToken);

  const [form, setForm] = useState<DoctorLoginForm>(EMPTY_FORM);
  const [signInMethod, setSignInMethod] = useState<DoctorLoginMethod>('email');
  const [touched, setTouched] = useState<Set<keyof DoctorLoginForm>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [showPassword, setShowPassword] = useState(false);

  const allErrors = useMemo(() => validate(form, signInMethod), [form, signInMethod]);

  const errors = useMemo(() => {
    if (submitted) return allErrors;

    const visible: DoctorLoginErrors = {};
    for (const key of touched) {
      const typedKey = key as keyof DoctorLoginErrors;
      if (allErrors[typedKey]) visible[typedKey] = allErrors[typedKey];
    }
    return visible;
  }, [allErrors, submitted, touched]);

  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  function handleChange(field: keyof DoctorLoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof DoctorLoginForm) {
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
      const data =
        signInMethod === 'email'
          ? await loginWithEmail(form.email.trim(), form.password)
          : await loginWithPhone(form.phone.trim(), form.phoneCountryCode, form.password);

      const roleKey =
        data.role === 'DOCTOR' ? 'doctor' : data.role === 'DONOR' ? 'donor' : 'patient';

      setToken(data.accessToken);
      await setAccessToken(data.accessToken);
      await kvSet('app_role', roleKey);
      setAuth(data.userId, roleKey);
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
