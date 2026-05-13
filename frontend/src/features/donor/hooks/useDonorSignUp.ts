import { useMemo, useState } from 'react';
import { useAuthStore } from '@shared/store/auth.store';
import { setAccessToken } from '@shared/api/token';
import { kvSet } from '@shared/storage/kv';
import { registerDonor, donorLoginWithEmail } from '../services/donorAuth.service';
import type {
  DonorSignUpForm,
  DonorSignUpErrors,
  DonorPasswordStrength,
} from '../types/donorAuth.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function computeStrength(password: string): DonorPasswordStrength {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
  };
}

function validateAll(form: DonorSignUpForm): DonorSignUpErrors {
  const e: DonorSignUpErrors = {};
  if (!form.firstName.trim()) e.firstName = 'donorSignUp.errors.firstNameRequired';
  if (!form.lastName.trim()) e.lastName = 'donorSignUp.errors.lastNameRequired';
  if (!form.email.trim()) e.email = 'donorSignUp.errors.emailRequired';
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'donorSignUp.errors.emailInvalid';
  if (!form.password) e.password = 'donorSignUp.errors.passwordRequired';
  return e;
}

const EMPTY_FORM: DonorSignUpForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

type Status = 'idle' | 'loading' | 'error' | 'success';

function extractMessage(error: unknown): string {
  const data = (error as { response?: { data?: { message?: string | string[] } | string } })
    ?.response?.data;
  if (typeof data === 'string' && data.trim()) return data.trim();
  if (typeof data === 'object' && data != null) {
    const msg = (data as { message?: string | string[] }).message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg) && msg.length > 0) return String(msg[0]);
  }
  return (error as { message?: string })?.message ?? 'unknown_error';
}

export interface UseDonorSignUpResult {
  form: DonorSignUpForm;
  errors: DonorSignUpErrors;
  passwordStrength: DonorPasswordStrength;
  status: Status;
  errorMessage: string | null;
  isFormValid: boolean;
  showPassword: boolean;
  handleChange: (field: keyof DonorSignUpForm, value: string) => void;
  handleBlur: (field: keyof DonorSignUpForm) => void;
  toggleShowPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function useDonorSignUp(): UseDonorSignUpResult {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);
  const setToken = useAuthStore((s) => s.setAccessToken);

  const [form, setForm] = useState<DonorSignUpForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Set<keyof DonorSignUpForm>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const allErrors = useMemo(() => validateAll(form), [form]);

  const errors: DonorSignUpErrors = useMemo(() => {
    if (submitted) return allErrors;
    const visible: DonorSignUpErrors = {};
    for (const key of touched) {
      if (allErrors[key]) visible[key] = allErrors[key];
    }
    return visible;
  }, [allErrors, touched, submitted]);

  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);
  const passwordStrength = useMemo(() => computeStrength(form.password), [form.password]);

  function handleChange(field: keyof DonorSignUpForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') { setStatus('idle'); setErrorMessage(null); }
  }

  function handleBlur(field: keyof DonorSignUpForm) {
    setTouched((prev) => new Set(prev).add(field));
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  async function handleSubmit(onSuccess: () => void) {
    setSubmitted(true);
    if (!isFormValid) return;

    setStatus('loading');
    setErrorMessage(null);

    let userId: string;
    try {
      const result = await registerDonor({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      userId = result.userId;
    } catch (error) {
      setErrorMessage(extractMessage(error));
      setStatus('error');
      return;
    }

    try {
      const login = await donorLoginWithEmail(form.email.trim(), form.password);
      if (login.accessToken) {
        setToken(login.accessToken);
        await setAccessToken(login.accessToken);
      }
      await kvSet('app_role', 'donor');
      await kvSet('app_user_id', userId);
      setPendingEmail(form.email.trim());
      setAuth(userId, 'donor');
      setStatus('success');
      onSuccess();
    } catch (error) {
      setErrorMessage(extractMessage(error));
      setStatus('error');
    }
  }

  return {
    form,
    errors,
    passwordStrength,
    status,
    errorMessage,
    isFormValid,
    showPassword,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  };
}
