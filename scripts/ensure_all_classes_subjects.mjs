import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CORE_SUBJECTS = [
  {
    name: 'Mathematics',
    codePrefix: 'MATH',
    bookName: 'NCERT Mathematics',
    color: '#2E7D4E',
    description: 'Number systems, algebra, geometry, mensuration, and data handling.',
    chapters: {
      6: [
        'Patterns in Mathematics',
        'Lines and Angles',
        'Number Play',
        'Data Handling and Presentation',
        'Prime Time',
        'Perimeter and Area',
        'Fractions',
        'Playing with Constructions',
        'Symmetry',
        'The Other Side of Zero'
      ],
      7: [
        'Integers & Number Systems',
        'Fractions and Decimals',
        'Data Handling & Statistics',
        'Simple Equations',
        'Lines and Angles',
        'The Triangle and its Properties',
        'Comparing Quantities',
        'Rational Numbers',
        'Perimeter and Area',
        'Algebraic Expressions'
      ],
      8: [
        'Rational Numbers',
        'Linear Equations in One Variable',
        'Understanding Quadrilaterals',
        'Data Handling & Probability',
        'Squares and Square Roots',
        'Cubes and Cube Roots',
        'Comparing Quantities',
        'Algebraic Expressions & Identities',
        'Mensuration',
        'Exponents and Powers'
      ],
      9: [
        'Number Systems',
        'Polynomials',
        'Coordinate Geometry',
        'Linear Equations in Two Variables',
        'Introduction to Euclid’s Geometry',
        'Lines and Angles',
        'Triangles',
        'Quadrilaterals',
        'Circles',
        'Heron’s Formula',
        'Surface Areas and Volumes',
        'Statistics'
      ],
      10: [
        'Real Numbers',
        'Polynomials',
        'Pair of Linear Equations in Two Variables',
        'Quadratic Equations',
        'Arithmetic Progressions',
        'Triangles',
        'Coordinate Geometry',
        'Introduction to Trigonometry',
        'Some Applications of Trigonometry',
        'Circles',
        'Areas Related to Circles',
        'Surface Areas and Volumes',
        'Statistics',
        'Probability'
      ]
    }
  },
  {
    name: 'Science',
    codePrefix: 'SCI',
    bookName: 'NCERT Science',
    color: '#3B82F6',
    description: 'Physics, chemistry, biology, environmental sciences, and experiments.',
    chapters: {
      6: [
        'The Wonderful World of Science',
        'Diversity in the Living World',
        'Mindful Eating: A Path to a Healthy Body',
        'Exploring Magnetism',
        'Measurement of Length and Motion',
        'Materials Around Us',
        'Temperature and its Measurement',
        'A Journey through States of Water',
        'Methods of Separation in Everyday Life',
        'Living Creatures: Exploring their Characteristics',
        'Nature’s Treasures',
        'Beyond Earth'
      ],
      7: [
        'Nutrition in Plants',
        'Nutrition in Animals',
        'Heat and Temperature',
        'Acids, Bases and Salts',
        'Physical and Chemical Changes',
        'Respiration in Organisms',
        'Transportation in Animals and Plants',
        'Reproduction in Plants',
        'Motion and Time',
        'Electric Current and its Effects',
        'Light and Optics',
        'Forests: Our Lifeline'
      ],
      8: [
        'Crop Production and Management',
        'Microorganisms: Friend and Foe',
        'Coal and Petroleum',
        'Combustion and Flame',
        'Conservation of Plants and Animals',
        'Reproduction in Animals',
        'Reaching the Age of Adolescence',
        'Force and Pressure',
        'Friction',
        'Sound & Waves',
        'Chemical Effects of Electric Current',
        'Some Natural Phenomena',
        'Light & Vision'
      ],
      9: [
        'Matter in Our Surroundings',
        'Is Matter Around Us Pure?',
        'Atoms and Molecules',
        'Structure of the Atom',
        'The Fundamental Unit of Life',
        'Tissues',
        'Motion',
        'Force and Laws of Motion',
        'Gravitation',
        'Work and Energy',
        'Sound',
        'Improvement in Food Resources'
      ],
      10: [
        'Chemical Reactions and Equations',
        'Acids, Bases and Salts',
        'Metals and Non-metals',
        'Carbon and its Compounds',
        'Life Processes',
        'Control and Coordination',
        'How do Organisms Reproduce?',
        'Heredity and Evolution',
        'Light – Reflection and Refraction',
        'The Human Eye and Colourful World',
        'Electricity',
        'Magnetic Effects of Electric Current',
        'Our Environment'
      ]
    }
  },
  {
    name: 'Social Science',
    codePrefix: 'SST',
    bookName: 'NCERT Social Science',
    color: '#D97706',
    description: 'History, geography, democratic politics, and social life.',
    chapters: {
      6: [
        'Locating Places on the Earth',
        'Oceans and Continents',
        'Landforms and Life',
        'Timeline and Sources of History',
        'India, That Is Bharat',
        'The Beginning of Indian Civilisation',
        'India’s Cultural Roots',
        'Unity in Diversity, or ‘Many in the One’',
        'Family and Community',
        'Grassroots Democracy — Part 1: Governance in Rural Areas',
        'Grassroots Democracy — Part 2: Governance in Urban Areas',
        'The Value of Work',
        'Economic Activities Around Us'
      ],
      7: [
        'Tracing Changes Through a Thousand Years',
        'Kings and Kingdoms',
        'Delhi: 12th to 15th Century',
        'The Mughals (16th to 17th Century)',
        'Tribes, Nomads and Settled Communities',
        'Devotional Paths to the Divine',
        'Environment & Ecosystems',
        'Inside Our Earth',
        'Our Changing Earth',
        'Air & Atmosphere',
        'Water & Hydrology',
        'On Equality & Democracy'
      ],
      8: [
        'Introduction: How, When and Where',
        'From Trade to Territory: Company Power',
        'Ruling the Countryside',
        'Tribals, Dikus and the Vision of a Golden Age',
        'When People Rebel: 1857 and After',
        'Civilising the Native, Educating the Nation',
        'Women, Caste and Reform',
        'The Making of the National Movement',
        'Resources & Development',
        'Land, Soil, Water, Natural Vegetation',
        'Agriculture & Farming',
        'Industries & Production',
        'Human Resources',
        'The Indian Constitution',
        'Understanding Secularism',
        'Parliament and the Making of Laws',
        'Judiciary & Legal Rights'
      ],
      9: [
        'The French Revolution',
        'Socialism in Europe and the Russian Revolution',
        'Nazism and the Rise of Hitler',
        'Forest Society and Colonialism',
        'India – Size and Location',
        'Physical Features of India',
        'Drainage & Rivers',
        'Climate & Seasons',
        'Natural Vegetation and Wildlife',
        'Population Dynamics',
        'What is Democracy? Why Democracy?',
        'Constitutional Design',
        'Electoral Politics',
        'Working of Institutions',
        'Democratic Rights',
        'The Story of Village Palampur',
        'People as Resource',
        'Poverty as a Challenge',
        'Food Security in India'
      ],
      10: [
        'The Rise of Nationalism in Europe',
        'Nationalism in India',
        'The Making of a Global World',
        'The Age of Industrialisation',
        'Print Culture and the Modern World',
        'Resources and Development',
        'Forest and Wildlife Resources',
        'Water Resources',
        'Agriculture',
        'Minerals and Energy Resources',
        'Manufacturing Industries',
        'Lifelines of National Economy',
        'Power Sharing',
        'Federalism',
        'Gender, Religion and Caste',
        'Political Parties',
        'Outcomes of Democracy',
        'Development & Economics',
        'Sectors of the Indian Economy',
        'Money and Credit',
        'Globalisation and the Indian Economy',
        'Consumer Rights'
      ]
    }
  },
  {
    name: 'English',
    codePrefix: 'ENG',
    bookName: 'NCERT English',
    color: '#8B5CF6',
    description: 'Literature, reading comprehension, grammar, and creative writing.',
    chapters: {
      6: [
        'A Bottle of Dew',
        'The Raven and the Fox',
        'Rama to the Rescue',
        'The Unlikely Best Friends',
        'The Friend Who Was Not Fair'
      ],
      7: [
        'Three Questions',
        'A Gift of Chappals',
        'Gopal and the Hilsa Fish',
        'The Ashes That Made Trees Bloom',
        'Quality',
        'Expert Detectives',
        'The Invention of Vita-Wonk',
        'Meadow Surprises'
      ],
      8: [
        'The Best Christmas Present in the World',
        'The Tsunami',
        'Glimpses of the Past',
        'Bepin Choudhury’s Lapse of Memory',
        'The Summit Within',
        'This is Jody’s Fawn',
        'A Visit to Cambridge',
        'A Short Monsoon Diary'
      ],
      9: [
        'The Fun They Had',
        'The Sound of Music',
        'The Little Girl',
        'A Truly Beautiful Mind',
        'The Snake and the Mirror',
        'My Childhood',
        'Reach for the Top',
        'Kathmandu',
        'If I Were You'
      ],
      10: [
        'A Letter to God',
        'Nelson Mandela: Long Walk to Freedom',
        'Two Stories about Flying',
        'From the Diary of Anne Frank',
        'Glimpses of India',
        'Mijbil the Otter',
        'Madam Rides the Bus',
        'The Sermon at Benares',
        'The Proposal'
      ]
    }
  },
  {
    name: 'Hindi',
    codePrefix: 'HIN',
    bookName: 'NCERT Hindi (मल्हार / वसंत / क्षितिज)',
    color: '#EF4444',
    description: 'गद्य, पद्य, व्याकरण, कहानी और रचनात्मक लेखन।',
    chapters: {
      6: [
        'मातृभूमि',
        'गोल',
        'सच्चा मित्र',
        'शानदार चढ़ाई',
        'चतुर चित्रकार',
        'चिड़िया',
        'पेड़',
        'बाघ',
        'बया हमारी चिड़िया रानी',
        'हार की जीत',
        'आलू की सड़क',
        'रोटी',
        'तिल का ताड़'
      ],
      7: [
        'हम पंछी उन्मुक्त गगन के',
        'दादी माँ',
        'हिमालय की बेटियाँ',
        'कठपुतली',
        'मिठाईवाला',
        'रक्त और हमारा शरीर',
        'पापा खो गए',
        'शाम-एक किसान',
        'अपूर्व अनुभव',
        'रहीम के दोहे'
      ],
      8: [
        'ध्वनि',
        'लाख की चूड़ियाँ',
        'बस की यात्रा',
        'दीवानों की हस्ती',
        'चिट्ठियों की अनूठी दुनिया',
        'भगवान के डाकिए',
        'क्या निराश हुआ जाए',
        'यह सबसे कठिन समय नहीं',
        'कबीर की साखियाँ',
        'कामचोर'
      ],
      9: [
        'दो बैलों की कथा',
        'ल्हासा की ओर',
        'उपभोक्तावाद की संस्कृति',
        'साँवले सपनों की याद',
        'नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया',
        'प्रेमचंद के फटे जूते',
        'मेरे बचपन के दिन',
        'साखियाँ एवं सबद',
        'वाख',
        'सवैये'
      ],
      10: [
        'पद (सूरदास)',
        'राम-लक्ष्मण-परशुराम संवाद',
        'उत्साह और अट नहीं रही',
        'यह दंतुरित मुस्कान और फसल',
        'संगतकार',
        'नेताजी का चश्मा',
        'बालगोबिन भगत',
        'लखनवी अंदाज़',
        'एक कहानी यह भी',
        'नौबतखाने में इबादत',
        'संस्कृति'
      ]
    }
  },
  {
    name: 'Computer',
    codePrefix: 'COMP',
    bookName: 'Digital Literacy & Computer Science',
    color: '#10B981',
    description: 'Programming, digital safety, algorithmic thinking, and computer fundamentals.',
    chapters: {
      6: [
        'Introduction to Computers & Digital World',
        'Operating Systems and Files',
        'Block Coding with Scratch',
        'Creating Stories and Animations',
        'Internet Basics and Safe Browsing',
        'Word Processing and Document Creation'
      ],
      7: [
        'Computer Hardware & Architecture',
        'Intermediate Scratch Programming & Variables',
        'Spreadsheets and Data Tables',
        'Introduction to HTML & Web Pages',
        'Cyber Safety and Digital Footprint',
        'Presentation Design and Graphics'
      ],
      8: [
        'Computer Networks & Cloud Computing',
        'Introduction to Python: Syntax & Variables',
        'Control Statements in Python',
        'HTML5 & Basic CSS Styling',
        'Database Concepts and Tables',
        'Artificial Intelligence: Everyday Concepts'
      ],
      9: [
        'Information and Communication Technology Skills',
        'Python Programming: Loops & Functions',
        'Web Development: HTML5, CSS3, & Forms',
        'Cyber Security, Ethics, and Law',
        'Data Representation: Binary and Hexadecimal',
        'Algorithms, Flowcharts, and Problem Solving'
      ],
      10: [
        'Advanced Python: Data Structures & Modules',
        'Relational Database Management with SQL',
        'Web Applications & Frontend Basics',
        'Introduction to Machine Learning & AI Ethics',
        'Digital Society, Privacy & Intellectual Property',
        'Capstone Coding Project'
      ]
    }
  }
];

