import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { uploadImageToCloudinary } from '@shared/api/cloudinary';
import { kvDelete } from '@shared/storage/kv';
import { useAuthStore } from '@shared/store/auth.store';
import { capitalizeFirst } from '@shared/utils/text';
import { useDoctorStore } from '../store/doctor.store';
import { useDoctorProfileSetupStore } from '../store/doctorProfileSetup.store';
import { fetchDoctorProfile, updateDoctorProfile } from '../services/doctor.service';
import { ProfileSetupStep } from '../types/doctorProfileSetup.types';
import { DoctorProfileDocumentModal } from '../components/profile/DoctorProfileDocumentModal';
import { DoctorProfileFieldModal } from '../components/profile/DoctorProfileFieldModal';
import { DoctorProfileGenderModal } from '../components/profile/DoctorProfileGenderModal';

const TOKEN_KEY = 'hhm_access_token';

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}

function getDocumentLabel(uri: string | null, fallback: string) {
  if (!uri) return fallback;
  if (uri.startsWith('file://')) {
    const parts = uri.split('/');
    return decodeURIComponent(parts[parts.length - 1] ?? fallback);
  }
  return fallback;
}

function pickFirstText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  onPress?: () => void;
}

function InfoRow({ label, value, onPress }: InfoRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-2 py-[9px] rounded-lg bg-white"
      accessibilityRole="button"
    >
      <View className="flex-1 gap-1">
        <Text className="text-[14px] font-medium font-sans text-grey-900" numberOfLines={1}>
          {label}
        </Text>
        <Text className="text-[12px] font-sans text-grey-500" numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={primitiveColors['grey-500']} />
    </Pressable>
  );
}

interface CertRowProps {
  label: string;
  filename: string;
  onPress?: () => void;
}

function CertRow({ label, filename, onPress }: CertRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-2 py-[9px] rounded-lg bg-white"
      accessibilityRole="button"
    >
      <View className="flex-1 gap-1">
        <Text className="text-[14px] font-medium font-sans text-grey-900">{label}</Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="document-outline" size={16} color="#e53935" />
          <Text className="text-[12px] font-sans text-grey-500" numberOfLines={1}>
            {filename}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={primitiveColors['grey-500']} />
    </Pressable>
  );
}

interface SettingNavRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

function SettingNavRow({ icon, label, onPress }: SettingNavRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between h-[35px]"
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-4">
        <View className="h-5 w-5 shrink-0 items-center justify-center">
          {icon}
        </View>
        <Text className="text-[14px] font-sans text-grey-900">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={primitiveColors['grey-500']} />
    </Pressable>
  );
}

interface SettingToggleRowProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

