import { useMemo, useState } from 'react';
import { useAuthStore } from '@shared/store/auth.store';
import { setAccessToken } from '@shared/api/token';
import { kvSet } from '@shared/storage/kv';
import { donorLoginWithEmail } from '../services/donorAuth.service';
import type { DonorLoginForm, DonorLoginErrors } from '../types/donorAuth.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'loading' | 'error' | 'success';

function validate(form: DonorLoginForm): DonorLoginErrors {
  const e: DonorLoginErrors = {};
  if (!form.email.trim()) e.email = 'donorLogin.errors.emailRequired';
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'donorLogin.errors.emailInvalid';
  if (!form.password) e.password = 'donorLogin.errors.passwordRequired';
  return e;
}

const EMPTY_FORM: DonorLoginForm = { email: '', password: '' };

export interface UseDonorLoginResult {
  form: DonorLoginForm;
  errors: DonorLoginErrors;
  status: Status;
  isFormValid: boolean;
  showPassword: boolean;
  handleChange: (field: keyof DonorLoginForm, value: string) => void;
  handleBlur: (field: keyof DonorLoginForm) => void;
  toggleShowPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function useDonorLogin(): UseDonorLoginResult {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setToken = useAuthStore((s) => s.setAccessToken);

  const [form, setForm] = useState<DonorLoginForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Set<keyof DonorLoginForm>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [showPassword, setShowPassword] = useState(false);

  const allErrors = useMemo(() => validate(form), [form]);

  const errors: DonorLoginErrors = useMemo(() => {
    if (submitted) return allErrors;
    const visible: DonorLoginErrors = {};
    for (const key of touched) {
      const k = key as keyof DonorLoginErrors;
      if (allErrors[k]) visible[k] = allErrors[k];
    }
    return visible;
  }, [allErrors, touched, submitted]);

  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  function handleChange(field: keyof DonorLoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof DonorLoginForm) {
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
      const data = await donorLoginWithEmail(form.email.trim(), form.password);
      if (data.accessToken) {
        setToken(data.accessToken);
        await setAccessToken(data.accessToken);
      }
      await kvSet('app_role', 'donor');
      await kvSet('app_user_id', data.userId);
      setAuth(data.userId, 'donor');
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  return {
    form,
    errors,
    status,
    isFormValid,
    showPassword,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  };
}
