import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { fn } from 'storybook/test';
import { LanguageOptionCard } from './LanguageOptionCard';

const meta: Meta<typeof LanguageOptionCard> = {
  title: 'Shared/UI/LanguageOptionCard',
  component: LanguageOptionCard,
  args: {
    onPress: fn(),
    languageCode: 'en',
    label: 'English (US)',
    flagEmoji: '🇺🇸',
    selected: false,
  },
  decorators: [
    (Story) => (
      <ScrollView contentContainerClassName="p-6 gap-6 bg-bg-default">
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── States ─────────────────────────────────────────────────────────────────

export const StateUnselected: Story = {
  name: 'State / Unselected',
  args: { selected: false, languageCode: 'en', label: 'English (US)', flagEmoji: '🇺🇸' },
};

export const StateSelected: Story = {
  name: 'State / Selected',
  args: { selected: true, languageCode: 'en', label: 'English (US)', flagEmoji: '🇺🇸' },
};

export const UnselectedSpanish: Story = {
  name: 'State / Unselected (Spanish)',
  args: { selected: false, languageCode: 'es', label: 'Spanish', flagEmoji: '🇪🇸' },
};

export const SelectedSpanish: Story = {
  name: 'State / Selected (Spanish)',
  args: { selected: true, languageCode: 'es', label: 'Spanish', flagEmoji: '🇪🇸' },
};

// ── Layout ─────────────────────────────────────────────────────────────────

export const BothOptions: Story = {
  name: 'Layout / Both Options (interactive)',
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <View className="gap-6">
        <LanguageOptionCard
          {...args}
          languageCode="en"
          label="English (US)"
          flagEmoji="🇺🇸"
          selected={selected === 'en'}
          onPress={() => setSelected('en')}
        />
        <LanguageOptionCard
          {...args}
          languageCode="es"
          label="Spanish"
          flagEmoji="🇪🇸"
          selected={selected === 'es'}
          onPress={() => setSelected('es')}
        />
      </View>
    );
  },
};

// ── Edge Cases ─────────────────────────────────────────────────────────────

export const LongLabel: Story = {
  name: 'Edge Cases / Long Label',
  args: {
    selected: false,
    languageCode: 'xx',
    label: 'Very Long Language Name That Should Not Overflow The Card',
    flagEmoji: '🏳',
  },
};
