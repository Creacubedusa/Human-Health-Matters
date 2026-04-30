import { useCallback, useEffect, useRef, useState } from 'react';
import { verifyResetOtp, sendResetCode } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';

const CODE_LENGTH = 6;
const RESEND_COUNTDOWN = 30;

type Status = 'idle' | 'loading' | 'error' | 'success';

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export interface UsePatientResetVerifyResult {
  code: string;
  status: Status;
  errorKey: string | null;
  timerLabel: string;
  canResend: boolean;
  isResending: boolean;
  handleChange: (value: string) => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
  handleResend: () => Promise<void>;
}

export function usePatientResetVerify(): UsePatientResetVerifyResult {
  const pendingResetContact = useAuthStore((s) => s.pendingResetContact);
  const setPendingResetCode = useAuthStore((s) => s.setPendingResetCode);

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(RESEND_COUNTDOWN);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startCountdown]);

  function handleChange(value: string) {
    setCode(value);
    if (status === 'error') { setStatus('idle'); setErrorKey(null); }
  }

  async function handleSubmit(onSuccess: () => void) {
    if (code.length < CODE_LENGTH) return;
    setStatus('loading');
    setErrorKey(null);
    try {
      await verifyResetOtp(code);
      setPendingResetCode(code);
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
      setErrorKey('patientResetVerify.errors.invalidCode');
      setCode('');
    }
  }

  async function handleResend() {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorKey(null);
    try {
      await sendResetCode(pendingResetContact ?? '');
      setCode('');
      startCountdown();
    } catch {
      setErrorKey('patientResetVerify.errors.resendFailed');
    } finally {
      setIsResending(false);
    }
  }

  return {
    code,
    status,
    errorKey,
    timerLabel: formatTimer(secondsLeft),
    canResend,
    isResending,
    handleChange,
    handleSubmit,
    handleResend,
  };
}
