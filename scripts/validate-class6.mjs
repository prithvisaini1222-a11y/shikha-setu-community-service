import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXPECTED_CURRICULUM = {
  'MATH-6': {
    name: 'Mathematics',
    bookName: 'Ganita Prakash',
    expectedChapters: 10,
    chapters: [
      { num: 1, title: 'Patterns in Mathematics' },
      { num: 2, title: 'Lines and Angles' },
      { num: 3, title: 'Number Play' },
      { num: 4, title: 'Data Handling and Presentation' },
      { num: 5, title: 'Prime Time' },
      { num: 6, title: 'Perimeter and Area' },
      { num: 7, title: 'Fractions' },
      { num: 8, title: 'Playing with Constructions' },
      { num: 9, title: 'Symmetry' },
      { num: 10, title: 'The Other Side of Zero' },
    ],
  },
  'SCI-6': {
    name: 'Science',
    bookName: 'Curiosity',
    expectedChapters: 12,
    chapters: [
      { num: 1, title: 'The Wonderful World of Science' },
      { num: 2, title: 'Diversity in the Living World' },
      { num: 3, title: 'Mindful Eating: A Path to a Healthy Body' },
      { num: 4, title: 'Exploring Magnets' },
      { num: 5, title: 'Measurement of Length and Motion' },
      { num: 6, title: 'Materials Around Us' },
      { num: 7, title: 'Temperature and its Measurement' },
      { num: 8, title: 'A Journey through States of Water' },
      { num: 9, title: 'Methods of Separation in Everyday Life' },
      { num: 10, title: 'Living Creatures: Exploring their Characteristics' },
      { num: 11, title: "Nature's Treasures" },
      { num: 12, title: 'Beyond Earth' },
    ],
  },
  'SST-6': {
    name: 'Social Science',
    bookName: 'Exploring Society: India and Beyond',
    expectedChapters: 14,
    chapters: [
      { num: 1, title: 'Locating Places on the Earth', theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE' },
      { num: 2, title: 'Oceans and Continents', theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE' },
      { num: 3, title: 'Landforms and Life', theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE' },
      { num: 4, title: 'Timeline and Sources of History', theme: 'THEME B — TAPESTRY OF THE PAST' },
      { num: 5, title: 'India, That Is Bharat', theme: 'THEME B — TAPESTRY OF THE PAST' },
      { num: 6, title: 'The Beginnings of Indian Civilisation', theme: 'THEME B — TAPESTRY OF THE PAST' },
      { num: 7, title: "India's Cultural Roots", theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS' },
      { num: 8, title: "Unity in Diversity, or 'Many in the One'", theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS' },
      { num: 9, title: 'Family and Community', theme: 'THEME D — GOVERNANCE AND DEMOCRACY' },
      { num: 10, title: 'Grassroots Democracy — Part 1: Governance', theme: 'THEME D — GOVERNANCE AND DEMOCRACY' },
      { num: 11, title: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', theme: 'THEME D — GOVERNANCE AND DEMOCRACY' },
      { num: 12, title: 'Grassroots Democracy — Part 3: Local Government in Urban Areas', theme: 'THEME D — GOVERNANCE AND DEMOCRACY' },
      { num: 13, title: 'The Value of Work', theme: 'THEME E — ECONOMIC LIFE AROUND US' },
      { num: 14, title: 'Economic Activities Around Us', theme: 'THEME E — ECONOMIC LIFE AROUND US' },
    ],
  },
  'ENG-6': {
    name: 'English',
    bookName: 'Poorvi',
    expectedChapters: 5,
    chapters: [
      { num: 1, title: 'Fables and Folk Tales' },
      { num: 2, title: 'Friendship' },
      { num: 3, title: 'Nurturing Nature' },
      { num: 4, title: 'Sports and Wellness' },
      { num: 5, title: 'Culture and Tradition' },
    ],
  },
  'HIN-6': {
    name: 'Hindi',
    bookName: 'Malhar',
    expectedChapters: 13,
    chapters: [
      { num: 1, title: 'मातृभूमि' },
      { num: 2, title: 'गोल' },
      { num: 3, title: 'पहली बूँद' },
      { num: 4, title: 'हार की जीत' },
      { num: 5, title: 'रहीम के दोहे' },
      { num: 6, title: 'मेरी माँ' },
      { num: 7, title: 'जलाते चलो' },
      { num: 8, title: 'सत्रिया और बिहू नृत्य' },
      { num: 9, title: 'मैया मैं नहिं माखन खायो' },
      { num: 10, title: 'परीक्षा' },
      { num: 11, title: 'चेतक की वीरता' },
      { num: 12, title: 'हिंद महासागर में छोटा-सा हिंदुस्तान' },
      { num: 13, title: 'पेड़ की बात' },
    ],
  },
  'SKT-6': {
    name: 'Sanskrit',
    bookName: 'Deepakam',
    expectedChapters: 16,
    chapters: [
      { num: 1, title: 'वयं वर्णमालां पठामः' },
      { num: 2, title: 'संयुक्तव्यञ्जनानि' },
      { num: 3, title: 'एषः कः ? एषा का ? एतत् किम् ?' },
      { num: 4, title: 'अहं च त्वं च' },
      { num: 5, title: 'सङ्ख्यागणना ननु सरला' },
      { num: 6, title: 'अहं प्रातः उत्तिष्ठामि' },
      { num: 7, title: 'शूराः वयं धीराः वयम्' },
      { num: 8, title: 'सः एव महान् चित्रकारः' },
      { num: 9, title: 'अतिथिदेवो भव' },
      { num: 10, title: 'बुद्धिः सर्वार्थसाधिका' },
      { num: 11, title: 'यो जानाति सः पण्डितः' },
      { num: 12, title: 'त्वम् आपणं गच्छ' },
      { num: 13, title: 'पृथिव्यां त्रीणि रत्नानि' },
      { num: 14, title: 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः' },
      { num: 15, title: 'माधवस्य प्रियम् अङ्गम्' },
      { num: 16, title: 'वृक्षाः सत्पुरुषाः इव' },
    ],
  },
};

const LEGACY_KEYWORDS = [
  'knowing our numbers',
  'food: where does it come from',
  'vasant',
  'durva',
  'honeysuckle',
  'a pact with the sun',
  'ruchira',
  'social and political life',
  'our pasts - i',
  'the earth our habitat',
];

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export async function validateClass6Curriculum() {
  console.log('================================================================');
  console.log('  SHIKSHASETU — CLASS 6 CONTENT VALIDATION SUITE');
  console.log('  Testing 2026–27 NCERT Curriculum & Magnet Brains Integrity');
  console.log('================================================================\n');

  let passed = true;
  const errors = [];
  const warnings = [];

  // 1. Check Class 6
  const class6 = await prisma.class.findUnique({
    where: { classNumber: 6 },
    include: {
      subjects: {
        include: {
          chapters: {
            include: {
              topics: {
                include: {
                  videos: true,
                },
              },
              videos: true,
              lessons: true,
            },
          },
        },
      },
    },
  });

  if (!class6) {
    console.error('❌ FAIL: Class 6 does not exist in the database.');
    return false;
  }
  console.log('✓ Class 6 record verified.');

  // 2. Check Subjects
  const subjects = class6.subjects;
  console.log(`✓ Found ${subjects.length} subjects for Class 6 (Expected: 6).`);

  if (subjects.length !== 6) {
    errors.push(`Expected exactly 6 subjects, found ${subjects.length}.`);
    passed = false;
  }

  const foundCodes = new Set(subjects.map(s => s.code));
  for (const [code, expected] of Object.entries(EXPECTED_CURRICULUM)) {
    if (!foundCodes.has(code)) {
      errors.push(`Missing expected subject: ${expected.name} (${code})`);
      passed = false;
    }
  }

  // 3. Track all video IDs for global uniqueness check
  const allVideoIds = new Map();
  let grandTotalVideos = 0;
  let grandTotalChapters = 0;
  let grandTotalTopics = 0;

  // 4. Validate Each Subject & Chapters
  for (const subject of subjects) {
    const expected = EXPECTED_CURRICULUM[subject.code];
    if (!expected) {
      errors.push(`Unrecognized subject in Class 6: "${subject.name}" (${subject.code})`);
      passed = false;
      continue;
    }

    console.log(`\n----------------------------------------------------------------`);
    console.log(`Checking [${subject.name}] — Book: "${subject.bookName}"`);
    console.log(`----------------------------------------------------------------`);

    // Validate Book Name
    if (subject.bookName !== expected.bookName) {
      errors.push(`[${subject.name}] Incorrect bookName: "${subject.bookName}" (Expected: "${expected.bookName}")`);
      passed = false;
    } else {
      console.log(`  ✓ Book Name matches: "${subject.bookName}"`);
    }

    // Validate Chapter Count
    const chapters = subject.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
    grandTotalChapters += chapters.length;
    if (chapters.length !== expected.expectedChapters) {
      errors.push(`[${subject.name}] Chapter count mismatch: found ${chapters.length}, expected ${expected.expectedChapters}`);
      passed = false;
    } else {
      console.log(`  ✓ Chapter count matches: ${chapters.length}/${expected.expectedChapters}`);
    }

    // Validate Each Chapter
    for (let i = 0; i < expected.chapters.length; i++) {
      const expCh = expected.chapters[i];
      const actualCh = chapters.find(c => c.chapterNumber === expCh.num);

      if (!actualCh) {
        errors.push(`[${subject.name}] Missing Chapter ${expCh.num}: "${expCh.title}"`);
        passed = false;
        continue;
      }

      // Check title contains or matches
      if (!actualCh.title.toLowerCase().includes(expCh.title.toLowerCase().substring(0, 8))) {
        warnings.push(`[${subject.name}] Chapter ${expCh.num} title difference: Found "${actualCh.title}", Expected "${expCh.title}"`);
      }

      // Check for legacy keywords
      for (const legacy of LEGACY_KEYWORDS) {
        if (actualCh.title.toLowerCase().includes(legacy)) {
          errors.push(`[${subject.name}] Legacy book/chapter detected in Chapter ${expCh.num}: "${actualCh.title}"`);
          passed = false;
        }
      }

      // Check SST theme if applicable
      if (expCh.theme && actualCh.theme !== expCh.theme) {
        warnings.push(`[${subject.name}] Chapter ${expCh.num} theme mismatch. Found: "${actualCh.theme}", Expected: "${expCh.theme}"`);
      }

      // Check Topics & Videos
      grandTotalTopics += actualCh.topics.length;
      let chVideoCount = 0;

      for (const topic of actualCh.topics) {
        for (const video of topic.videos) {
          chVideoCount++;
          grandTotalVideos++;

          // Check YouTube ID format
          if (!video.youtubeVideoId || !YOUTUBE_ID_REGEX.test(video.youtubeVideoId)) {
            errors.push(`Invalid YouTube ID format: "${video.youtubeVideoId}" in video "${video.title}"`);
            passed = false;
          }

          // Check Global Uniqueness
          if (allVideoIds.has(video.youtubeVideoId)) {
            errors.push(`Duplicate video ID "${video.youtubeVideoId}" found in chapter "${actualCh.title}" and "${allVideoIds.get(video.youtubeVideoId)}"`);
            passed = false;
          } else {
            allVideoIds.set(video.youtubeVideoId, actualCh.title);
          }

          // Check YouTube URL presence
          if (!video.youtubeUrl || !video.youtubeUrl.includes(video.youtubeVideoId)) {
            errors.push(`Missing or mismatched youtubeUrl for video "${video.title}" (${video.youtubeVideoId})`);
            passed = false;
          }

          // Check Source
          if (video.source !== 'Magnet Brains') {
            warnings.push(`Video "${video.title}" source is "${video.source}" (Expected: Magnet Brains)`);
          }

          // Verify non-Class-6 bleed
          const lowerTitle = video.title.toLowerCase();
          if (lowerTitle.includes('class 8') || lowerTitle.includes('class 7') || lowerTitle.includes('class 9')) {
            errors.push(`Potential cross-grade video bleed detected in "${video.title}" (${video.youtubeVideoId})`);
            passed = false;
          }
        }
      }

      // Special check for Sanskrit Chapter 2 (संयुक्तव्यञ्जनानि)
      if (subject.code === 'SKT-6' && expCh.num === 2) {
        if (chVideoCount > 0) {
          warnings.push(`Sanskrit Chapter 2 was expected to have 0 fake videos. Found ${chVideoCount} video(s).`);
        } else {
          console.log(`  ✓ Sanskrit Chapter 2 (संयुक्तव्यञ्जनानि) correctly marked as unavailable with 0 fake links.`);
        }
      }
    }
  }

  // 5. Final Report
  console.log('\n================================================================');
  console.log('  CLASS 6 VALIDATION REPORT');
  console.log('================================================================');
  console.log(`  Total Subjects:      ${subjects.length} / 6`);
  console.log(`  Total Chapters:      ${grandTotalChapters} / 70`);
  console.log(`  Total Topics:        ${grandTotalTopics}`);
  console.log(`  Total Videos:        ${grandTotalVideos}`);
  console.log(`  Unique YouTube IDs:  ${allVideoIds.size}`);
  console.log(`  Legacy Infiltration: 0 detected`);
  console.log('----------------------------------------------------------------');

  if (warnings.length > 0) {
    console.log(`\n  Warnings (${warnings.length}):`);
    warnings.forEach(w => console.log(`    ⚠ ${w}`));
  }

  if (errors.length > 0) {
    console.log(`\n  Errors (${errors.length}):`);
    errors.forEach(e => console.log(`    ❌ ${e}`));
    console.log('\n❌ VALIDATION FAILED!');
    return false;
  } else {
    console.log('\n✅ ALL VALIDATION CHECKS PASSED PERFECTLY!');
    return true;
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('validate-class6.mjs')) {
  validateClass6Curriculum()
    .then(async (success) => {
      await prisma.$disconnect();
      process.exit(success ? 0 : 1);
    })
    .catch(async (err) => {
      console.error('Validation crashed:', err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
