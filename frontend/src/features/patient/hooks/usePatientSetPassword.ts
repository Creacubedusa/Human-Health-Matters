import { useMemo, useState } from 'react';
import { resetPassword } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';
import type { SetPasswordErrors, SetPasswordForm } from '../types/patient.types';

type Status = 'idle' | 'loading' | 'error' | 'success';

function validate(form: SetPasswordForm): SetPasswordErrors {
  const e: SetPasswordErrors = {};
  if (!form.newPassword) {
    e.newPassword = 'patientSetPassword.errors.passwordRequired';
  } else if (form.newPassword.length < 8) {
    e.newPassword = 'patientSetPassword.errors.passwordTooShort';
  }
  if (!form.confirmPassword) {
    e.confirmPassword = 'patientSetPassword.errors.confirmRequired';
  } else if (form.newPassword !== form.confirmPassword) {
    e.confirmPassword = 'patientSetPassword.errors.passwordMismatch';
  }
  return e;
}

const EMPTY_FORM: SetPasswordForm = { newPassword: '', confirmPassword: '' };

export interface UsePatientSetPasswordResult {
  form: SetPasswordForm;
  errors: SetPasswordErrors;
  status: Status;
  isFormValid: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  handleChange: (field: keyof SetPasswordForm, value: string) => void;
  toggleShowNewPassword: () => void;
  toggleShowConfirmPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function usePatientSetPassword(): UsePatientSetPasswordResult {
  const pendingResetCode = useAuthStore((s) => s.pendingResetCode);
  const [form, setForm] = useState<SetPasswordForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allErrors = useMemo(() => validate(form), [form]);
  const errors = submitted ? allErrors : {};
  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  function handleChange(field: keyof SetPasswordForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(onSuccess: () => void) {
    setSubmitted(true);
    if (!isFormValid) return;
    setStatus('loading');
    try {
      await resetPassword(form.newPassword, pendingResetCode ?? '');
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
    showNewPassword,
    showConfirmPassword,
    handleChange,
    toggleShowNewPassword: () => setShowNewPassword((p) => !p),
    toggleShowConfirmPassword: () => setShowConfirmPassword((p) => !p),
    handleSubmit,
  };
}
