import { useState } from 'react';
import { sendResetCode } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'loading' | 'error' | 'success';

export interface UseDoctorForgotPasswordResult {
  email: string;
  emailError: string | null;
  status: Status;
  setEmail: (value: string) => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

function validate(email: string): string | null {
  if (!email.trim()) return 'doctorForgotPassword.errors.emailRequired';
  if (!EMAIL_RE.test(email.trim())) return 'doctorForgotPassword.errors.emailInvalid';
  return null;
}

export function useDoctorForgotPassword(): UseDoctorForgotPasswordResult {
  const setPendingResetContact = useAuthStore((state) => state.setPendingResetContact);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(onSuccess: () => void) {
    const error = validate(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError(null);
    setStatus('loading');
    try {
      await sendResetCode(email.trim());
      setPendingResetContact(email.trim());
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  return {
    email,
    emailError,
    status,
    setEmail,
    handleSubmit,
  };
}
