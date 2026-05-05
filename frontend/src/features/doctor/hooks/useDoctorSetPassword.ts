import { useMemo, useState } from 'react';
import { resetPassword } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';
import type {
  DoctorSetPasswordErrors,
  DoctorSetPasswordForm,
} from '../types/doctor.types';

type Status = 'idle' | 'loading' | 'error' | 'success';

const EMPTY_FORM: DoctorSetPasswordForm = {
  newPassword: '',
  confirmPassword: '',
};

function validate(form: DoctorSetPasswordForm): DoctorSetPasswordErrors {
  const errors: DoctorSetPasswordErrors = {};

  if (!form.newPassword) {
    errors.newPassword = 'doctorSetPassword.errors.passwordRequired';
  } else if (form.newPassword.length < 8) {
    errors.newPassword = 'doctorSetPassword.errors.passwordTooShort';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'doctorSetPassword.errors.confirmRequired';
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'doctorSetPassword.errors.passwordMismatch';
  }

  return errors;
}

export interface UseDoctorSetPasswordResult {
  form: DoctorSetPasswordForm;
  errors: DoctorSetPasswordErrors;
  status: Status;
  isFormValid: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  handleChange: (field: keyof DoctorSetPasswordForm, value: string) => void;
  toggleShowNewPassword: () => void;
  toggleShowConfirmPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function useDoctorSetPassword(): UseDoctorSetPasswordResult {
  const pendingResetCode = useAuthStore((state) => state.pendingResetCode);

  const [form, setForm] = useState<DoctorSetPasswordForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allErrors = useMemo(() => validate(form), [form]);
  const errors = submitted ? allErrors : {};
  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  function handleChange(field: keyof DoctorSetPasswordForm, value: string) {
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
    toggleShowNewPassword: () => setShowNewPassword((prev) => !prev),
    toggleShowConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
    handleSubmit,
  };
}
