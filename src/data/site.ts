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

/** Links to sections of the old site that are not migrated yet.
 *  They assume the WordPress site stays reachable at this origin; update when it moves (e.g. old.lite.lv). */
export const legacy = {
  portfolio: 'https://lite.lv/portfolio/',
  blog: 'https://lite.lv/blogs-lite/',
  sale: 'https://lite.lv/izpardosana/',
  fabrics: 'https://lite.lv/visi-aizkaru-audumi/',
  en: 'https://lite.lv/eng/',
  ru: 'https://lite.lv/rus/',
};

/** Team as listed on the old Kontakti page. */
export const team = [
  { name: 'Inga Avotiņa', role: 'Projektu vadītāja', phone: '+371 29605689', email: 'info@lite.lv', whatsapp: true },
  { name: 'Anita Kokoreviča', role: 'Projektu vadītāja', phone: '+371 26543908', email: 'anita@lite.lv', whatsapp: true },
  { name: 'Ēriks Kiršteins', role: 'Žalūziju projektu vadītājs', phone: '+371 29511154', email: 'eriks@lite.lv' },
  { name: 'Gunta Mosāne', role: 'Aizkaru un žalūziju projektu vadītāja', phone: '+371 29226786', tel: '+371 67603205', email: 'gunta@lite.lv' },
  { name: 'Ingrīda Vilnīte', role: 'Aizkaru un žalūziju projektu vadītāja, dizainere', phone: '+371 26363204', tel: '+371 67842781' },
  { name: 'Gatis Kokorevičs', role: 'Ārējās ēnošanas sistēmu projektu vadītājs', phone: '+371 29620420', email: 'gatis@lite.lv' },
  { name: 'Vija Motmillere', role: 'Aizkaru stangu un sliežu vairumtirdzniecība', phone: '+371 29126121', tel: '+371 67624316', email: 'noliktava@lite.lv' },
  { name: 'Dace Freiberga', role: 'Grāmatvedība', tel: '+371 67619011', email: 'finanses@lite.lv' },
] as { name: string; role: string; phone?: string; tel?: string; email?: string; whatsapp?: boolean }[];

export const requisites = [
  {
    name: 'SIA LITE',
    reg: '40003326470',
    vat: 'LV40003326470',
    address: 'Krūzes iela 3, Rīga, LV-1046',
    banks: ['Swedbank AS, HABALV22, LV20HABA0001408047887', 'SEB banka AS, UNLALV2X, LV63UNLA0003027467544'],
  },
  {
    name: 'SIA LITES DEKO',
    reg: '40003576454',
    vat: 'LV40003576454',
    address: 'Tērbatas iela 93/95, Rīga, LV-1001',
    banks: ['Swedbank AS, HABALV22, LV07HABA0551001904971'],
  },
];
