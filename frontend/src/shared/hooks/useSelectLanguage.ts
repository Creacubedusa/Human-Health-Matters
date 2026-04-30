import { useCallback, useEffect, useState } from 'react';
import i18n from '@shared/i18n/config';
import { kvGet, kvSet } from '@shared/storage/kv';

const LANGUAGE_KEY = 'app_language';

export interface UseSelectLanguageReturn {
  selectedCode: string | null;
  setSelectedCode: (code: string) => void;
  handleSave: () => Promise<void>;
}

export function useSelectLanguage(): UseSelectLanguageReturn {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    kvGet(LANGUAGE_KEY).then((stored) => {
      if (stored) setSelectedCode(stored);
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (selectedCode !== null) {
      await kvSet(LANGUAGE_KEY, selectedCode);
      await i18n.changeLanguage(selectedCode);
    }
  }, [selectedCode]);

  return { selectedCode, setSelectedCode, handleSave };
}
