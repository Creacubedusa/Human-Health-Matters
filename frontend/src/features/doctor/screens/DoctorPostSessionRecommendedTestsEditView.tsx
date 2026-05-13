import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type { DoctorPostSessionRecommendedTestDraft } from '../types/doctorConsultation.types';

interface DoctorPostSessionRecommendedTestsEditViewProps {
  tests: DoctorPostSessionRecommendedTestDraft[];
  onSave: (tests: DoctorPostSessionRecommendedTestDraft[]) => void;
  onCancel: () => void;
}

function makeId() {
  return `test-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlankTest(): DoctorPostSessionRecommendedTestDraft {
  return {
    id: makeId(),
    name: '',
  };
}

function TestInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">{label}</Text>
      <View className="rounded-[12px] border border-grey-200 bg-grey-50 px-4 py-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-[16px] font-sans leading-6 text-grey-900"
          placeholder=""
          placeholderTextColor={primitiveColors['grey-400']}
        />
      </View>
    </View>
  );
}

export function DoctorPostSessionRecommendedTestsEditView({
  tests,
  onSave,
  onCancel,
}: DoctorPostSessionRecommendedTestsEditViewProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<DoctorPostSessionRecommendedTestDraft[]>(
    tests.length > 0 ? tests : [createBlankTest()],
  );

  function updateTest(id: string, value: string) {
    setDraft((current) =>
      current.map((test) => (test.id !== id ? test : { ...test, name: value })),
    );
  }

  function addMore() {
    setDraft((current) => [...current, createBlankTest()]);
  }

  function removeTest(id: string) {
    setDraft((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="h-[120px] bg-primary-50">
        <View className="mt-[47px] h-[66px] flex-row items-center justify-between px-4">
          <HeaderBackButton onPress={onCancel} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">Recommended Test</Text>
          <View className="h-[29px] w-[29px]" />
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1 bg-white"
          contentContainerClassName="px-3 pb-32 pt-3"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4">
            <Text className="text-[18px] font-semibold font-sans leading-7 text-grey-900">
              Recommended Test
            </Text>

            {draft.map((test, index) => (
              <View key={test.id} className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] font-medium font-sans text-grey-900">
                    Test {index + 1}
                  </Text>
                  {draft.length > 1 ? (
                    <Pressable
                      onPress={() => removeTest(test.id)}
                      className="h-6 w-6 items-center justify-center"
                    >
                      <Ionicons name="trash-outline" size={18} color={primitiveColors['red-500']} />
                    </Pressable>
                  ) : null}
                </View>

                <TestInput
                  label={`Test ${index + 1}`}
                  value={test.name}
                  onChangeText={(value) => updateTest(test.id, value)}
                />
              </View>
            ))}

            <Pressable
              onPress={addMore}
              className="h-10 self-end rounded-[12px] border border-grey-300 px-4 items-center justify-center"
            >
              <Text className="text-[14px] font-semibold font-sans text-grey-900">Add More</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <Button
            label="Cancel"
            variant="outline"
            size="large"
            onPress={onCancel}
            testID="recommended-tests-edit-cancel"
          />
          <Button
            label="Save"
            size="large"
            onPress={() => onSave(draft)}
            testID="recommended-tests-edit-save"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
