import { useState } from 'react';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { useDoctorConsultationStore } from '../store/doctorConsultation.store';
import type { DoctorPrescriptionDraft } from '../types/doctor.types';

const BLANK_DRAFT: DoctorPrescriptionDraft = {
  medication: '',
  brandName: '',
  dose: '',
  frequency: '',
  duration: '',
  route: '',
  refillsLeft: '',
  notes: '',
};

function isBlockValid(block: DoctorPrescriptionDraft): boolean {
  return (
    block.medication.trim().length > 0 &&
    block.dose.trim().length > 0 &&
    block.frequency.trim().length > 0 &&
    block.duration.trim().length > 0 &&
    block.route.trim().length > 0
  );
}

export function useDoctorAddMultiPrescription(patientId: string, returnTo?: string) {
  const addPrescription = useDoctorPatientsStore((state) => state.addPrescription);

  const [blocks, setBlocks] = useState<DoctorPrescriptionDraft[]>([{ ...BLANK_DRAFT }]);
  const [invalidBlocks, setInvalidBlocks] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addBlock() {
    setBlocks((prev) => [...prev, { ...BLANK_DRAFT }]);
  }

  function removeBlock(index: number) {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setInvalidBlocks((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const n = Number(k);
        if (n < index) next[n] = v;
        else if (n > index) next[n - 1] = v;
      });
      return next;
    });
  }

  function updateField(index: number, field: keyof DoctorPrescriptionDraft, value: string) {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, [field]: value } : block)),
    );
    if (invalidBlocks[index]) {
      setInvalidBlocks((prev) => ({ ...prev, [index]: false }));
    }
  }

  async function save(): Promise<boolean> {
    const next: Record<number, boolean> = {};
    let hasError = false;
    blocks.forEach((block, i) => {
      if (!isBlockValid(block)) {
        next[i] = true;
        hasError = true;
      }
    });
    setInvalidBlocks(next);
    if (hasError) return false;

    setIsSubmitting(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    blocks.forEach((block) => addPrescription(patientId, block));

    if (returnTo === 'post-session-care-plan') {
      blocks.forEach((block) => {
        const state = useDoctorConsultationStore.getState();
        const draft = state.postSessionDraft;
        if (!draft) return;
        const blank = draft.prescriptions.find((p) => !p.medication.trim());
        if (blank) {
          state.updatePostSessionPrescription(blank.id, 'medication', block.medication);
          state.updatePostSessionPrescription(blank.id, 'brandName', block.brandName);
          state.updatePostSessionPrescription(blank.id, 'dose', block.dose);
          state.updatePostSessionPrescription(blank.id, 'frequency', block.frequency);
          state.updatePostSessionPrescription(blank.id, 'duration', block.duration);
          state.updatePostSessionPrescription(blank.id, 'route', block.route);
          state.updatePostSessionPrescription(blank.id, 'refillsLeft', block.refillsLeft);
          state.updatePostSessionPrescription(blank.id, 'notes', block.notes);
        } else {
          state.addPostSessionPrescription();
          const latest =
            state.postSessionDraft?.prescriptions[
              (state.postSessionDraft?.prescriptions.length ?? 1) - 1
            ];
          if (latest) {
            state.updatePostSessionPrescription(latest.id, 'medication', block.medication);
            state.updatePostSessionPrescription(latest.id, 'brandName', block.brandName);
            state.updatePostSessionPrescription(latest.id, 'dose', block.dose);
            state.updatePostSessionPrescription(latest.id, 'frequency', block.frequency);
            state.updatePostSessionPrescription(latest.id, 'duration', block.duration);
            state.updatePostSessionPrescription(latest.id, 'route', block.route);
            state.updatePostSessionPrescription(latest.id, 'refillsLeft', block.refillsLeft);
            state.updatePostSessionPrescription(latest.id, 'notes', block.notes);
          }
        }
      });
    }

    setIsSubmitting(false);
    return true;
  }

  return { blocks, invalidBlocks, isSubmitting, addBlock, removeBlock, updateField, save };
}
