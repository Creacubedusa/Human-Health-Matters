import { useState } from 'react';
import { sendResetCode } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /^\d{7,15}$/;

type Status = 'idle' | 'loading' | 'error' | 'success';

export interface UsePatientForgotPasswordResult {
  identifier: string;
  identifierError: string | null;
  status: Status;
  setIdentifier: (v: string) => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

function validate(value: string): string | null {
  if (!value.trim()) return 'patientForgotPassword.errors.identifierRequired';
  const isEmail = EMAIL_RE.test(value.trim());
  const isPhone = PHONE_DIGITS_RE.test(value.replace(/\D/g, ''));
  if (!isEmail && !isPhone) return 'patientForgotPassword.errors.identifierInvalid';
  return null;
}

export function usePatientForgotPassword(): UsePatientForgotPasswordResult {
  const setPendingResetContact = useAuthStore((s) => s.setPendingResetContact);

  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(onSuccess: () => void) {
    const error = validate(identifier);
    if (error) {
      setIdentifierError(error);
      return;
    }
    setIdentifierError(null);
    setStatus('loading');
    try {
      await sendResetCode(identifier.trim());
      setPendingResetContact(identifier.trim());
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  return { identifier, identifierError, status, setIdentifier, handleSubmit };
}
