import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/parsed_raw_videos.json', 'utf8'));

const mathChapters = [
  { num: 1, name: 'Patterns in Mathematics', key: /patterns\s+in\s+mathematics|ch\s*1\b|chapter\s*1\b/i },
  { num: 2, name: 'Lines and Angles', key: /lines\s+and\s+angles|ch\s*2\b|chapter\s*2\b/i },
  { num: 3, name: 'Number Play', key: /number\s+play|ch\s*3\b|chapter\s*3\b/i },
  { num: 4, name: 'Data Handling and Presentation', key: /data\s+handling|ch\s*4\b|chapter\s*4\b/i },
  { num: 5, name: 'Prime Time', key: /prime\s+time|ch\s*5\b|chapter\s*5\b/i },
  { num: 6, name: 'Perimeter and Area', key: /perimeter\s+and\s+area|ch\s*6\b|chapter\s*6\b/i },
  { num: 7, name: 'Fractions', key: /fractions|ch\s*7\b|chapter\s*7\b/i },
  { num: 8, name: 'Playing with Constructions', key: /constructions|ch\s*8\b|chapter\s*8\b/i },
  { num: 9, name: 'Symmetry', key: /symmetry|ch\s*9\b|chapter\s*9\b/i },
  { num: 10, name: 'The Other Side of Zero', key: /other\s+side\s+of\s+zero|integers|ch\s*10\b|chapter\s*10\b/i },
];

const mathVideos = data.Mathematics;
const chapterCounts = {};
mathChapters.forEach(c => chapterCounts[c.num] = 0);
let unmapped = [];

mathVideos.forEach(v => {
  let mapped = false;
  for (const c of mathChapters) {
    if (c.key.test(v.title)) {
      chapterCounts[c.num]++;
      mapped = true;
      break;
    }
  }
  if (!mapped) {
    unmapped.push(v);
  }
});

console.log('Math chapter video distribution:', chapterCounts);
console.log('Unmapped math videos count:', unmapped.length);
if (unmapped.length > 0) {
  console.log('Unmapped titles:');
  unmapped.forEach(u => console.log('-', u.title));
}
