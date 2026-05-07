import { create } from 'zustand';
import type {
  DoctorAudioRoute,
  DoctorCallStatus,
  DoctorChatMessage,
  DoctorConsultationPanel,
  DoctorPostSessionCarePlanDraft,
  DoctorPostSessionDiagnosisDraft,
  DoctorPostSessionPrescriptionDraft,
  DoctorPostSessionRecommendedTestDraft,
  DoctorLanguage,
  DoctorTranscriptEntry,
  DoctorTranscriptionStatus,
  SoapNote,
} from '../types/doctorConsultation.types';

const INITIAL_SOAP: SoapNote = { subjective: '', objective: '', assessment: '', plan: '' };

const INITIAL_PATIENT_MESSAGE: DoctorChatMessage = {
  id: 'patient-init',
  sender: 'patient',
  text: 'Hello doctor, I am ready for our consultation.',
  timestamp: new Date().toISOString(),
};

const INITIAL_AI_MESSAGE: DoctorChatMessage = {
  id: 'ai-init',
  sender: 'ai',
  text: 'Hey Doctor, find below the patient AI summary report.',
  timestamp: new Date().toISOString(),
};

interface DoctorConsultationState {
  callStatus: DoctorCallStatus;
  meetingUrl: string | null;
  videoOn: boolean;
  muted: boolean;
  audioRoute: DoctorAudioRoute;
  audioModalOpen: boolean;
  aiNoteActive: boolean;
  aiNoteConsentVisible: boolean;
  activePanel: DoctorConsultationPanel;
  endCallModalOpen: boolean;
  patientName: string;
  patientInitials: string;
  appointmentId: string;
  patientMessages: DoctorChatMessage[];
  patientInput: string;
  soapAiMessages: DoctorChatMessage[];
  soapAiInput: string;
  soapAiTyping: boolean;
  soap: SoapNote;
  soapSubmitting: boolean;
  postSessionDraft: DoctorPostSessionCarePlanDraft | null;
  transcriptionStatus: DoctorTranscriptionStatus;
  transcript: DoctorTranscriptEntry[];
  selectedLanguage: DoctorLanguage;

