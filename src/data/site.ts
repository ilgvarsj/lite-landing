export const company = {
  name: 'LITE',
  legalName: 'SIA LITE',
  founded: 1997,
  url: 'https://lite.lv',
  phone: '+371 67619001',
  phoneHref: 'tel:+37167619001',
  email: 'info@lite.lv',
  socials: {
    facebook: 'https://www.facebook.com/lite.zaluzijas/',
    instagram: 'https://www.instagram.com/lite.lv/',
  },
};

export type Location = {
  id: string;
  name: string;
  street: string;
  city: string;
  area: string;
  phone: string;
  mobile: string;
  email: string;
  hours: { days: string; time: string }[];
  note?: string;
  maps: string;
  waze: string;
  embed: string;
};

export const locations: Location[] = [
  {
    id: 'fabrika',
    name: 'Fabrika – salons',
    street: 'Krūzes iela 3',
    city: 'Rīga',
    area: 'Pārdaugava',
    phone: '+371 67619001',
    mobile: '+371 29605689',
    email: 'info@lite.lv',
    hours: [
      { days: 'P.–Pk.', time: '8:30–17:00' },
      { days: 'S., Sv.', time: 'slēgts' },
    ],
    note: 'Teritorijā bezmaksas autostāvvieta',
    maps: 'https://goo.gl/maps/S2AnNLxiCD45nafG7',
    waze: 'https://ul.waze.com/ul?preview_venue_id=15794745.157619774.3517864&navigate=yes',
    embed: 'https://maps.google.com/maps?q=Kr%C5%ABzes%20iela%203%2C%20R%C4%ABga&t=m&z=14&output=embed&iwloc=near',
  },
  {
    id: 'salons',
    name: 'Aizkaru salons Lites Deko',
    street: 'Tērbatas iela 93/95',
    city: 'Rīga',
    area: 'Rīgas centrs',
    phone: '+371 67842781',
    mobile: '+371 29605688',
    email: 'salons@lite.lv',
    hours: [
      { days: 'P.–Pk.', time: '9:00–18:00' },
      { days: 'S., Sv.', time: 'slēgts' },
    ],
    maps: 'https://goo.gl/maps/4Skf29tdX7brhxXw9',
    waze: 'https://ul.waze.com/ul?preview_venue_id=15794746.158209600.9444756&navigate=yes',
    embed: 'https://maps.google.com/maps?q=T%C4%93rbatas%20iela%2093%2C%20R%C4%ABga&t=m&z=14&output=embed&iwloc=near',
  },
];

export const telHref = (phone: string) => 'tel:' + phone.replace(/[^+\d]/g, '');

/** Top-level product groups, in display order (ids = content folder names). */
export const categoryOrder = [
  'zaluzijas',
  'aizkari',
  'ara-enosanas-sistemas',
  'motorizetas-sistemas',
  'rullo-aizsargzaluzijas',
  'aizkaru-stangas-sliedes',
  'aizkaru-aksesuari',
  'moskitu-tikli',
  'gatava-produkcija',
];

/** Short marketing blurbs for category cards (homepage + overview). */
export const categoryBlurbs: Record<string, string> = {
  zaluzijas: 'Rullo, plisētās, koka, vertikālās un citas – izgatavotas pēc jūsu loga izmēriem.',
  aizkari: 'Dienas un nakts aizkari no vairāk nekā 20 Eiropas audumu ražotājiem, šūti pēc pasūtījuma.',
  'ara-enosanas-sistemas': 'Markīzes, saulessargi, āra rullo un horizontālās žalūzijas terasei un fasādei.',
  'motorizetas-sistemas': 'Žalūzijas un aizkari, kas darbojas ar pulti, slēdzi vai viedtālruni.',
  'rullo-aizsargzaluzijas': 'Aizsargslēģi un restes mājai, garāžai un komerctelpām.',
  'aizkaru-stangas-sliedes': 'Stangas un sliedes jebkuram interjeram un loga formai.',
  'aizkaru-aksesuari': 'Atsējēji, turētāji un detaļas, kas pabeidz loga noformējumu.',
  'moskitu-tikli': 'Rāmja, rullo un plisētie tīkli logiem un durvīm.',
  'gatava-produkcija': 'Gatavas žalūzijas un aizkari, ko var paņemt uzreiz.',
};

/** Links to sections of the old site that are not migrated yet. */
export const legacy = {
  portfolio: 'https://lite.lv/portfolio/',
  blog: 'https://lite.lv/blogs-lite/',
  sale: 'https://lite.lv/izpardosana/',
  fabrics: 'https://lite.lv/visi-aizkaru-audumi/',
  privacy: 'https://lite.lv/privatuma-politika/',
  en: 'https://lite.lv/eng/',
  ru: 'https://lite.lv/rus/',
};
