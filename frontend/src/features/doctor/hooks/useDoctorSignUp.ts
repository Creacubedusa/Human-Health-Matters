import { useMemo, useState } from 'react';
import { loginWithEmail, registerDoctor } from '../services/auth.service';
import { useAuthStore } from '@shared/store/auth.store';
import { setAccessToken } from '@shared/api/token';
import { kvSet } from '@shared/storage/kv';
import type {
  DoctorPasswordStrength,
  DoctorSignUpErrors,
  DoctorSignUpForm,
} from '../types/doctor.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /^\d{7,15}$/;
const DOCTOR_PROFILE_SETUP_REQUIRED_KEY = 'doctor_profile_setup_required';

function computeStrength(password: string): DoctorPasswordStrength {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
  };
}

function validateAll(form: DoctorSignUpForm): DoctorSignUpErrors {
  const e: DoctorSignUpErrors = {};

  if (!form.firstName.trim()) {
    e.firstName = 'doctorSignUp.errors.firstNameRequired';
  }

  if (!form.lastName.trim()) {
    e.lastName = 'doctorSignUp.errors.lastNameRequired';
  }

  if (!form.email.trim()) {
    e.email = 'doctorSignUp.errors.emailRequired';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    e.email = 'doctorSignUp.errors.emailInvalid';
  }

  if (!form.phone.trim()) {
    e.phone = 'doctorSignUp.errors.phoneRequired';
  } else if (!PHONE_DIGITS_RE.test(form.phone.replace(/\D/g, ''))) {
    e.phone = 'doctorSignUp.errors.phoneInvalid';
  }

  if (!form.password) {
    e.password = 'doctorSignUp.errors.passwordRequired';
  } else {
    const s = computeStrength(form.password);
    if (!s.minLength || !s.hasNumber || !s.hasSpecial || !s.hasUpper || !s.hasLower) {
      e.password = 'doctorSignUp.errors.passwordWeak';
    }
  }

  return e;
}

const EMPTY_FORM: DoctorSignUpForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneCountryCode: '+1',
  password: '',
};

type Status = 'idle' | 'loading' | 'error' | 'success';

function extractErrorCode(error: unknown): string | null {
  const responseData = (error as {
    response?: { data?: { message?: string | string[] } | string };
    message?: string;
  })?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) return responseData.trim();

  if (typeof responseData === 'object' && responseData != null) {
    const message = responseData.message;
    if (typeof message === 'string' && message.trim()) return message.trim();
    if (Array.isArray(message) && message.length > 0) return String(message[0]);
  }

  const fallback = (error as { message?: string })?.message;
  return typeof fallback === 'string' && fallback.trim() ? fallback.trim() : null;
}

function mapErrorMessage(errorCode: string, stage: 'register' | 'login'): string {
  switch (errorCode) {
    case 'email_taken':
      return 'This email is already registered.';
    case 'phone_taken':
      return 'This phone number is already registered.';
    case 'phone_country_code_required':
      return 'Phone country code is required.';
    case 'phone_invalid':
      return 'Please enter a valid phone number.';
    case 'email_or_phone_required':
      return 'Email or phone number is required.';
    case 'invalid_credentials':
      return stage === 'login'
        ? 'Account created, but automatic sign-in failed. Please log in manually.'
        : 'Invalid credentials.';
    case 'Network Error':
      return 'Could not reach the server. Check your internet connection.';
    default:
      return stage === 'login'
        ? `Account created, but sign-in failed: ${errorCode}`
        : `Registration failed: ${errorCode}`;
  }
}

export interface UseDoctorSignUpResult {
  form: DoctorSignUpForm;
  errors: DoctorSignUpErrors;
  passwordStrength: DoctorPasswordStrength;
  status: Status;
  errorMessage: string | null;
  isFormValid: boolean;
  showPassword: boolean;
  handleChange: (field: keyof DoctorSignUpForm, value: string) => void;
  handleBlur: (field: keyof DoctorSignUpForm) => void;
  toggleShowPassword: () => void;
  handleSubmit: (onSuccess: () => void) => Promise<void>;
}

export function useDoctorSignUp(): UseDoctorSignUpResult {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);
  const setToken = useAuthStore((s) => s.setAccessToken);

  const [form, setForm] = useState<DoctorSignUpForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Set<keyof DoctorSignUpForm>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const allErrors = useMemo(() => validateAll(form), [form]);

  const errors: DoctorSignUpErrors = useMemo(() => {
    if (submitted) return allErrors;
    const visible: DoctorSignUpErrors = {};
    for (const key of touched) {
      if (allErrors[key]) visible[key] = allErrors[key];
    }
    return visible;
  }, [allErrors, touched, submitted]);

  const isFormValid = useMemo(() => Object.keys(allErrors).length === 0, [allErrors]);

  const passwordStrength = useMemo(() => computeStrength(form.password), [form.password]);

  function handleChange(field: keyof DoctorSignUpForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  }

  function handleBlur(field: keyof DoctorSignUpForm) {
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

    try {
      const email = form.email.trim();
      const phone = form.phone.replace(/\D/g, '');

      let userId: string;
      let backendRole: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN';

      try {
        const result = await registerDoctor({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email,
          phone,
          phoneCountryCode: form.phoneCountryCode,
          password: form.password,
        });
        userId = result.userId;
        backendRole = result.role;
      } catch (error) {
        setErrorMessage(mapErrorMessage(extractErrorCode(error) ?? 'unknown_error', 'register'));
        setStatus('error');
        return;
      }

      let login;
      try {
        login = await loginWithEmail(email, form.password);
      } catch (error) {
        setErrorMessage(mapErrorMessage(extractErrorCode(error) ?? 'unknown_error', 'login'));
        setStatus('error');
        return;
      }

      const accessToken = (login as { accessToken?: string })?.accessToken;
      if (accessToken) {
        setToken(accessToken);
        await setAccessToken(accessToken);
      }
      const roleKey =
        backendRole === 'DOCTOR' ? 'doctor' : backendRole === 'DONOR' ? 'donor' : 'patient';
      await kvSet('app_role', roleKey);
      await kvSet(DOCTOR_PROFILE_SETUP_REQUIRED_KEY, '1');
      setPendingEmail(email);
      setAuth(userId, roleKey);
      setStatus('success');
      onSuccess();
    } catch (error) {
      setErrorMessage(mapErrorMessage(extractErrorCode(error) ?? 'unknown_error', 'register'));
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
