// UI strings. Add en.ts / ru.ts with the same keys when translating.
export const lv = {
  'nav.products': 'Produkti',
  'nav.about': 'Par mums',
  'nav.portfolio': 'Portfolio',
  'nav.blog': 'Blogs',
  'nav.sale': 'Izpārdošana',
  'nav.contacts': 'Kontakti',
  'nav.tech': 'Tehniskā informācija',
  'nav.dealers': 'Dīleri Latvijā',
  'nav.menu': 'Izvēlne',
  'nav.close': 'Aizvērt',
  'cta.measure': 'Pieteikt mērīšanu',
  'cta.products': 'Apskatīt produktus',
  'cta.contact': 'Sazināties',
  'cta.more': 'Uzzināt vairāk',
  'cta.call': 'Zvanīt',
  'skip': 'Pāriet uz saturu',
  'home': 'Sākums',
  'gallery': 'Galerija',
  'related': 'Skatīt arī',
  'form.title': 'Jautājums? Raksti, atradīsim risinājumu!',
  'form.name': 'Jūsu vārds',
  'form.email': 'Jūsu e-pasts',
  'form.phone': 'Tālrunis (nav obligāts)',
  'form.message': 'Jautājums',
  'form.submit': 'Nosūtīt',
  'form.note': 'Atbildēsim darba dienas laikā.',
  'footer.useful': 'Noderīga informācija',
  'footer.privacy': 'Privātuma politika',
  'hours': 'Darba laiks',
} as const;

export type UiKey = keyof typeof lv;
const dict = { lv } as const;
export type Locale = keyof typeof dict;

export function t(key: UiKey, locale: Locale = 'lv'): string {
  return dict[locale][key];
}
