import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/parsed_raw_videos.json', 'utf8'));

// Test Science
const scienceChapters = [
  { num: 1, name: 'The Wonderful World of Science', key: /wonderful\s+world|ch\s*1\b|chapter\s*1\b/i },
  { num: 2, name: 'Diversity in the Living World', key: /diversity\s+in\s+the\s+living|living\s+world|plants\s+&?\s*animals\s+in\s+different|ch\s*2\b|chapter\s*2\b/i },
  { num: 3, name: 'Mindful Eating: A Path to a Healthy Body', key: /mindful\s+eating|components\s+of\s+food|ch\s*3\b|chapter\s*3\b/i },
  { num: 4, name: 'Exploring Magnets', key: /magnets|magnetism|ch\s*4\b|chapter\s*4\b/i },
  { num: 5, name: 'Measurement of Length and Motion', key: /measurement|motion|ch\s*5\b|chapter\s*5\b/i },
  { num: 6, name: 'Materials Around Us', key: /materials\s+around\s+us|ch\s*6\b|chapter\s*6\b/i },
  { num: 7, name: 'Temperature and its Measurement', key: /temperature|ch\s*7\b|chapter\s*7\b/i },
  { num: 8, name: 'A Journey through States of Water', key: /states\s+of\s+water|water|ch\s*8\b|chapter\s*8\b/i },
  { num: 9, name: 'Methods of Separation in Everyday Life', key: /separation|ch\s*9\b|chapter\s*9\b/i },
  { num: 10, name: 'Living Creatures: Exploring their Characteristics', key: /living\s+creatures|characteristics|ch\s*10\b|chapter\s*10\b/i },
  { num: 11, name: "Nature's Treasures", key: /nature'?s\s+treasures|treasures|ch\s*11\b|chapter\s*11\b/i },
  { num: 12, name: 'Beyond Earth', key: /beyond\s+earth|space|solar|ch\s*12\b|chapter\s*12\b/i },
];

console.log('\n--- SCIENCE MAPPING ---');
const sciCounts = {};
scienceChapters.forEach(c => sciCounts[c.num] = 0);
let sciUnmapped = [];
data.Science.forEach(v => {
  let mapped = false;
  for (const c of scienceChapters) {
    if (c.key.test(v.title)) {
      sciCounts[c.num]++;
      mapped = true;
      break;
    }
  }
  if (!mapped) sciUnmapped.push(v);
});
console.log('Science chapter counts:', sciCounts);
console.log('Science unmapped:', sciUnmapped.length);
if (sciUnmapped.length > 0) sciUnmapped.slice(0, 5).forEach(u => console.log('  -', u.title));

// Test Social Science
const sstChapters = [
  { num: 1, name: 'Locating Places on the Earth', key: /locating\s+places|ch\s*1\b|chapter\s*1\b/i },
  { num: 2, name: 'Oceans and Continents', key: /oceans\s+and\s+continents|ch\s*2\b|chapter\s*2\b/i },
  { num: 3, name: 'Landforms and Life', key: /landforms\s+and\s+life|ch\s*3\b|chapter\s*3\b/i },
  { num: 4, name: 'Timeline and Sources of History', key: /timeline\s+and\s+sources|sources\s+of\s+history|ch\s*4\b|chapter\s*4\b/i },
  { num: 5, name: 'India, That Is Bharat', key: /india,?\s+that\s+is\s+bharat|bharat|ch\s*5\b|chapter\s*5\b/i },
  { num: 6, name: 'The Beginnings of Indian Civilisation', key: /beginnings\s+of\s+indian\s+civilisation|civilisation|ch\s*6\b|chapter\s*6\b/i },
  { num: 7, name: "India's Cultural Roots", key: /cultural\s+roots|ch\s*7\b|chapter\s*7\b/i },
  { num: 8, name: "Unity in Diversity, or 'Many in the One'", key: /unity\s+in\s+diversity|many\s+in\s+the\s+one|ch\s*8\b|chapter\s*8\b/i },
  { num: 9, name: 'Family and Community', key: /family\s+and\s+community|ch\s*9\b|chapter\s*9\b/i },
  { num: 10, name: 'Grassroots Democracy — Part 1: Governance', key: /grassroots\s+democracy\s*[-—]?\s*part\s*1|governance|ch\s*10\b|chapter\s*10\b/i },
  { num: 11, name: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', key: /grassroots\s+democracy\s*[-—]?\s*part\s*2|rural\s+areas|panchayat|ch\s*11\b|chapter\s*11\b/i },
  { num: 12, name: 'Grassroots Democracy — Part 3: Local Government in Urban Areas', key: /grassroots\s+democracy\s*[-—]?\s*part\s*3|urban\s+areas|municipality|ch\s*12\b|chapter\s*12\b/i },
  { num: 13, name: 'The Value of Work', key: /value\s+of\s+work|ch\s*13\b|chapter\s*13\b/i },
  { num: 14, name: 'Economic Activities Around Us', key: /economic\s+activities|ch\s*14\b|chapter\s*14\b/i },
];

console.log('\n--- SOCIAL SCIENCE MAPPING ---');
const sstCounts = {};
sstChapters.forEach(c => sstCounts[c.num] = 0);
let sstUnmapped = [];
data['Social Science'].forEach(v => {
  // Discard if Class 8 or old curriculum
  if (/Class 8|Diversity and Discrimination/i.test(v.title)) {
    console.log('Discarding non-Class 6 or legacy SST video:', v.title);
    return;
  }
  let mapped = false;
  for (const c of sstChapters) {
    if (c.key.test(v.title)) {
      sstCounts[c.num]++;
      mapped = true;
      break;
    }
  }
  if (!mapped) sstUnmapped.push(v);
});
console.log('Social Science chapter counts:', sstCounts);
console.log('Social Science unmapped:', sstUnmapped.length);
if (sstUnmapped.length > 0) sstUnmapped.slice(0, 5).forEach(u => console.log('  -', u.title));
