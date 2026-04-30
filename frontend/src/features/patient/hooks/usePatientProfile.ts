import { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '@shared/store/auth.store';
import { usePatientStore } from '../store/patient.store';
import { setupPatientProfile } from '../services/profile.service';
import {
  INITIAL_PROFILE_FORM,
  hasDiabetes,
  type ProfileForm,
} from '../types/profile.types';

// ── Step config ───────────────────────────────────────────────────────────────

export type StepId =
  | 'basicInfo'
  | 'weight'
  | 'height'
  | 'diabetes'
  | 'diabetesMedication'
  | 'familyHistoryDiabetes'
  | 'chronicDiseases'
  | 'generalFamilyHistory'
  | 'allergies'
  | 'surgery';

interface StepConfig {
  id: StepId;
  progress: number;
  skippable: boolean;
}

const BASE_STEPS: StepConfig[] = [
  { id: 'basicInfo',             progress: 0,   skippable: true  },
  { id: 'weight',                progress: 20,  skippable: true  },
  { id: 'height',                progress: 20,  skippable: true  },
  { id: 'diabetes',              progress: 40,  skippable: true  },
  { id: 'familyHistoryDiabetes', progress: 60,  skippable: true  },
  { id: 'chronicDiseases',       progress: 60,  skippable: true  },
  { id: 'generalFamilyHistory',  progress: 80,  skippable: true  },
  { id: 'allergies',             progress: 80,  skippable: true  },
  { id: 'surgery',               progress: 100, skippable: true  },
];

const MED_STEP: StepConfig = { id: 'diabetesMedication', progress: 40, skippable: false };

function buildSteps(form: ProfileForm): StepConfig[] {
  const steps = [...BASE_STEPS];
  if (hasDiabetes(form.diabetesStatus)) {
    const idx = steps.findIndex((s) => s.id === 'diabetes');
    steps.splice(idx + 1, 0, MED_STEP);
  }
  return steps;
}

// ── Validation ────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof ProfileForm, string>>;

function validateStep(stepId: StepId, form: ProfileForm): FormErrors {
  const e: FormErrors = {};

  if (stepId === 'basicInfo') {
    if (!form.gender)              e.gender      = 'patientProfile.errors.genderRequired';
    if (!form.dateOfBirth?.trim()) e.dateOfBirth = 'patientProfile.errors.dobRequired';
    if (!form.nationality.trim())  e.nationality = 'patientProfile.errors.nationalityRequired';
    if (!form.address.trim())      e.address     = 'patientProfile.errors.addressRequired';
  }

  if (stepId === 'weight') {
    if (form.weight <= 0)          e.weight      = 'patientProfile.errors.weightRequired';
  }

  if (stepId === 'height') {
    if (form.heightUnit === 'cm') {
      if (form.heightCm <= 0)      e.heightCm    = 'patientProfile.errors.heightRequired';
    } else {
      if (form.heightFeet <= 0)    e.heightFeet  = 'patientProfile.errors.heightRequired';
    }
  }

  if (stepId === 'diabetes') {
    if (!form.diabetesStatus)      e.diabetesStatus = 'patientProfile.errors.diabetesRequired';
  }

  return e;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export type ProfileStatus = 'idle' | 'loading' | 'error' | 'success';

export interface UsePatientProfileResult {
  form: ProfileForm;
  currentStep: StepId;
  currentStepIndex: number;
  totalSteps: number;
  progress: number;
  skippable: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  status: ProfileStatus;
  errors: FormErrors;
  handleChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  handleNext: (onComplete: () => void) => void;
  handleSkip: () => void;
  handleBack: () => void;
}

export function usePatientProfile(): UsePatientProfileResult {
  const [form, setForm]         = useState<ProfileForm>(INITIAL_PROFILE_FORM);
  const [stepIndex, setStep]    = useState(0);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [status, setStatus]     = useState<ProfileStatus>('idle');

  const userId     = useAuthStore((s) => s.userId);
  const setProfile = usePatientStore((s) => s.setProfile);

  const steps = useMemo(() => buildSteps(form), [form]);

  const currentStepConfig = steps[stepIndex] ?? steps[0];
  const isFirstStep = stepIndex === 0;
  const isLastStep  = stepIndex === steps.length - 1;

  const handleChange = useCallback(<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field as keyof FormErrors];
      return next;
    });
  }, []);

  const handleNext = useCallback(async (onComplete: () => void) => {
    const stepErrors = validateStep(currentStepConfig.id, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    if (isLastStep) {
      setStatus('loading');
      try {
        await setupPatientProfile({ ...form, userId: userId ?? '' });
        setProfile(form);
        setStatus('success');
        onComplete();
      } catch {
        setStatus('error');
      }
      return;
    }

    setStep((i) => i + 1);
  }, [currentStepConfig.id, form, isLastStep, userId, setProfile]);

  const handleSkip = useCallback(() => {
    if (isLastStep) return;
    setErrors({});
    setStep((i) => i + 1);
  }, [isLastStep]);

  const handleBack = useCallback(() => {
    if (isFirstStep) return;
    setErrors({});
    setStep((i) => i - 1);
  }, [isFirstStep]);

  return {
    form,
    currentStep: currentStepConfig.id,
    currentStepIndex: stepIndex,
    totalSteps: steps.length,
    progress: currentStepConfig.progress,
    skippable: currentStepConfig.skippable,
    isFirstStep,
    isLastStep,
    status,
    errors,
    handleChange,
    handleNext,
    handleSkip,
    handleBack,
  };
}
