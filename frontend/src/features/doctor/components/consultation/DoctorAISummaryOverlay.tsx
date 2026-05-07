import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { DoctorConsultationAISummary } from '../../utils/consultationAiSummary';

export interface DoctorAISummaryOverlayProps {
  open: boolean;
  summary: DoctorConsultationAISummary | null;
  onToggle: () => void;
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View className="gap-1">
      <Text className="text-[11px] font-semibold font-sans uppercase tracking-[0.4px] text-grey-500">
        {label}
      </Text>
      <Text className="text-b3 font-sans leading-5 text-grey-900">{value}</Text>
    </View>
  );
}

export function DoctorAISummaryOverlay({
  open,
  summary,
  onToggle,
}: DoctorAISummaryOverlayProps) {
  if (!summary) return null;

  return (
    <View className="absolute left-[6px] top-[188px] z-20 items-start">
      {open ? (
        <View
          className="ml-2 w-[286px] overflow-hidden rounded-[20px] border border-primary-100 bg-white"
          style={{
            shadowColor: '#131927',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 28,
            elevation: 12,
          }}
        >
          <View className="flex-row items-center justify-between bg-primary-500 px-4 py-3">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Ionicons name="document-text-outline" size={18} color="#ffffff" />
              </View>
              <Text className="text-s2 font-semibold font-sans text-white">AI Summary</Text>
            </View>

            <Pressable
              onPress={onToggle}
              className="h-8 w-8 items-center justify-center rounded-full bg-white/15"
              accessibilityRole="button"
              accessibilityLabel="Close AI summary"
            >
              <Ionicons name="close" size={18} color="#ffffff" />
            </Pressable>
          </View>

          <ScrollView
            className="max-h-[360px]"
            contentContainerClassName="gap-4 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-xl bg-grey-50 px-3 py-3">
                <Text className="text-[11px] font-semibold font-sans uppercase text-grey-500">
                  Height
                </Text>
                <Text className="mt-1 text-b3 font-semibold font-sans text-grey-900">
                  {summary.height}
                </Text>
              </View>
              <View className="flex-1 rounded-xl bg-grey-50 px-3 py-3">
                <Text className="text-[11px] font-semibold font-sans uppercase text-grey-500">
                  Weight
                </Text>
                <Text className="mt-1 text-b3 font-semibold font-sans text-grey-900">
                  {summary.weight}
                </Text>
              </View>
              <View className="w-[74px] rounded-xl bg-grey-50 px-3 py-3">
                <Text className="text-[11px] font-semibold font-sans uppercase text-grey-500">
                  Age
                </Text>
                <Text className="mt-1 text-b3 font-semibold font-sans text-grey-900">
                  {summary.age}
                </Text>
              </View>
            </View>

            <SummaryRow label="Chief complaint" value={summary.chiefComplaint} />
            <SummaryRow label="AI symptoms summary" value={summary.aiSymptomsSummary} />
            <SummaryRow label="Proposed test by AI" value={summary.proposedTest} />
            <SummaryRow
              label="Suggested first question by AI"
              value={summary.suggestedFirstQuestion}
            />
          </ScrollView>
        </View>
      ) : (
        <Pressable
          onPress={onToggle}
          className="h-12 w-12 items-center justify-center rounded-full bg-primary-500"
          accessibilityRole="button"
          accessibilityLabel="Open AI summary"
          style={{
            shadowColor: '#131927',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={primitiveColors.white}
          />
        </Pressable>
      )}
    </View>
  );
}
