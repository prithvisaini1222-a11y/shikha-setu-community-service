import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/parsed_raw_videos.json', 'utf8'));

// Test English (Poorvi - 5 Units)
const englishUnits = [
  { num: 1, name: 'Unit 1: Fables and Folk Tales', key: /fables\s+and\s+folk\s+tales|bottle\s+of\s+dew|raven\s+and\s+the\s+fox|rama\s+to\s+the\s+rescue|unit\s*1\b/i },
  { num: 2, name: 'Unit 2: Friendship', key: /friendship|unlikely\s+best\s+friends|friend'?s\s+prayer|the\s+chair|unit\s*2\b/i },
  { num: 3, name: 'Unit 3: Nurturing Nature', key: /nurturing\s+nature|neem\s+baba|what\s+a\s+bird\s+thought|spices\s+that\s+heal|unit\s*3\b/i },
  { num: 4, name: 'Unit 4: Sports and Wellness', key: /sports\s+and\s+wellness|change\s+of\s+heart|the\s+winner|yoga\s*[-—]?\s*a\s+way\s+of\s+life|unit\s*4\b/i },
  { num: 5, name: 'Unit 5: Culture and Tradition', key: /culture\s+and\s+tradition|hamara\s+bharat|the\s+kites|ila\s+sachani|unit\s*5\b/i },
];

console.log('\n--- ENGLISH (POORVI) MAPPING ---');
const engCounts = {};
englishUnits.forEach(u => engCounts[u.num] = 0);
let engUnmapped = [];
data.English.forEach(v => {
  let mapped = false;
  for (const u of englishUnits) {
    if (u.key.test(v.title)) {
      engCounts[u.num]++;
      mapped = true;
      break;
    }
  }
  if (!mapped) engUnmapped.push(v);
});
console.log('English unit counts:', engCounts);
console.log('English unmapped:', engUnmapped.length);
if (engUnmapped.length > 0) engUnmapped.slice(0, 5).forEach(u => console.log('  -', u.title));

// Test Hindi (Malhar - 13 Chapters)
const hindiChapters = [
  { num: 1, name: 'मातृभूमि', key: /मातृभूमि|matrubhumi|ch\s*1\b|पाठ\s*1\b/i },
  { num: 2, name: 'गोल', key: /गोल|gol|ch\s*2\b|पाठ\s*2\b/i },
  { num: 3, name: 'पहली बूँद', key: /पहली\s*बूँद|pahli\s*boond|ch\s*3\b|पाठ\s*3\b/i },
  { num: 4, name: 'हार की जीत', key: /हार\s*की\s*जीत|haar\s*ki\s*jeet|ch\s*4\b|पाठ\s*4\b/i },
  { num: 5, name: 'रहीम के दोहे', key: /रहीम\s*के\s*दोहे|rahim\s*ke\s*dohe|ch\s*5\b|पाठ\s*5\b/i },
  { num: 6, name: 'मेरी माँ', key: /मेरी\s*माँ|meri\s*maa|ch\s*6\b|पाठ\s*6\b/i },
  { num: 7, name: 'जलाते चलो', key: /जलाते\s*चलो|jalate\s*chalo|ch\s*7\b|पाठ\s*7\b/i },
  { num: 8, name: 'सत्रिया और बिहू नृत्य', key: /सत्रिया|बिहू|sattriya|bihu|ch\s*8\b|पाठ\s*8\b/i },
  { num: 9, name: 'मैया मैं नहिं माखन खायो', key: /माखन\s*खायो|makhan|ch\s*9\b|पाठ\s*9\b/i },
  { num: 10, name: 'परीक्षा', key: /परीक्षा|pariksha|ch\s*10\b|पाठ\s*10\b/i },
  { num: 11, name: 'चेतक की वीरता', key: /चेतक|chetak|ch\s*11\b|पाठ\s*11\b/i },
  { num: 12, name: 'हिंद महासागर में छोटा-सा हिंदुस्तान', key: /हिंद\s*महासागर|छोटा-सा\s*हिंदुस्तान|hind\s*mahasagar|ch\s*12\b|पाठ\s*12\b/i },
  { num: 13, name: 'पेड़ की बात', key: /पेड़\s*की\s*बात|ped\s*ki\s*baat|झाँकी\s*हिंदुस्तान\s*की|ch\s*13\b|पाठ\s*13\b/i },
];

console.log('\n--- HINDI (MALHAR) MAPPING ---');
const hinCounts = {};
hindiChapters.forEach(c => hinCounts[c.num] = 0);
let hinUnmapped = [];
data.Hindi.forEach(v => {
  let mapped = false;
  for (const c of hindiChapters) {
    if (c.key.test(v.title)) {
      hinCounts[c.num]++;
      mapped = true;
      break;
    }
  }
  if (!mapped) hinUnmapped.push(v);
});
console.log('Hindi chapter counts:', hinCounts);
console.log('Hindi unmapped:', hinUnmapped.length);
if (hinUnmapped.length > 0) hinUnmapped.slice(0, 5).forEach(u => console.log('  -', u.title));

// Test Sanskrit (Deepakam - 16 Chapters)
const sanskritChapters = [
  { num: 1, name: 'वयं वर्णमालां पठामः', key: /वर्णमालां\s*पठामः|varnmalam|ch\s*1\b|पाठ\s*1\b/i },
  { num: 2, name: 'संयुक्तव्यञ्जनानि', key: /संयुक्तव्यञ्जनानि|sanyukt/i },
  { num: 3, name: 'एषः कः ? एषा का ? एतत् किम् ?', key: /एषः\s*कः|एषा\s*का|एतत्\s*किम्|esha\s*kah|ch\s*2\b|ch\s*3\b/i },
  { num: 4, name: 'अहं च त्वं च', key: /अहं\s*च\s*त्वं\s*च|aham\s*ch\s*tvam|ch\s*3\b|ch\s*4\b/i },
  { num: 5, name: 'सङ्ख्यागणना ननु सरला', key: /सङ्ख्यागणना|संख्यागणना|sankhyaganana|ch\s*13\b|ch\s*5\b/i },
  { num: 6, name: 'अहं प्रातः उत्तिष्ठामि', key: /प्रातः\s*उत्तिष्ठामि|pratah\s*uttishthami|ch\s*4\b|ch\s*6\b/i },
  { num: 7, name: 'शूराः वयं धीराः वयम्', key: /शूराः\s*वयं|धीराः\s*वयम्|shoora|shurah|ch\s*5\b|ch\s*7\b/i },
  { num: 8, name: 'सः एव महान् चित्रकारः', key: /चित्रकारः|chitrakarah|ch\s*6\b|ch\s*8\b/i },
  { num: 9, name: 'अतिथिदेवो भव', key: /अतिथिदेवो\s*भव|atithidevo|ch\s*7\b|ch\s*9\b/i },
  { num: 10, name: 'बुद्धिः सर्वार्थसाधिका', key: /बुद्धिः\s*सर्वार्थसाधिका|buddhih|ch\s*8\b|ch\s*10\b/i },
  { num: 11, name: 'यो जानाति सः पण्डितः', key: /यो\s*जानाति|यः\s*जानाति|पण्डितः|panditah|ch\s*9\b|ch\s*11\b/i },
  { num: 12, name: 'त्वम् आपणं गच्छ', key: /आपणं\s*गच्छ|aapanam|ch\s*10\b|ch\s*12\b/i },
  { num: 13, name: 'पृथिव्यां त्रीणि रत्नानि', key: /पृथिव्यां\s*त्रीणि\s*रत्नानि|pruthivyam|ch\s*11\b|ch\s*13\b/i },
  { num: 14, name: 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः', key: /आलस्यं\s*हि|aalasyam|ch\s*12\b|ch\s*14\b/i },
  { num: 15, name: 'माधवस्य प्रियम् अङ्गम्', key: /माधवस्य\s*प्रियम्|madhavasya|ch\s*14\b|ch\s*15\b/i },
  { num: 16, name: 'वृक्षाः सत्पुरुषाः इव', key: /वृक्षाः\s*सत्पुरुषाः|vrukshah|ch\s*15\b|ch\s*16\b/i },
];

console.log('\n--- SANSKRIT (DEEPAKAM) MAPPING ---');
const sanCounts = {};
sanskritChapters.forEach(c => sanCounts[c.num] = 0);
let sanUnmapped = [];
data.Sanskrit.forEach(v => {
  let mapped = false;
  for (const c of sanskritChapters) {
    if (c.key.test(v.title)) {
      sanCounts[c.num]++;
      mapped = true;
      break;
    }
  }
  if (!mapped) sanUnmapped.push(v);
});
console.log('Sanskrit chapter counts:', sanCounts);
console.log('Sanskrit unmapped:', sanUnmapped.length);
if (sanUnmapped.length > 0) sanUnmapped.slice(0, 5).forEach(u => console.log('  -', u.title));