function SettingToggleRow({ icon, label, value, onValueChange }: SettingToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between h-[35px]">
      <View className="flex-row items-center gap-4">
        <View className="h-5 w-5 shrink-0 items-center justify-center">
          {icon}
        </View>
        <Text className="text-[14px] font-sans text-grey-900">{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: primitiveColors['grey-300'], true: primitiveColors['primary-500'] }}
        thumbColor={primitiveColors.white}
      />
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function DoctorProfileView() {
  const { t } = useTranslation();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearDashboard = useDoctorStore((s) => s.clearDashboard);
  const setupForm = useDoctorProfileSetupStore((s) => s.form);
  const consentChecked = useDoctorProfileSetupStore((s) => s.consentChecked);
  const setSetupStep = useDoctorProfileSetupStore((s) => s.setStep);
  const updateCredentials = useDoctorProfileSetupStore((s) => s.updateCredentials);
  const updateDocuments = useDoctorProfileSetupStore((s) => s.updateDocuments);
  const updateProfessionalDetails = useDoctorProfileSetupStore((s) => s.updateProfessionalDetails);

  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [editField, setEditField] = useState<
    | 'name'
    | 'phone'
    | 'email'
    | 'gender'
    | 'npiNumber'
    | 'stateMedicalLicense'
    | 'deaNumber'
    | 'medicalSpecialty'
    | 'yearsOfExperience'
    | 'biography'
    | 'hospital'
    | 'officeAddress'
    | 'consultationFee'
    | 'medicalCertificate'
    | 'boardCertificate'
    | 'deaRegistration'
    | 'malpracticeInsurance'
    | null
  >(null);

  // Settings toggles (local state — persisted separately in a real app)
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [aiAssistanceOn, setAiAssistanceOn] = useState(true);

  const initials = useMemo(
    () => initialsFromName(name || t('doctorProfile.nameFallback')),
    [name, t],
  );

  const specialty = specialties[0] ?? '';
  const fullName = name || t('doctorProfile.nameFallback');
  const displayName = fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`;
  const displayAvatarUri = avatarUri ?? setupForm.personalDetails.profileImage;
  const displayGender = pickFirstText(gender, setupForm.personalDetails.gender);
  const professionalSpecialty = pickFirstText(setupForm.credentials.medicalSpecialty, specialty);
  const biography = pickFirstText(setupForm.professionalDetails.biography, bio);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus('loading');
      try {
        const res = await fetchDoctorProfile();
        if (!mounted) return;
        const computedName = [res.user?.firstName, res.user?.lastName]
          .filter(Boolean)
          .join(' ');
        setName(computedName);
        setEmail(res.user?.email ?? '');
        const rawPhone = [res.user?.phoneCountryCode, res.user?.phone]
          .filter(Boolean)
          .join('');
        setPhone(rawPhone);
        setGender((current) => pickFirstText(current, setupForm.personalDetails.gender));
        setAvatarUri(res.profile?.avatarUri ?? setupForm.personalDetails.profileImage ?? null);
        setSpecialties(
          res.profile?.specialties?.length
            ? res.profile.specialties
            : setupForm.credentials.medicalSpecialty
              ? [setupForm.credentials.medicalSpecialty]
              : [],
        );
        setBio(res.profile?.bio ?? setupForm.professionalDetails.biography ?? null);
        updateDocuments({
          medicalCertificate:
            res.profile?.medicalCertificate ?? setupForm.documents.medicalCertificate ?? null,
          boardCertificate:
            res.profile?.boardCertificate ?? setupForm.documents.boardCertificate ?? null,
          deaRegistration:
            res.profile?.deaRegistration ?? setupForm.documents.deaRegistration ?? null,
          malpracticeInsurance:
            res.profile?.malpracticeInsurance ?? setupForm.documents.malpracticeInsurance ?? null,
        });
        setOnboardingDone(!!res.profile?.onboardingCompletedAt);
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) setStatus('success');
      }
    }
    void load();
    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    Alert.alert(
      t('doctorProfile.logoutTitle'),
      t('doctorProfile.logoutSubtitle'),
      [
        { text: t('doctorProfile.logoutCancel'), style: 'cancel' },
        {
          text: t('doctorProfile.logoutConfirm'),
          style: 'destructive',
          onPress: async () => {
            clearAuth();
            clearDashboard();
            await kvDelete(TOKEN_KEY);
            await kvDelete('app_role');
            router.replace('/(auth)/patient-get-started');
          },
        },
      ],
    );
  }

  function getFirstUnfinishedSetupStep() {
    if (!setupForm.personalDetails.gender || !setupForm.personalDetails.dateOfBirth) {
      return ProfileSetupStep.PERSONAL;
    }

    if (
      !setupForm.credentials.npiNumber ||
      !setupForm.credentials.stateMedicalLicense ||
      !setupForm.credentials.medicalSpecialty ||
      !setupForm.documents.medicalCertificate ||
      !setupForm.documents.boardCertificate ||
      !setupForm.documents.malpracticeInsurance
    ) {
      return ProfileSetupStep.CREDENTIALS;
    }

    if (
      !setupForm.professionalDetails.yearsOfExperience ||
      !setupForm.professionalDetails.hospital ||
      !setupForm.professionalDetails.officeAddress ||
      !setupForm.professionalDetails.consultationFee ||
      !setupForm.professionalDetails.medicalSchool ||
      !setupForm.professionalDetails.biography
    ) {
      return ProfileSetupStep.SERVICE;
    }

    if (
      !setupForm.bankInfo.bankName ||
      !setupForm.bankInfo.accountName ||
      !setupForm.bankInfo.accountNumber ||
      !setupForm.bankInfo.sortCode ||
      !setupForm.practiceInfo.taxId ||
      !setupForm.practiceInfo.practiceName ||
      !setupForm.practiceInfo.billingAddress ||
      !setupForm.practiceInfo.zipCode ||
      !setupForm.practiceInfo.country
    ) {
      return ProfileSetupStep.BANK;
    }

    if (!consentChecked) {
      return ProfileSetupStep.REVIEW;
    }

    return ProfileSetupStep.REVIEW;
  }

  function handleResumeProfileSetup() {
    setSetupStep(getFirstUnfinishedSetupStep());
    router.push('/(auth)/doctor-profile-setup');
  }

  const dash = '—';
  const profileSetupPress = onboardingDone ? undefined : handleResumeProfileSetup;

  async function persistDocument(
    key: 'medicalCertificate' | 'boardCertificate' | 'deaRegistration' | 'malpracticeInsurance',
    uri: string | null,
  ) {
    try {
      const nextValue =
        uri && uri.startsWith('file://')
          ? (await uploadImageToCloudinary({
              uri,
              folder: 'doctor-certifications',
              filename: `${key}_${Date.now()}.jpg`,
            })).secureUrl
          : uri;

      const response = await updateDoctorProfile({ [key]: nextValue });
      const nextProfile = response.profile;

      updateDocuments({
        medicalCertificate:
          nextProfile?.medicalCertificate ?? setupForm.documents.medicalCertificate ?? null,
        boardCertificate:
          nextProfile?.boardCertificate ?? setupForm.documents.boardCertificate ?? null,
        deaRegistration:
          nextProfile?.deaRegistration ?? setupForm.documents.deaRegistration ?? null,
        malpracticeInsurance:
          nextProfile?.malpracticeInsurance ?? setupForm.documents.malpracticeInsurance ?? null,
      });
      setEditField(null);
    } catch {
      Alert.alert('Error', 'Unable to save certificate. Please try again.');
      throw new Error('certificate_save_failed');
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
      </SafeAreaView>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="bg-primary-50 h-[66px] justify-end">
          <View className="px-5 pb-3 h-[48px] justify-end items-center">
            <Text className="text-[16px] font-semibold font-sans text-grey-900">
              {t('doctorProfile.title')}
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-[15px] font-sans text-grey-700 text-center">
            {t('doctorProfile.error')}
          </Text>
          <Pressable
            className="bg-primary-500 rounded-xl px-6 py-3"
            onPress={() => router.replace('/(doctor)/profile')}
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-semibold font-sans text-white">
              {t('common.retry')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-grey-50" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-center px-5 pb-3 h-[48px]">
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('doctorProfile.title')}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-32 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Incomplete profile banner ──────────────────────────── */}
        {!onboardingDone && (
          <Pressable
            className="bg-yellow-50 border border-yellow-400 rounded-xl px-4 py-3 flex-row items-center gap-3"
            onPress={handleResumeProfileSetup}
            accessibilityRole="button"
          >
            <Ionicons name="alert-circle-outline" size={20} color={primitiveColors['yellow-500']} />
            <View className="flex-1">
              <Text className="text-[13px] font-semibold font-sans text-grey-900">
                {t('doctorProfile.incompleteTitle')}
              </Text>
              <Text className="text-[12px] font-sans text-grey-600 mt-0.5">
                {t('doctorProfile.incompleteSubtitle')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={primitiveColors['grey-500']} />
          </Pressable>
        )}

        {/* ── Avatar + Name + Badge ──────────────────────────────── */}
        <View className="items-center gap-4">
          {/* Avatar */}
          <View className="w-[100px] h-[100px] rounded-full bg-primary-100 items-center justify-center overflow-hidden border-2 border-primary-200">
            {displayAvatarUri ? (
              <Image
                source={{ uri: displayAvatarUri }}
                style={{ width: 100, height: 100 }}
                contentFit="cover"
              />
            ) : (
              <Text className="font-['Montserrat'] text-[42px] font-semibold leading-none text-primary-500">
                {initials}
              </Text>
            )}
          </View>

          {/* Name + specialty */}
          <View className="items-center gap-1">
            <Text className="text-[16px] font-semibold font-sans text-grey-900 text-center">
              {displayName}
            </Text>
            {!!professionalSpecialty && (
              <Text className="text-[12px] font-sans text-grey-500 text-center">
                {professionalSpecialty}
              </Text>
            )}
          </View>

          {/* Licensed Physician badge */}
          <View className="bg-[#e6f4ff] rounded-lg px-3 py-1 items-center justify-center">
            <Text className="text-[10px] font-semibold font-sans text-[#0095ff]">
              {t('doctorProfile.licensedBadge')}
            </Text>
          </View>
        </View>

        {/* ── Personal Information ────────────────────────────────── */}
        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-2">
          <Text className="text-[16px] font-semibold font-sans text-grey-900 mb-1">
            {t('doctorProfile.personalInfoTitle')}
          </Text>

          <InfoRow
            label={t('doctorProfile.fullNameLabel')}
            value={name || dash}
            onPress={() => setEditField('name')}
          />
          <InfoRow
            label={t('doctorProfile.genderLabel')}
            value={capitalizeFirst(displayGender) || dash}
            onPress={() => setEditField('gender')}
          />
          <InfoRow
            label={t('doctorProfile.phoneLabel')}
            value={phone || dash}
            onPress={() => setEditField('phone')}
          />
          <InfoRow
            label={t('doctorProfile.emailLabel')}
            value={email || dash}
            onPress={() => setEditField('email')}
          />
        </View>

        {/* ── Your Earning ────────────────────────────────────────── */}
        <Pressable
          className="bg-primary-50 rounded-2xl p-4 flex-row items-center gap-3"
          onPress={() => router.push('/(doctor)/earning')}
          accessibilityRole="button"
        >
          <View className="w-8 h-8 items-center justify-center">
            <Ionicons name="cash-outline" size={28} color={primitiveColors['primary-500']} />
          </View>
          <View className="flex-1 gap-2">
            <Text className="text-[16px] font-semibold font-sans text-grey-900">
              {t('doctorProfile.earningTitle')}
            </Text>
            <Text className="text-[14px] font-medium font-sans text-grey-500">
              {t('doctorProfile.earningSubtitle')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={primitiveColors['grey-500']} />
        </Pressable>

        {/* ── Professional Information ────────────────────────────── */}
        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-2">
          <Text className="text-[16px] font-semibold font-sans text-grey-900 mb-1">
            {t('doctorProfile.professionalInfoTitle')}
          </Text>

          <InfoRow
            label={t('doctorProfile.npiLabel')}
            value={setupForm.credentials.npiNumber || dash}
            onPress={() => setEditField('npiNumber')}
          />
          <InfoRow
            label={t('doctorProfile.stateLicenseLabel')}
            value={setupForm.credentials.stateMedicalLicense || dash}
            onPress={() => setEditField('stateMedicalLicense')}
          />
          <InfoRow
            label={t('doctorProfile.deaLabel')}
            value={setupForm.credentials.deaNumber || dash}
            onPress={() => setEditField('deaNumber')}
          />
          <InfoRow
            label={t('doctorProfile.specialtyLabel')}
            value={professionalSpecialty || dash}
            onPress={() => setEditField('medicalSpecialty')}
          />
          <InfoRow
            label={t('doctorProfile.experienceLabel')}
            value={setupForm.professionalDetails.yearsOfExperience || dash}
            onPress={() => setEditField('yearsOfExperience')}
          />
          <InfoRow
            label={t('doctorProfile.biographyLabel')}
            value={biography || dash}
            onPress={() => setEditField('biography')}
          />
          <InfoRow
            label={t('doctorProfile.hospitalLabel')}
            value={setupForm.professionalDetails.hospital || dash}
            onPress={() => setEditField('hospital')}
          />
          <InfoRow
            label={t('doctorProfile.officeAddressLabel')}
            value={setupForm.professionalDetails.officeAddress || dash}
            onPress={() => setEditField('officeAddress')}
          />
          <InfoRow
            label={t('doctorProfile.consultationFeeLabel')}
            value={setupForm.professionalDetails.consultationFee || dash}
            onPress={() => setEditField('consultationFee')}
          />
        </View>

        {/* ── Certifications ──────────────────────────────────────── */}
        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-2">
          <Text className="text-[16px] font-semibold font-sans text-grey-900 mb-1">
            {t('doctorProfile.certificationsTitle')}
          </Text>

          <CertRow
            label={t('doctorProfile.medicalCertLabel')}
            filename={getDocumentLabel(setupForm.documents.medicalCertificate, t('doctorProfile.medicalCertFile'))}
            onPress={() => setEditField('medicalCertificate')}
          />
          <CertRow
            label={t('doctorProfile.boardCertLabel')}
            filename={getDocumentLabel(setupForm.documents.boardCertificate, t('doctorProfile.boardCertFile'))}
            onPress={() => setEditField('boardCertificate')}
          />
          <CertRow
            label={t('doctorProfile.deaRegLabel')}
            filename={getDocumentLabel(setupForm.documents.deaRegistration, t('doctorProfile.deaRegFile'))}
            onPress={() => setEditField('deaRegistration')}
          />
          <CertRow
            label={t('doctorProfile.malpracticeLabel')}
            filename={getDocumentLabel(setupForm.documents.malpracticeInsurance, t('doctorProfile.malpracticeFile'))}
            onPress={() => setEditField('malpracticeInsurance')}
          />
        </View>

        {/* ── Settings ────────────────────────────────────────────── */}
        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-4">
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('doctorProfile.settingsTitle')}
          </Text>

          <SettingToggleRow
            icon={
              <Ionicons
                name="notifications-outline"
                size={16}
                color={primitiveColors['primary-500']}
              />
            }
            label={t('doctorProfile.settingNotifications')}
            value={notificationsOn}
            onValueChange={setNotificationsOn}
          />

          <SettingToggleRow
            icon={
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={primitiveColors['primary-500']}
              />
            }
            label={t('doctorProfile.settingAIAssistance')}
            value={aiAssistanceOn}
            onValueChange={setAiAssistanceOn}
          />

          <SettingNavRow
            icon={
              <Ionicons
                name="calendar-clear-outline"
                size={16}
                color={primitiveColors['primary-500']}
              />
            }
            label={t('doctorProfile.settingAvailability')}
            onPress={() => router.push('/(doctor)/availability')}
          />

          <SettingNavRow
            icon={
              <MaterialCommunityIcons
                name="translate"
                size={16}
                color={primitiveColors['primary-500']}
              />
            }
            label={t('doctorProfile.settingLanguage')}
            onPress={() => router.push('/(auth)/select-language')}
          />

          <SettingNavRow
            icon={
              <Ionicons
                name="document-text-outline"
                size={16}
                color={primitiveColors['primary-500']}
              />
            }
            label={t('doctorProfile.settingPrivacyPolicy')}
            onPress={() => router.push('/(doctor)/privacy-policy')}
          />
        </View>

        {/* ── Logout ──────────────────────────────────────────────── */}
        <Pressable
          onPress={handleLogout}
          className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 items-center"
          accessibilityRole="button"
        >
          <Text className="text-[15px] font-semibold font-sans text-red-500">
            {t('doctorProfile.logout')}
          </Text>
        </Pressable>
      </ScrollView>

      {/* ── Personal info edit modals ─────────────────────────────────────── */}
      <DoctorProfileFieldModal
        visible={editField === 'name'}
        label={t('doctorProfile.editFullNameLabel')}
        value={name}
        onClose={() => setEditField(null)}
        onSave={(v) => { setName(v); setEditField(null); }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'phone'}
        label={t('doctorProfile.editPhoneLabel')}
        value={phone}
        keyboardType="phone-pad"
        onClose={() => setEditField(null)}
        onSave={(v) => { setPhone(v); setEditField(null); }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'email'}
        label={t('doctorProfile.editEmailLabel')}
        value={email}
        keyboardType="email-address"
        onClose={() => setEditField(null)}
        onSave={(v) => { setEmail(v); setEditField(null); }}
      />
      <DoctorProfileGenderModal
        visible={editField === 'gender'}
        value={gender}
        onClose={() => setEditField(null)}
        onSave={(v) => { setGender(v); setEditField(null); }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'npiNumber'}
        label={t('doctorProfile.npiLabel')}
        value={setupForm.credentials.npiNumber}
        keyboardType="numeric"
        maxLength={10}
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateCredentials({ npiNumber: v });
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'stateMedicalLicense'}
        label={t('doctorProfile.stateLicenseLabel')}
        value={setupForm.credentials.stateMedicalLicense}
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateCredentials({ stateMedicalLicense: v });
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'deaNumber'}
        label={t('doctorProfile.deaLabel')}
        value={setupForm.credentials.deaNumber}
        keyboardType="numeric"
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateCredentials({ deaNumber: v });
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'medicalSpecialty'}
        label={t('doctorProfile.specialtyLabel')}
        value={setupForm.credentials.medicalSpecialty || specialty}
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateCredentials({ medicalSpecialty: v });
          setSpecialties(v ? [v] : []);
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'yearsOfExperience'}
        label={t('doctorProfile.experienceLabel')}
        value={setupForm.professionalDetails.yearsOfExperience}
        keyboardType="numeric"
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateProfessionalDetails({ yearsOfExperience: v });
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'biography'}
        label={t('doctorProfile.biographyLabel')}
        value={biography}
        multiline
        numberOfLines={5}
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateProfessionalDetails({ biography: v });
          setBio(v || null);
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'hospital'}
        label={t('doctorProfile.hospitalLabel')}
        value={setupForm.professionalDetails.hospital}
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateProfessionalDetails({ hospital: v });
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'officeAddress'}
        label={t('doctorProfile.officeAddressLabel')}
        value={setupForm.professionalDetails.officeAddress}
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateProfessionalDetails({ officeAddress: v });
          setEditField(null);
        }}
      />
      <DoctorProfileFieldModal
        visible={editField === 'consultationFee'}
        label={t('doctorProfile.consultationFeeLabel')}
        value={setupForm.professionalDetails.consultationFee}
        keyboardType="decimal-pad"
        onClose={() => setEditField(null)}
        onSave={(v) => {
          updateProfessionalDetails({ consultationFee: v });
          setEditField(null);
        }}
      />
      <DoctorProfileDocumentModal
        visible={editField === 'medicalCertificate'}
        title={t('doctorProfile.medicalCertModalTitle')}
        value={setupForm.documents.medicalCertificate}
        emptyLabel={t('doctorProfile.medicalCertFile')}
        uploadPlaceholder={t('doctorProfile.uploadPlaceholder')}
        onClose={() => setEditField(null)}
        onSave={(value) => persistDocument('medicalCertificate', value)}
      />
      <DoctorProfileDocumentModal
        visible={editField === 'boardCertificate'}
        title={t('doctorProfile.boardCertModalTitle')}
        value={setupForm.documents.boardCertificate}
        emptyLabel={t('doctorProfile.boardCertFile')}
        uploadPlaceholder={t('doctorProfile.uploadPlaceholder')}
        onClose={() => setEditField(null)}
        onSave={(value) => persistDocument('boardCertificate', value)}
      />
      <DoctorProfileDocumentModal
        visible={editField === 'deaRegistration'}
        title={t('doctorProfile.deaModalTitle')}
        value={setupForm.documents.deaRegistration}
        emptyLabel={t('doctorProfile.deaRegFile')}
        uploadPlaceholder={t('doctorProfile.uploadPlaceholder')}
        onClose={() => setEditField(null)}
        onSave={(value) => persistDocument('deaRegistration', value)}
      />
      <DoctorProfileDocumentModal
        visible={editField === 'malpracticeInsurance'}
        title={t('doctorProfile.malpracticeModalTitle')}
        value={setupForm.documents.malpracticeInsurance}
        emptyLabel={t('doctorProfile.malpracticeFile')}
        uploadPlaceholder={t('doctorProfile.uploadPlaceholder')}
        onClose={() => setEditField(null)}
        onSave={(value) => persistDocument('malpracticeInsurance', value)}
      />
    </SafeAreaView>
  );
}
