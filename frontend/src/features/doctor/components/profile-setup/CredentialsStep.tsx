import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@shared/components/ui/Input';
import { UploadInput } from '@shared/components/ui/UploadInput';
import type { CredentialDetails, DocumentUploads } from '../../types/doctorProfileSetup.types';

export interface CredentialsStepProps {
  credentials: CredentialDetails;
  documents: DocumentUploads;
  onChangeCredentials: (data: Partial<CredentialDetails>) => void;
  onChangeDocuments: (data: Partial<DocumentUploads>) => void;
  testID?: string;
}

export function CredentialsStep({
  credentials,
  documents,
  onChangeCredentials,
  onChangeDocuments,
  testID,
}: CredentialsStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-2 pb-8 gap-6"
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      <View className="gap-1">
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('doctorProfileSetup.credentials.heading')}
        </Text>
        <Text className="text-b3 font-sans text-grey-500">
          {t('doctorProfileSetup.credentials.subtitle')}
        </Text>
      </View>

      <View className="gap-4">
        <Input
          label={t('doctorProfileSetup.credentials.npiLabel')}
          placeholder={t('doctorProfileSetup.credentials.npiPlaceholder')}
          value={credentials.npiNumber}
          onChangeText={(v) => onChangeCredentials({ npiNumber: v })}
          keyboardType="numeric"
          maxLength={10}
          testID="credentials-npi"
        />

        <Input
          label={t('doctorProfileSetup.credentials.licenseLabel')}
          placeholder={t('doctorProfileSetup.credentials.licensePlaceholder')}
          value={credentials.stateMedicalLicense}
          onChangeText={(v) => onChangeCredentials({ stateMedicalLicense: v })}
          testID="credentials-license"
        />

        <Input
          label={t('doctorProfileSetup.credentials.deaLabel')}
          placeholder={t('doctorProfileSetup.credentials.deaPlaceholder')}
          value={credentials.deaNumber}
          onChangeText={(v) => onChangeCredentials({ deaNumber: v })}
          testID="credentials-dea"
        />

        <Input
          label={t('doctorProfileSetup.credentials.specialtyLabel')}
          placeholder={t('doctorProfileSetup.credentials.specialtyPlaceholder')}
          value={credentials.medicalSpecialty}
          onChangeText={(v) => onChangeCredentials({ medicalSpecialty: v })}
          testID="credentials-specialty"
        />
      </View>

      <View className="gap-4">
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('doctorProfileSetup.credentials.documentsHeading')}
        </Text>

        <UploadInput
          label={t('doctorProfileSetup.credentials.medCertLabel')}
          placeholder={t('doctorProfileSetup.credentials.uploadPlaceholder')}
          value={documents.medicalCertificate}
          onChange={(uri) => onChangeDocuments({ medicalCertificate: uri })}
          testID="credentials-med-cert"
        />

        <UploadInput
          label={t('doctorProfileSetup.credentials.boardCertLabel')}
          placeholder={t('doctorProfileSetup.credentials.uploadPlaceholder')}
          value={documents.boardCertificate}
          onChange={(uri) => onChangeDocuments({ boardCertificate: uri })}
          testID="credentials-board-cert"
        />

        <UploadInput
          label={t('doctorProfileSetup.credentials.deaRegLabel')}
          placeholder={t('doctorProfileSetup.credentials.uploadPlaceholder')}
          value={documents.deaRegistration}
          onChange={(uri) => onChangeDocuments({ deaRegistration: uri })}
          testID="credentials-dea-reg"
        />

        <UploadInput
          label={t('doctorProfileSetup.credentials.malpracticeLabel')}
          placeholder={t('doctorProfileSetup.credentials.uploadPlaceholder')}
          value={documents.malpracticeInsurance}
          onChange={(uri) => onChangeDocuments({ malpracticeInsurance: uri })}
          testID="credentials-malpractice"
        />
      </View>
    </ScrollView>
  );
}