  setCallStatus: (status: DoctorCallStatus) => void;
  setMeetingUrl: (url: string | null) => void;
  setVideoOn: (on: boolean) => void;
  setMuted: (muted: boolean) => void;
  setAudioRoute: (route: DoctorAudioRoute) => void;
  setAudioModalOpen: (open: boolean) => void;
  setAiNoteActive: (active: boolean) => void;
  setAiNoteConsentVisible: (visible: boolean) => void;
  setActivePanel: (panel: DoctorConsultationPanel) => void;
  setEndCallModalOpen: (open: boolean) => void;
  setPatientSession: (name: string, initials: string, appointmentId: string) => void;
  addPatientMessage: (msg: DoctorChatMessage) => void;
  setPatientInput: (text: string) => void;
  addSoapAiMessage: (msg: DoctorChatMessage) => void;
  setSoapAiInput: (text: string) => void;
  setSoapAiTyping: (typing: boolean) => void;
  setSoap: (field: keyof SoapNote, value: string) => void;
  setSoapSubmitting: (submitting: boolean) => void;
  setPostSessionDraft: (draft: DoctorPostSessionCarePlanDraft | null) => void;
  updatePostSessionSoap: (field: keyof SoapNote, value: string) => void;
  updatePostSessionDiagnosis: (id: string, field: keyof DoctorPostSessionDiagnosisDraft, value: string) => void;
  addPostSessionDiagnosis: () => void;
  removePostSessionDiagnosis: (id: string) => void;
  updatePostSessionRecommendedTest: (id: string, value: string) => void;
  addPostSessionRecommendedTest: () => void;
  removePostSessionRecommendedTest: (id: string) => void;
  updatePostSessionPrescription: (id: string, field: keyof Omit<DoctorPostSessionPrescriptionDraft, 'id'>, value: string) => void;
  addPostSessionPrescription: () => void;
  removePostSessionPrescription: (id: string) => void;
  setTranscriptionStatus: (status: DoctorTranscriptionStatus) => void;
  addTranscriptEntry: (entry: DoctorTranscriptEntry) => void;
  setLanguage: (lang: DoctorLanguage) => void;
  reset: () => void;
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyDiagnosis(): DoctorPostSessionDiagnosisDraft {
  return {
    id: makeId('diagnosis'),
    name: '',
    icd10Code: '',
    priority: 'primary',
  };
}

function emptyRecommendedTest(): DoctorPostSessionRecommendedTestDraft {
  return {
    id: makeId('test'),
    name: '',
  };
}

function emptyPrescription(): DoctorPostSessionPrescriptionDraft {
  return {
    id: makeId('prescription'),
    medication: '',
    brandName: '',
    dose: '',
    frequency: '',
    duration: '',
    route: '',
    refillsLeft: '',
    notes: '',
  };
}

export const useDoctorConsultationStore = create<DoctorConsultationState>((set) => ({
  callStatus: 'connecting',
  meetingUrl: null,
  videoOn: true,
  muted: false,
  audioRoute: 'speaker',
  audioModalOpen: false,
  aiNoteActive: false,
  aiNoteConsentVisible: true,
  activePanel: 'none',
  endCallModalOpen: false,
  patientName: 'Patient',
  patientInitials: 'P',
  appointmentId: '',
  patientMessages: [INITIAL_PATIENT_MESSAGE],
  patientInput: '',
  soapAiMessages: [INITIAL_AI_MESSAGE],
  soapAiInput: '',
  soapAiTyping: false,
  soap: INITIAL_SOAP,
  soapSubmitting: false,
  postSessionDraft: null,
  transcriptionStatus: 'idle',
  transcript: [],
  selectedLanguage: 'en',

  setCallStatus: (status) => set({ callStatus: status }),
  setMeetingUrl: (url) => set({ meetingUrl: url }),
  setVideoOn: (on) => set({ videoOn: on }),
  setMuted: (muted) => set({ muted }),
  setAudioRoute: (route) => set({ audioRoute: route }),
  setAudioModalOpen: (open) => set({ audioModalOpen: open }),
  setAiNoteActive: (active) => set({ aiNoteActive: active }),
  setAiNoteConsentVisible: (visible) => set({ aiNoteConsentVisible: visible }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setEndCallModalOpen: (open) => set({ endCallModalOpen: open }),
  setPatientSession: (name, initials, appointmentId) =>
    set({
      patientName: name,
      patientInitials: initials,
      appointmentId,
      soapAiMessages: [
        {
          id: `ai-init-${appointmentId || 'patient'}`,
          sender: 'ai',
          text: `Hey Dr Paul, Find below ${name}'s AI summary report`,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  addPatientMessage: (msg) =>
    set((state) => ({ patientMessages: [...state.patientMessages, msg] })),
  setPatientInput: (text) => set({ patientInput: text }),
  addSoapAiMessage: (msg) =>
    set((state) => ({ soapAiMessages: [...state.soapAiMessages, msg] })),
  setSoapAiInput: (text) => set({ soapAiInput: text }),
  setSoapAiTyping: (typing) => set({ soapAiTyping: typing }),
  setSoap: (field, value) =>
    set((state) => ({ soap: { ...state.soap, [field]: value } })),
  setSoapSubmitting: (submitting) => set({ soapSubmitting: submitting }),
  setPostSessionDraft: (postSessionDraft) => set({ postSessionDraft }),
  updatePostSessionSoap: (field, value) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            soap: {
              ...state.postSessionDraft.soap,
              [field]: value,
            },
          }
        : null,
    })),
  updatePostSessionDiagnosis: (id, field, value) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            diagnoses: state.postSessionDraft.diagnoses.map((diagnosis) =>
              diagnosis.id !== id
                ? diagnosis
                : {
                    ...diagnosis,
                    [field]: value,
                  },
            ),
          }
        : null,
    })),
  addPostSessionDiagnosis: () =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            diagnoses: [...state.postSessionDraft.diagnoses, emptyDiagnosis()],
          }
        : null,
    })),
  removePostSessionDiagnosis: (id) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            diagnoses:
              state.postSessionDraft.diagnoses.length > 1
                ? state.postSessionDraft.diagnoses.filter((diagnosis) => diagnosis.id !== id)
                : state.postSessionDraft.diagnoses,
          }
        : null,
    })),
  updatePostSessionRecommendedTest: (id, value) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            recommendedTests: state.postSessionDraft.recommendedTests.map((test) =>
              test.id !== id ? test : { ...test, name: value },
            ),
          }
        : null,
    })),
  addPostSessionRecommendedTest: () =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            recommendedTests: [...state.postSessionDraft.recommendedTests, emptyRecommendedTest()],
          }
        : null,
    })),
  removePostSessionRecommendedTest: (id) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            recommendedTests:
              state.postSessionDraft.recommendedTests.length > 1
                ? state.postSessionDraft.recommendedTests.filter((test) => test.id !== id)
                : state.postSessionDraft.recommendedTests,
          }
        : null,
    })),
  updatePostSessionPrescription: (id, field, value) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            prescriptions: state.postSessionDraft.prescriptions.map((prescription) =>
              prescription.id !== id
                ? prescription
                : {
                    ...prescription,
                    [field]: value,
                  },
            ),
          }
        : null,
    })),
  addPostSessionPrescription: () =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            prescriptions: [...state.postSessionDraft.prescriptions, emptyPrescription()],
          }
        : null,
    })),
  removePostSessionPrescription: (id) =>
    set((state) => ({
      postSessionDraft: state.postSessionDraft
        ? {
            ...state.postSessionDraft,
            prescriptions:
              state.postSessionDraft.prescriptions.length > 1
                ? state.postSessionDraft.prescriptions.filter((prescription) => prescription.id !== id)
                : state.postSessionDraft.prescriptions,
          }
        : null,
    })),
  setTranscriptionStatus: (transcriptionStatus) => set({ transcriptionStatus }),
  addTranscriptEntry: (entry) => set((state) => ({ transcript: [...state.transcript, entry] })),
  setLanguage: (selectedLanguage) => set({ selectedLanguage }),
  reset: () =>
    set({
      callStatus: 'connecting',
      meetingUrl: null,
      videoOn: true,
      muted: false,
      audioRoute: 'speaker',
      audioModalOpen: false,
      aiNoteActive: false,
      aiNoteConsentVisible: true,
      activePanel: 'none',
      endCallModalOpen: false,
      patientName: 'Patient',
      patientInitials: 'P',
      appointmentId: '',
      patientMessages: [INITIAL_PATIENT_MESSAGE],
      patientInput: '',
      soapAiMessages: [INITIAL_AI_MESSAGE],
      soapAiInput: '',
      soapAiTyping: false,
      soap: INITIAL_SOAP,
      soapSubmitting: false,
      postSessionDraft: null,
      transcriptionStatus: 'idle',
      transcript: [],
      selectedLanguage: 'en',
    }),
}));
