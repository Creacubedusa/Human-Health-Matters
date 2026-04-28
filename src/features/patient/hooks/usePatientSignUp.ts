import { useMemo, useState } from 'react';
import { registerPatient } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';
import type {
  PasswordStrength,
  SignUpErrors,
  SignUpForm,
} from '../types/patient.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /^\d{7,15}$/;

function computeStrength(password: string): PasswordStrength {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    hasUpper:   /[A-Z]/.test(password),
    hasLower:   /[a-z]/.test(password),
  };
}

function validateAll(form: SignUpForm): SignUpErrors {
  const e: SignUpErrors = {};
  if (!form.firstName.trim()) e.firstName = 'patientSignUp.errors.firstNameRequired';
  if (!form.lastName.trim())  e.lastName  = 'patientSignUp.errors.lastNameRequired';
  if (!form.email.trim())     e.email     = 'patientSignUp.errors.emailRequired';
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'patientSignUp.errors.emailInvalid';
  const digits = form.phone.replace(/\D/g, '');
  if (!form.phone.trim())              e.phone = 'patientSignUp.errors.phoneRequired';
  else if (!PHONE_DIGITS_RE.test(digits)) e.phone = 'patientSignUp.errors.phoneInvalid';
  if (!form.password) e.password = 'patientSignUp.errors.passwordRequired';
  return e;
}

const EMPTY_FORM: SignUpForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
};

type Status = 'idle' | 'loading' | 'error' | 'success';

export interface UsePatientSignUpResult {
  form: SignUpForm;
  errors: SignUpErrors;
  passwordStrength: PasswordStrength;
  status: Status;
  isFormValid: boolean;
  showPassword: boolean;
  handleChange: (field: keyof SignUpForm, value: string) => void;
  handleBlur: (field: keyof SignUpForm) => void;
  toggleShowPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function usePatientSignUp(): UsePatientSignUpResult {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  const [form, setForm] = useState<SignUpForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Set<keyof SignUpForm>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [showPassword, setShowPassword] = useState(false);

  const allErrors = useMemo(() => validateAll(form), [form]);

  const errors: SignUpErrors = useMemo(() => {
    if (submitted) return allErrors;
    const visible: SignUpErrors = {};
    for (const key of touched) {
      if (allErrors[key]) visible[key] = allErrors[key];
    }
    return visible;
  }, [allErrors, touched, submitted]);

  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  const passwordStrength = useMemo(() => computeStrength(form.password), [form.password]);

  function handleChange(field: keyof SignUpForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof SignUpForm) {
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
      const { userId } = await registerPatient({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      setPendingEmail(form.email.trim());
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
    passwordStrength,
    status,
    isFormValid,
    showPassword,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  };
}
