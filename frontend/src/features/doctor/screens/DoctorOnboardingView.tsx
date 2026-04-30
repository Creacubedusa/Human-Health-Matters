import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarUpload } from '@shared/components/ui/AvatarUpload';
import { Button } from '@shared/components/ui/Button';
import { TagInput } from '@shared/components/ui/TagInput';
import { uploadImageToCloudinary } from '@shared/api/cloudinary';
import { fetchDoctorProfile, setupDoctorProfile } from '../services/doctor.service';
import { useAuthStore } from '@shared/store/auth.store';

export interface DoctorOnboardingViewProps {
  onComplete: () => void;
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}

export function DoctorOnboardingView({ onComplete }: DoctorOnboardingViewProps) {
  const role = useAuthStore((s) => s.role);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(true);

  const initials = useMemo(() => initialsFromName('Doctor'), []);
  const canSave = specialties.length > 0 && role === 'doctor' && !isSaving && !isPrefilling;

  useEffect(() => {
    let mounted = true;
    async function prefill() {
      try {
        const res = await fetchDoctorProfile();
        if (!mounted) return;
        setAvatarUri(res.profile?.avatarUri ?? null);
        setSpecialties(res.profile?.specialties ?? []);
        setBio(res.profile?.bio ?? '');
      } finally {
        if (mounted) setIsPrefilling(false);
      }
    }
    void prefill();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave() {
    if (!canSave) return;
    setIsSaving(true);
    try {
      let uploadedAvatarUri = avatarUri ?? undefined;
      if (uploadedAvatarUri && uploadedAvatarUri.startsWith('file://')) {
        const result = await uploadImageToCloudinary({ uri: uploadedAvatarUri });
        uploadedAvatarUri = result.secureUrl;
      }

      await setupDoctorProfile({
        specialties,
        bio: bio.trim() ? bio.trim() : undefined,
        avatarUri: uploadedAvatarUri,
      });

      onComplete();
    } catch (e) {
      Alert.alert('Error', 'Unable to save doctor profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="pt-6 pb-2">
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            Doctor profile setup
          </Text>
          <Text className="text-b2 font-sans text-grey-500 mt-1">
            Add your specialty and a short bio to help patients understand how you can help.
          </Text>
        </View>

        <View className="mt-6 items-center">
          <AvatarUpload
            uri={avatarUri}
            onSelect={setAvatarUri}
            initials={initials}
            disabled={isSaving || isPrefilling}
            testID="doctor-avatar-upload"
          />
        </View>

        <View className="mt-8 gap-6">
          <TagInput
            label="Specialties"
            values={specialties}
            onChange={setSpecialties}
            placeholder="e.g. Cardiology"
            disabled={isSaving || isPrefilling}
            testID="doctor-specialties"
          />

          <View className="gap-2 w-full">
            <Text className="text-b2 text-grey-900 font-sans">Bio</Text>
            <View className="bg-grey-50 border-2 border-grey-200 rounded-md p-3">
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Write a short bio..."
                className="text-b1 font-sans text-grey-900 p-0"
                multiline
                editable={!isSaving && !isPrefilling}
              />
            </View>
          </View>
        </View>

        <View className="mt-10">
          <Button
            label="Save and continue"
            onPress={handleSave}
            variant="filled"
            size="large"
            fullWidth
            disabled={!canSave}
            iconLeft={isSaving || isPrefilling ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
            testID="doctor-onboarding-save"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

