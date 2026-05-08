import { useState } from 'react';
import { toast } from '@shared/components/ui/toast';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { useDoctorPatients } from './useDoctorPatients';
import { createDoctorLabOrder } from '../services/doctor.service';
import type { DoctorPatientListItem } from '../types/doctor.types';

export type CreateOrderStep = 1 | 2 | 3;

export interface OrderInfoForm {
  physician: string;
  specialization: string;
  additionalComment: string;
}

export interface TestInfoForm {
  testType: string;
  testName: string;
  collectionInstruction: string;
  priority: string;
  additionalComment: string;
}

export function useDoctorCreateOrderWizard(preselectedPatientId?: string) {
  const store = useDoctorPatientsStore();
  const { status, query, setQuery, patients } = useDoctorPatients();

  const preselected =
    preselectedPatientId
      ? (store.patients.find((p) => p.id === preselectedPatientId) ?? null)
      : null;

  const [step, setStep] = useState<CreateOrderStep>(1);
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatientListItem | null>(preselected);
  const [orderInfo, setOrderInfo] = useState<OrderInfoForm>({
    physician: '',
    specialization: '',
    additionalComment: '',
  });
  const [testInfo, setTestInfo] = useState<TestInfoForm>({
    testType: 'lab',
    testName: '',
    collectionInstruction: '',
    priority: 'urgent',
    additionalComment: '',
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function goToStep2() {
    if (!selectedPatient) {
      setErrors({ patient: 'createOrderWizard.errorSelectPatient' });
      return;
    }
    setErrors({});
    setStep(2);
  }

  function goToStep3() {
    const next: Partial<Record<string, string>> = {};
    if (!orderInfo.physician.trim()) next.physician = 'createOrderWizard.errorRequired';
    if (!orderInfo.specialization.trim()) next.specialization = 'createOrderWizard.errorRequired';
    if (Object.keys(next).length) { setErrors(next); return; }
    setErrors({});
    setStep(3);
  }

  function goBack() {
    if (step > 1) {
      setStep((s) => (s - 1) as CreateOrderStep);
      setErrors({});
    }
  }

  async function submitOrder() {
    const next: Partial<Record<string, string>> = {};
    if (!testInfo.testName.trim()) next.testName = 'createOrderWizard.errorRequired';
    if (!testInfo.collectionInstruction.trim()) next.collectionInstruction = 'createOrderWizard.errorRequired';
    if (Object.keys(next).length) { setErrors(next); return; }
    if (!selectedPatient) return;

    setIsSubmitting(true);
    try {
      await createDoctorLabOrder({
        patientId: selectedPatient.id,
        testName: testInfo.testName,
        testType: testInfo.testType,
        priority: testInfo.priority,
        sampleType: testInfo.testType,
        collectionInstruction: testInfo.collectionInstruction,
        additionalComment: testInfo.additionalComment,
      });
      store.addOrder(selectedPatient.id, {
        testName: testInfo.testName,
        priority: testInfo.priority,
        sampleType: testInfo.testType,
        collectionInstruction: testInfo.collectionInstruction,
        additionalComment: testInfo.additionalComment,
      });
      setIsSuccess(true);
    } catch (e) {
      const msg = (e as Error)?.message ?? 'Failed to create lab order';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    // patient search
    patientsStatus: status,
    patientQuery: query,
    setPatientQuery: setQuery,
    patients,
    // wizard
    step,
    selectedPatient,
    setSelectedPatient,
    orderInfo,
    setOrderInfo,
    testInfo,
    setTestInfo,
    errors,
    isSubmitting,
    isSuccess,
    // actions
    goToStep2,
    goToStep3,
    goBack,
    submitOrder,
  };
}
