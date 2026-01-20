/**
 * React hook for accessing translations based on selected country
 */

import { useDashboardStore } from '@/store/dashboard-store';
import { getTranslations, countryToLanguage, type Translations, type Language } from '@/lib/translations';

export function useTranslation() {
  const selectedCountry = useDashboardStore((state) => state.selectedCountry);
  const t = getTranslations(selectedCountry);
  const language: Language = selectedCountry ? countryToLanguage[selectedCountry] : 'de';

  return { t, language, selectedCountry };
}

export type { Translations, Language };
