import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { Language, TranscriptEntry, TranscriptionStatus } from '../../types/consultation.types';

export interface LanguageTranscriptionCardProps {
  selectedLanguage: Language;
  transcriptionStatus: TranscriptionStatus;
  transcript: TranscriptEntry[];
  onSelectLanguage: (lang: Language) => void;
  onStartTranscription: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  activeTab: 'language' | 'transcription';
  onTabChange: (tab: 'language' | 'transcription') => void;
}

interface LangOption {
  code: Language;
  label: string;
}

const LANG_OPTIONS: LangOption[] = [
  { code: 'ar', label: 'Arabic' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Turkish' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
];

const LANG_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  ar: 'Arabic',
  tr: 'Turkish',
};

export function LanguageTranscriptionCard({
  selectedLanguage,
  transcriptionStatus,
  transcript,
  onSelectLanguage,
  onStartTranscription,
  expanded,
  onToggleExpanded,
  activeTab,
  onTabChange,
}: LanguageTranscriptionCardProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLangs = LANG_OPTIONS.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabs = ['language', 'transcription'] as const;
  const iconNameForTab = (tab: 'language' | 'transcription') =>
    tab === 'language' ? 'language-outline' : 'document-text-outline';

  function renderTab(tab: 'language' | 'transcription', showActive: boolean) {
    const isActive = activeTab === tab;

    return (
      <Pressable
        key={tab}
        className={`flex-1 flex-row items-center justify-center gap-2 ${
          showActive && isActive ? 'border-b-2 border-primary-500 bg-white' : ''
        }`}
        onPress={() => {
          onTabChange(tab);
          if (!expanded) onToggleExpanded();
        }}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <Ionicons
          name={iconNameForTab(tab)}
          size={22}
          color={primitiveColors['grey-900']}
        />
        <Text className={`text-c1 font-sans ${showActive && isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
          {tab === 'language' ? t('consultation.tabLanguage') : t('consultation.tabTranscription')}
        </Text>
      </Pressable>
    );
  }

  return (
    <View className="relative">
      {expanded ? (
        <View className="relative pt-3">
          <Pressable
            className="absolute right-6 top-0 z-20 h-8 w-8 items-center justify-center rounded-2xl bg-primary-500"
            onPress={onToggleExpanded}
            accessibilityRole="button"
            accessibilityLabel="Collapse"
          >
            <Ionicons name="chevron-down" size={20} color={primitiveColors.white} />
          </Pressable>

          <View className="overflow-hidden rounded-t-2xl bg-white shadow-200">
            <View className="h-[57px] flex-row bg-grey-50">
              {tabs.map((tab) => renderTab(tab, true))}
            </View>

            {activeTab === 'language' && (
              <View className="min-h-[213px] px-5 pb-5 pt-4">
                <Text className="text-s2 font-semibold font-sans text-text-primary">
                  {t('consultation.selectLanguage')}
                </Text>
                <View className="relative mt-4 h-8 flex-row items-center gap-2 rounded-[15px] border border-grey-300 bg-grey-50 px-4">
                  <Ionicons
                    name="search-outline"
                    size={16}
                    color={primitiveColors['grey-500']}
                  />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder=""
                    placeholderTextColor={primitiveColors['grey-500']}
                    className="flex-1 py-0 text-b3 leading-4 text-text-primary font-sans"
                  />
                  {!searchQuery ? (
                    <Text
                      pointerEvents="none"
                      className="absolute left-10 right-4 text-b3 leading-4 text-grey-500 font-sans"
                    >
                      {LANG_LABELS[selectedLanguage]}
                    </Text>
                  ) : null}
                </View>
                <ScrollView className="mt-4 max-h-[120px]" showsVerticalScrollIndicator>
                  <View className="gap-1 pr-3">
                    {filteredLangs.map((lang) => {
                      const isSelected = selectedLanguage === lang.code;

                      return (
                        <Pressable
                          key={lang.code}
                          className={`rounded px-4 py-2 ${isSelected ? 'bg-primary-50' : 'bg-white'}`}
                          onPress={() => onSelectLanguage(lang.code)}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: isSelected }}
                        >
                          <Text className="text-b3 font-sans text-text-primary">{lang.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {activeTab === 'transcription' && (
              <ScrollView className="max-h-[213px] px-5 pb-5 pt-4" showsVerticalScrollIndicator>
                {transcript.length === 0 ? (
                  <Pressable
                    className="flex-row items-center gap-2 py-3"
                    onPress={transcriptionStatus === 'idle' || transcriptionStatus === 'error' ? onStartTranscription : undefined}
                    accessibilityRole="button"
                  >
                    <Ionicons name={transcriptionStatus === 'requesting' ? 'hourglass-outline' : 'mic-outline'} size={18} color={primitiveColors['primary-500']} />
                    <Text className="text-b3 text-primary-500 font-sans">
                      {transcriptionStatus === 'requesting' ? t('consultation.transcriptionRequesting') : t('consultation.startTranscription')}
                    </Text>
                  </Pressable>
                ) : (
                  transcript.map((entry) => (
                    <View key={entry.id} className="mb-4 flex-row items-start gap-2">
                      <View className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50">
                        <Text className="text-[10px] font-semibold font-sans text-primary-600">
                          {entry.speaker.slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <Text className="flex-1 text-c1 font-sans leading-5 text-text-primary">
                        <Text className="text-c1 font-medium">{entry.speaker}: </Text>
                        {entry.translatedText}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </View>
      ) : (
        <View className="relative">
          <Pressable
            className="absolute -top-4 right-6 z-10 h-8 w-8 items-center justify-center rounded-2xl bg-primary-500"
            onPress={onToggleExpanded}
            accessibilityRole="button"
            accessibilityLabel="Expand"
          >
            <Ionicons name="chevron-up" size={20} color={primitiveColors.white} />
          </Pressable>

          <View className="mx-4 mb-4 mt-4 h-[57px] overflow-hidden rounded-2xl bg-grey-200">
            <View className="h-full flex-row">
              {tabs.map((tab) => renderTab(tab, false))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
