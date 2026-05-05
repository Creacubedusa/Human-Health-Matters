import { useState } from 'react';
import { useAuthStore } from '@shared/store/auth.store';
import { sendDonorResetCode } from '../services/donorAuth.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'loading' | 'error' | 'success';

function validate(value: string): string | null {
  if (!value.trim()) return 'donorForgotPassword.errors.emailRequired';
  if (!EMAIL_RE.test(value.trim())) return 'donorForgotPassword.errors.emailInvalid';
  return null;
}

export interface UseDonorForgotPasswordResult {
  email: string;
  emailError: string | null;
  status: Status;
  setEmail: (v: string) => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function useDonorForgotPassword(): UseDonorForgotPasswordResult {
  const setPendingResetContact = useAuthStore((s) => s.setPendingResetContact);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(onSuccess: () => void) {
    const error = validate(email);
    if (error) { setEmailError(error); return; }
    setEmailError(null);
    setStatus('loading');
    try {
      await sendDonorResetCode(email.trim());
      setPendingResetContact(email.trim());
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  return { email, emailError, status, setEmail, handleSubmit };
}