async function seed() {
  console.log('Ensuring all Classes 6–10 have complete 6 core subjects with chapters...');

  const classes = await prisma.class.findMany({
    orderBy: { classNumber: 'asc' }
  });

  for (const c of classes) {
    const classNum = c.classNumber;
    console.log(`\nProcessing Class ${classNum}...`);

    for (let sIdx = 0; sIdx < CORE_SUBJECTS.length; sIdx++) {
      const subjConfig = CORE_SUBJECTS[sIdx];
      const code = `${subjConfig.codePrefix}-${classNum}`;
      const chapterTitles = subjConfig.chapters[classNum] || [];

      // Find or create subject
      let subject = await prisma.subject.findFirst({
        where: { classId: c.id, code }
      });

      if (!subject) {
        subject = await prisma.subject.findFirst({
          where: { classId: c.id, name: subjConfig.name }
        });
      }

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            classId: c.id,
            name: subjConfig.name,
            code,
            bookName: subjConfig.bookName,
            color: subjConfig.color,
            description: subjConfig.description,
            order: sIdx + 1
          }
        });
        console.log(`  Created subject: ${subject.name} (${subject.code})`);
      } else {
        console.log(`  Found subject: ${subject.name} (${subject.code})`);
      }

      // Check chapters count
      const existingChapters = await prisma.chapter.findMany({
        where: { subjectId: subject.id }
      });

      if (existingChapters.length === 0 && chapterTitles.length > 0) {
        for (let chIdx = 0; chIdx < chapterTitles.length; chIdx++) {
          const title = chapterTitles[chIdx];
          const chapter = await prisma.chapter.create({
            data: {
              subjectId: subject.id,
              chapterNumber: chIdx + 1,
              title,
              order: chIdx + 1,
              description: `Chapter ${chIdx + 1} of ${subject.name} for Class ${classNum}.`
            }
          });

          // Create an introductory lesson
          await prisma.lesson.create({
            data: {
              chapterId: chapter.id,
              lessonNumber: 1,
              title: `${title} — Key Concepts & Overview`,
              durationMinutes: 15,
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              videoSource: 'YouTube Education',
              objectivesJson: JSON.stringify([
                `Understand the foundational concepts of ${title}`,
                `Apply core principles to solve NCERT textbook exercises`,
                `Prepare for Class ${classNum} evaluations and chapter quizzes`
              ]),
              isPublished: true
            }
          });
        }
        console.log(`    Seeded ${chapterTitles.length} chapters for ${subject.name}`);
      } else {
        console.log(`    Already has ${existingChapters.length} chapters`);
      }
    }
  }

  console.log('\nAll Classes 6–10 now have complete core subjects & chapters in database!');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
