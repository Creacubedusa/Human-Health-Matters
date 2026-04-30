import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSelectRole } from '@shared/hooks/useSelectRole';
import {
  SelectRoleView,
  type RoleOption,
} from '@shared/components/feedback/SelectRoleView';

export default function SelectRoleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedRole, setSelectedRole, handleContinue } = useSelectRole();

  const options: RoleOption[] = [
    {
      role: 'patient',
      title: t('selectRole.patient.title'),
      description: t('selectRole.patient.description'),
    },
    {
      role: 'doctor',
      title: t('selectRole.doctor.title'),
      description: t('selectRole.doctor.description'),
    },
    {
      role: 'donor',
      title: t('selectRole.donor.title'),
      description: t('selectRole.donor.description'),
    },
  ];

  async function onContinue() {
    await handleContinue();
    if (selectedRole === 'patient') router.replace('/(auth)/patient-get-started');
    else if (selectedRole === 'doctor') router.replace('/(auth)/patient-get-started');
    else if (selectedRole === 'donor') router.replace('/(donor)');
  }

  function onBack() {
    if (router.canGoBack()) router.back();
  }

  return (
    <SelectRoleView
      options={options}
      selectedRole={selectedRole}
      onSelectRole={setSelectedRole}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}
