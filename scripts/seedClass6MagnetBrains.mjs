import { PrismaClient } from '@prisma/client';

const defaultPrisma = new PrismaClient();

export async function seedClass6MagnetBrains(client) {
  const prisma = client || defaultPrisma;
  console.log('--- Starting Class 6 Magnet Brains Curriculum Seeding ---');

  // 1. Ensure Class 6 exists
  let class6 = await prisma.class.findUnique({
    where: { classNumber: 6 },
  });

  if (!class6) {
    class6 = await prisma.class.create({
      data: {
        classNumber: 6,
        title: 'Class 6 - Middle School Foundation',
        description: 'Comprehensive NCERT & CBSE aligned middle school curriculum for 6th grade.',
      },
    });
    console.log('Created Class 6 record.');
  } else {
    console.log('Class 6 record found.');
  }

  // 2. Define Subjects & Full Magnet Brains Chapter / Video Tree
  const subjectsData = [
    {
      name: 'Mathematics',
      code: 'MATH-6',
      icon: 'calculator',
      color: '#2E7D4E',
      description: 'NCERT Class 6 Mathematics: Numbers, geometry, integers, fractions, and data handling.',
      chapters: [
        {
          chapterNumber: 1,
          title: 'Knowing Our Numbers',
          description: 'Comparing numbers, large numbers in practice, estimation, brackets, and Roman numerals.',
          topics: [
            { name: 'Comparing & Forming Numbers', order: 1, desc: 'Place value, face value, ascending and descending order.' },
            { name: 'Large Numbers & Roman Numerals', order: 2, desc: 'Indian and International number systems, conversion and Roman symbols.' },
          ],
          videos: [
            {
              youtubeVideoId: 'OERnQuoZaEY',
              title: 'Class 6 Maths Chapter 1 | Knowing Our Numbers - Introduction & Concepts',
              duration: '35m 14s',
              durationSeconds: 2114,
              description: 'Complete conceptual introduction to Knowing Our Numbers by Magnet Brains.',
              isRecommended: true,
              viewCount: 780000,
            },
            {
              youtubeVideoId: '9RIgSyGMGyY',
              title: 'Class 6 Maths Chapter 1 | Knowing Our Numbers - NCERT Exercise 1.1 Solutions',
              duration: '26m 40s',
              durationSeconds: 1600,
              description: 'Detailed step-by-step solutions for NCERT Exercise 1.1 problems.',
              isRecommended: false,
              viewCount: 420000,
            },
            {
              youtubeVideoId: 'LRLDpErCJeQ',
              title: 'Class 6 Maths Chapter 1 | Knowing Our Numbers - NCERT Exercise 1.2 Solutions',
              duration: '31m 15s',
              durationSeconds: 1875,
              description: 'Word problems involving large numbers and metric unit conversions.',
              isRecommended: false,
              viewCount: 390000,
            },
          ],
          lesson: {
            title: 'Foundations of Number Systems and Place Values',
            durationMinutes: 25,
            videoUrl: 'https://www.youtube-nocookie.com/embed/OERnQuoZaEY',
            objectives: [
              'Understand the Indian and International systems of numeration',
              'Compare numbers up to 8 digits using place value charts',
              'Apply rounding off to nearest tens, hundreds, and thousands',
            ],
          },
          note: {
            title: 'Revision Notes: Knowing Our Numbers',
            summary: 'Place value rules, 10-lakh vs 1-million conversions, and bracket rules.',
            keyFormulas: '1 lakh = 100,000\n1 million = 1,000,000\n1 crore = 10,000,000 = 10 million\nRoman: I=1, V=5, X=10, L=50, C=100, D=500, M=1000',
            contentMarkdown: `# Chapter 1: Knowing Our Numbers\n\n## Indian Number System\n- Ones, Tens, Hundreds, Thousands, Ten Thousands, Lakhs, Ten Lakhs, Crores.\n- Commas: After hundreds (3 digits), then every 2 digits (e.g., 5,42,18,900).\n\n## International Number System\n- Ones, Tens, Hundreds, Thousands, Ten Thousands, Hundred Thousands, Millions, Ten Millions.\n- Commas: Placed every 3 digits from right (e.g., 54,218,900).`,
          },
        },
        {
          chapterNumber: 2,
          title: 'Whole Numbers',
          description: 'Natural numbers, whole numbers, predecessor & successor, number line representation, and properties of addition & multiplication.',
          topics: [
            { name: 'Introduction to Whole Numbers & Number Line', order: 1, desc: 'Zero inclusion, operations on the number line.' },
            { name: 'Properties of Whole Numbers', order: 2, desc: 'Closure, commutativity, associativity, and distributivity.' },
          ],
          videos: [
            {
              youtubeVideoId: 'kQcE8QGDALA',
              title: 'Class 6 Maths Chapter 2 | Whole Numbers - Full Chapter Explanation & NCERT Solutions',
              duration: '42m 10s',
              durationSeconds: 2530,
              description: 'Magnet Brains complete one-shot lecture covering all concepts and properties of whole numbers.',
              isRecommended: true,
              viewCount: 650000,
            },
            {
              youtubeVideoId: 'Xh07T1Y6DVI',
              title: 'Class 6 Maths Chapter 2 | Whole Numbers - Introduction & Number Line Operations',
              duration: '22m 30s',
              durationSeconds: 1350,
              description: 'Visual addition and subtraction on the number line.',
              isRecommended: false,
              viewCount: 310000,
            },
            {
              youtubeVideoId: 'D_9X3tS0H-w',
              title: 'Class 6 Maths Chapter 2 | Whole Numbers - NCERT Exercise 2.1 Solutions',
              duration: '28m 45s',
              durationSeconds: 1725,
              description: 'Step-by-step exercise 2.1 question walkthrough.',
              isRecommended: false,
              viewCount: 290000,
            },
          ],
          lesson: {
            title: 'Understanding Whole Numbers and Number Line Operations',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/kQcE8QGDALA',
            objectives: [
              'Distinguish between natural numbers (N) and whole numbers (W)',
              'Plot and perform addition and subtraction on a number line',
              'Apply distributive property: a * (b + c) = a*b + a*c',
            ],
          },
          note: {
            title: 'Revision Notes: Whole Numbers',
            summary: 'Number line rules, zero properties, and distributivity.',
            keyFormulas: 'Natural Numbers = {1, 2, 3...}\nWhole Numbers = {0, 1, 2, 3...}\nAdditive Identity: a + 0 = a\nMultiplicative Identity: a * 1 = a\nDistributive: a*(b + c) = a*b + a*c',
            contentMarkdown: `# Chapter 2: Whole Numbers\n\n- Zero is the smallest whole number.\n- Predecessor of a number = Number - 1.\n- Successor of a number = Number + 1.\n- Division by zero is NOT defined.`,
          },
        },
        {
          chapterNumber: 3,
          title: 'Playing with Numbers',
          description: 'Factors and multiples, prime and composite numbers, divisibility tests, prime factorisation, HCF and LCM.',
          topics: [
            { name: 'Factors, Multiples & Prime Numbers', order: 1, desc: 'Sieve of Eratosthenes, co-prime numbers.' },
            { name: 'Divisibility Rules, HCF & LCM', order: 2, desc: 'Divisibility by 2, 3, 4, 5, 6, 8, 9, 10, 11; highest common factor and least common multiple.' },
          ],
          videos: [
            {
              youtubeVideoId: 'Q2-s-MgQMdc',
              title: 'Class 6 Maths Chapter 3 | Playing with Numbers - Full Chapter Explanation & NCERT Solutions',
              duration: '48m 20s',
              durationSeconds: 2900,
              description: 'Master factors, multiples, divisibility tests, and LCM/HCF with Magnet Brains.',
              isRecommended: true,
              viewCount: 890000,
            },
            {
              youtubeVideoId: 'HnN5_G7a5fE',
              title: 'Class 6 Maths Chapter 3 | Playing With Numbers - One Shot Revision',
              duration: '34m 10s',
              durationSeconds: 2050,
              description: 'Comprehensive exam revision of prime factorisation and word problems.',
              isRecommended: false,
              viewCount: 410000,
            },
            {
              youtubeVideoId: '5V46_zW_eZ0',
              title: 'Class 6 Maths Chapter 3 | Highest Common Factor (HCF) & LCM Methods',
              duration: '24m 50s',
              durationSeconds: 1490,
              description: 'Prime factorisation and common division method for HCF and LCM.',
              isRecommended: false,
              viewCount: 350000,
            },
          ],
          lesson: {
            title: 'Factors, Multiples, and Prime Factorisation',
            durationMinutes: 24,
            videoUrl: 'https://www.youtube-nocookie.com/embed/Q2-s-MgQMdc',
            objectives: [
              'Find all factors and multiples of given two-digit numbers',
              'Check divisibility using rules without actual long division',
              'Compute HCF and LCM to solve real-world timing and grouping problems',
            ],
          },
          note: {
            title: 'Revision Notes: Playing with Numbers',
            summary: 'Divisibility rules, prime vs composite, and HCF/LCM relations.',
            keyFormulas: '1 is neither prime nor composite.\n2 is the only even prime number.\nHCF * LCM = Product of two numbers.',
            contentMarkdown: `# Chapter 3: Playing with Numbers\n\n## Divisibility Rules\n- By 2: Last digit is 0, 2, 4, 6, 8.\n- By 3: Sum of digits is divisible by 3.\n- By 5: Last digit is 0 or 5.\n- By 9: Sum of digits is divisible by 9.\n- By 11: Difference between sum of odd digits and even digits is 0 or multiple of 11.`,
          },
        },
        {
          chapterNumber: 4,
          title: 'Basic Geometrical Ideas',
          description: 'Points, line segments, rays, curves, polygons, angles, triangles, quadrilaterals, and circles.',
          topics: [
            { name: 'Lines, Segments & Rays', order: 1, desc: 'Basic geometric entities, intersecting and parallel lines.' },
            { name: 'Curves, Polygons & Circles', order: 2, desc: 'Closed vs open curves, interior/exterior, chords, diameter, and radius.' },
          ],
          videos: [
            {
              youtubeVideoId: 'Wc4UeU4L9iY',
              title: 'Class 6 Maths Chapter 4 | Basic Geometrical Ideas - Full Chapter Explanation',
              duration: '38m 15s',
              durationSeconds: 2295,
              description: 'Magnet Brains complete tutorial on geometric basics, angles, polygons, and circles.',
              isRecommended: true,
              viewCount: 520000,
            },
          ],
          lesson: {
            title: 'Introduction to Geometry: Points, Lines, Angles and Polygons',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube-nocookie.com/embed/Wc4UeU4L9iY',
            objectives: [
              'Differentiate between line, line segment, and ray',
              'Identify vertices, sides, and angles in polygons',
              'Understand parts of a circle: radius, diameter, chord, sector, segment',
            ],
          },
          note: {
            title: 'Revision Notes: Basic Geometrical Ideas',
            summary: 'Point, ray, line, angle, and circle terminology.',
            keyFormulas: 'Diameter = 2 * Radius\nCircumference = 2 * pi * r\nRay has 1 endpoint; Line segment has 2 endpoints; Line extends infinitely.',
            contentMarkdown: `# Chapter 4: Basic Geometrical Ideas\n\n- Line segment: Shortest distance between two points.\n- Ray: A portion of line starting at one point and going endlessly in one direction.\n- Circle: All points equidistant from center. Diameter is the longest chord.`,
          },
        },
        {
          chapterNumber: 5,
          title: 'Fractions & Decimals',
          description: 'Fraction as part of a whole, proper, improper, mixed fractions, equivalent fractions, and decimal representation.',
          topics: [
            { name: 'Types of Fractions & Representation', order: 1, desc: 'Proper, improper, mixed, and equivalent fractions.' },
            { name: 'Decimals & Operations', order: 2, desc: 'Tenths, hundredths, place value, and addition/subtraction of decimals.' },
          ],
          videos: [
            {
              youtubeVideoId: 'vP8Z4Q7f2lY',
              title: 'Class 6 Maths Chapter 5 | Fractions & Decimals - Full Chapter Explanation',
              duration: '44m 30s',
              durationSeconds: 2670,
              description: 'Learn fractions on number line, simplification, and decimals by Magnet Brains.',
              isRecommended: true,
              viewCount: 610000,
            },
          ],
          lesson: {
            title: 'Fractions and Decimal Operations',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube-nocookie.com/embed/vP8Z4Q7f2lY',
            objectives: [
              'Convert between improper and mixed fractions',
              'Find equivalent fractions by multiplying or dividing numerator and denominator',
              'Add and subtract fractions with like and unlike denominators',
            ],
          },
          note: {
            title: 'Revision Notes: Fractions and Decimals',
            summary: 'Converting fractions, cross multiplication, and decimal conversions.',
            keyFormulas: 'Proper: Numerator < Denominator\nImproper: Numerator >= Denominator\nEquivalent: a/b = (a*k)/(b*k)',
            contentMarkdown: `# Chapter 5: Fractions & Decimals\n\n- To compare unlike fractions, find the LCM of denominators.\n- Tenths = 1/10 = 0.1\n- Hundredths = 1/100 = 0.01.`,
          },
        },
      ],
    },
    {
      name: 'Science',
      code: 'SCI-6',
      icon: 'microscope',
      color: '#4B749F',
      description: 'NCERT Class 6 Science: Food nutrients, materials, plants, human body, light, and electrical circuits.',
      chapters: [
        {
          chapterNumber: 1,
          title: 'Components of Food',
          description: 'Nutrients: carbohydrates, fats, proteins, vitamins, minerals, dietary fibres, balanced diet, and deficiency diseases.',
          topics: [
            { name: 'Major Nutrients & Food Tests', order: 1, desc: 'Testing for starch, protein, and fat in common food items.' },
            { name: 'Balanced Diet & Deficiency Diseases', order: 2, desc: 'Scurvy, rickets, beriberi, anaemia, and goitre prevention.' },
          ],
          videos: [
            {
              youtubeVideoId: '5tdqsng76Fo',
              title: 'Class 6 Science Chapter 1 | Components of Food - Full Chapter Explanation',
              duration: '39m 50s',
              durationSeconds: 2390,
              description: 'Complete video lesson on food components, nutrients, and deficiency diseases by Magnet Brains.',
              isRecommended: true,
              viewCount: 920000,
            },
            {
              youtubeVideoId: '7Oj_sjYxo6M',
              title: 'Class 6 Science Chapter 1 | Components of Food - NCERT Exemplar & Questions',
              duration: '27m 15s',
              durationSeconds: 1635,
              description: 'Important textbook and exemplar questions solved step-by-step.',
              isRecommended: false,
              viewCount: 380000,
            },
          ],
          lesson: {
            title: 'Essential Nutrients and Dietary Balance',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/5tdqsng76Fo',
            objectives: [
              'Identify the five primary nutrient groups and their biological functions',
              'Describe the iodine test for starch and copper sulphate test for proteins',
              'Link vitamins and minerals to deficiency diseases (Vitamin A, B1, C, D, Iron, Iodine)',
            ],
          },
          note: {
            title: 'Revision Notes: Components of Food',
            summary: 'Nutrient tests, balanced diet composition, and deficiency tables.',
            keyFormulas: 'Starch + Iodine -> Blue-Black color\nProtein + CuSO4 + NaOH -> Violet color\nVitamin A: Loss of vision\nVitamin C: Scurvy (bleeding gums)\nVitamin D: Rickets\nIron: Anaemia\nIodine: Goitre',
            contentMarkdown: `# Chapter 1: Components of Food\n\n- Carbohydrates & Fats: Energy-giving foods.\n- Proteins: Body-building foods.\n- Vitamins & Minerals: Protective foods.\n- Dietary fibres (roughage) help in digestion and bowel movement.`,
          },
        },
        {
          chapterNumber: 2,
          title: 'Sorting Materials into Groups',
          description: 'Properties of materials: appearance, hardness, solubility, density in water, and transparency.',
          topics: [
            { name: 'Classification of Materials', order: 1, desc: 'Why we group materials: convenience, properties, and study.' },
            { name: 'Physical Properties & Transparency', order: 2, desc: 'Opaque, transparent, translucent, and soluble substances.' },
          ],
          videos: [
            {
              youtubeVideoId: 'yMBa5GAYEPc',
              title: 'Class 6 Science Chapter 2 | Sorting Materials into Groups - Full Chapter Explanation',
              duration: '36m 20s',
              durationSeconds: 2180,
              description: 'Magnet Brains complete lesson explaining material classification, lustre, hardness, and transparency.',
              isRecommended: true,
              viewCount: 640000,
            },
            {
              youtubeVideoId: 'xlbt6uyiSFc',
              title: 'Class 6 Science Chapter 2 | Properties of Materials (Lustre, Hardness, Solubility)',
              duration: '24m 10s',
              durationSeconds: 1450,
              description: 'Detailed practical demonstrations of solubility and light transmission.',
              isRecommended: false,
              viewCount: 290000,
            },
          ],
          lesson: {
            title: 'Material Classification and Physical Properties',
            durationMinutes: 18,
            videoUrl: 'https://www.youtube-nocookie.com/embed/yMBa5GAYEPc',
            objectives: [
              'Classify everyday objects based on lustre, hardness, and texture',
              'Distinguish between transparent, translucent, and opaque objects',
              'Understand why oil floats on water and salt dissolves in water',
            ],
          },
          note: {
            title: 'Revision Notes: Sorting Materials into Groups',
            summary: 'Lustre, hardness, solubility in water, and transparency categories.',
            keyFormulas: 'Transparent: Light passes through completely (Glass, Clear Water)\nTranslucent: Light passes partially (Oiled paper, Frosted glass)\nOpaque: Light cannot pass through (Wood, Metals, Cardboard)',
            contentMarkdown: `# Chapter 2: Sorting Materials into Groups\n\n- Grouping objects makes it easier to observe patterns in their properties.\n- Lustrous materials are generally metals (iron, copper, aluminium, gold).\n- Substances that dissolve in water are soluble (salt, sugar); those that do not are insoluble (chalk powder, sand).`,
          },
        },
        {
          chapterNumber: 3,
          title: 'Getting to Know Plants',
          description: 'Herbs, shrubs, trees, creepers, climbers; parts of a plant: stem, leaf (venation, photosynthesis, transpiration), root, and flower structure.',
          topics: [
            { name: 'Plant Classification: Herbs, Shrubs & Trees', order: 1, desc: 'Height, stem nature, and branch origin.' },
            { name: 'Leaf Anatomy, Roots & Flowers', order: 2, desc: 'Reticulate vs parallel venation, taproot vs fibrous root, and floral whorls.' },
          ],
          videos: [
            {
              youtubeVideoId: 'E14e6DiSfIQ',
              title: 'Class 6 Science Chapter 3 | Getting to Know Plants - Full Chapter Explanation',
              duration: '46m 10s',
              durationSeconds: 2770,
              description: 'Magnet Brains complete botany guide: herbs, shrubs, trees, leaf venation, and flower anatomy.',
              isRecommended: true,
              viewCount: 820000,
            },
            {
              youtubeVideoId: 'r5yMRp9s9cQ',
              title: 'Class 6 Science Chapter 3 | Herbs, Shrubs, Trees & Plant Anatomy',
              duration: '28m 30s',
              durationSeconds: 1710,
              description: 'Detailed analysis of leaf functions and transpiration experiments.',
              isRecommended: false,
              viewCount: 340000,
            },
          ],
          lesson: {
            title: 'Anatomy and Functions of Plant Parts',
            durationMinutes: 24,
            videoUrl: 'https://www.youtube-nocookie.com/embed/E14e6DiSfIQ',
            objectives: [
              'Differentiate between herbs, shrubs, trees, creepers, and climbers',
              'Relate leaf venation (reticulate/parallel) with root types (taproot/fibrous)',
              'Identify the parts of a flower: sepals, petals, stamens (male), and pistil (female)',
            ],
          },
          note: {
            title: 'Revision Notes: Getting to Know Plants',
            summary: 'Herbs, shrubs, trees, leaf venation relation to roots, and flower anatomy.',
            keyFormulas: 'Reticulate Venation <-> Taproot (e.g., Mustard, Rose, Gram)\nParallel Venation <-> Fibrous Root (e.g., Grass, Wheat, Maize)\nFlower: Petals + Sepals + Stamens (Anther+Filament) + Pistil (Stigma+Style+Ovary)',
            contentMarkdown: `# Chapter 3: Getting to Know Plants\n\n- Transpiration: Loss of water vapor from leaves.\n- Photosynthesis: Leaves prepare food using water, CO2, sunlight, and chlorophyll.\n- Ovary develops into fruit; ovules develop into seeds.`,
          },
        },
        {
          chapterNumber: 4,
          title: 'Body Movements',
          description: 'Human skeleton, movable joints (ball & socket, hinge, pivotal, fixed), bones, cartilage, muscles, and locomotion in animals.',
          topics: [
            { name: 'Human Skeleton & Joint Types', order: 1, desc: 'Ball-and-socket, hinge, pivotal, and fixed joints in skull.' },
            { name: 'Locomotion in Animals', order: 2, desc: 'Movement of earthworm, snail, cockroach, bird, fish, and snake.' },
          ],
          videos: [
            {
              youtubeVideoId: '1F_4-tD4S-o',
              title: 'Class 6 Science Chapter 4 | Body Movements - Full Chapter Explanation',
              duration: '41m 20s',
              durationSeconds: 2480,
              description: 'Magnet Brains complete lecture on skeletal system, joints, and animal locomotion.',
              isRecommended: true,
              viewCount: 710000,
            },
            {
              youtubeVideoId: 'bO8uW-9-s1s',
              title: 'Class 6 Science Chapter 4 | Bones and Its Functions & Skeletal System',
              duration: '23m 45s',
              durationSeconds: 1425,
              description: 'Understanding cartilage, rib cage, vertebrae, and muscle contraction.',
              isRecommended: false,
              viewCount: 280000,
            },
          ],
          lesson: {
            title: 'The Human Skeletal System and Movement Mechanisms',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube-nocookie.com/embed/1F_4-tD4S-o',
            objectives: [
              'Locate and identify major types of joints in the human body',
              'Understand how muscles work in pairs (contraction and relaxation)',
              'Explain streamline body adaptations in fish and birds for movement',
            ],
          },
          note: {
            title: 'Revision Notes: Body Movements',
            summary: 'Joint types, skeletal functions, and animal locomotion table.',
            keyFormulas: 'Ball & Socket: Shoulder and Hip\nHinge Joint: Elbow and Knee\nPivotal Joint: Neck joining the head\nFixed Joint: Upper jaw and cranium',
            contentMarkdown: `# Chapter 4: Body Movements\n\n- The human skeleton consists of 206 bones in adults.\n- Cartilage is softer than bone and found in earlobes and nose tip.\n- Muscles work only by contraction; they pull bones, never push.`,
          },
        },
        {
          chapterNumber: 5,
          title: 'Light, Shadows and Reflections',
          description: 'Luminous vs non-luminous objects, formation of shadows, pinhole camera construction, and mirrors with reflections.',
          topics: [
            { name: 'Shadow Formation & Pinhole Camera', order: 1, desc: 'Rectilinear propagation of light, opaque obstructions.' },
            { name: 'Mirrors & Reflection', order: 2, desc: 'Reflection from smooth polished surfaces and virtual image concepts.' },
          ],
          videos: [
            {
              youtubeVideoId: 'A2WpZ0n31sM',
              title: 'Class 6 Science Chapter 5 | Light, Shadows and Reflections - Full Chapter Explanation',
              duration: '37m 40s',
              durationSeconds: 2260,
              description: 'Magnet Brains complete lesson on light travelling in straight lines, shadow formation, and mirrors.',
              isRecommended: true,
              viewCount: 790000,
            },
            {
              youtubeVideoId: 'kY6f13L4gQc',
              title: 'Class 6 Science Chapter 5 | Introduction to Light & Characteristics of Shadows',
              duration: '21m 15s',
              durationSeconds: 1275,
              description: 'Experiments demonstrating light rectilinear propagation and shadow creation.',
              isRecommended: false,
              viewCount: 310000,
            },
          ],
          lesson: {
            title: 'Nature of Light, Shadows, and Mirror Reflections',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/A2WpZ0n31sM',
            objectives: [
              'State the three essential requirements for shadow formation',
              'Construct and explain image formation in a pinhole camera (inverted image)',
              'Explain how plane mirrors reflect light beams to produce images',
            ],
          },
          note: {
            title: 'Revision Notes: Light, Shadows and Reflections',
            summary: 'Rectilinear propagation, requirements for shadow, and pinhole camera characteristics.',
            keyFormulas: 'Shadow requires: (1) Source of light, (2) Opaque object, (3) Screen.\nLight travels in straight lines (Rectilinear propagation).\nPinhole camera produces upside-down (inverted) images.',
            contentMarkdown: `# Chapter 5: Light, Shadows and Reflections\n\n- Luminous objects: Emit their own light (Sun, light bulb, firefly).\n- Non-luminous: Reflect light falling on them (Moon, book, chair).\n- Shadows are always black, regardless of the color of the object.`,
          },
        },
        {
          chapterNumber: 6,
          title: 'Electricity and Circuits',
          description: 'Electric cell, electric bulb with filament, complete electric circuit, switches, and conductors vs insulators.',
          topics: [
            { name: 'Electric Cell, Bulb & Circuit', order: 1, desc: 'Positive and negative terminals, filament, complete closed loop.' },
            { name: 'Switches, Conductors & Insulators', order: 2, desc: 'Making a simple switch, testing conductivity of everyday materials.' },
          ],
          videos: [
            {
              youtubeVideoId: 'YpL4-dZ-l_s',
              title: 'Class 6 Science Chapter 6 | Electricity and Circuits - Full Chapter Explanation',
              duration: '43m 15s',
              durationSeconds: 2595,
              description: 'Magnet Brains complete tutorial on electric cells, open vs closed circuits, and conductivity.',
              isRecommended: true,
              viewCount: 860000,
            },
            {
              youtubeVideoId: 'W05zX9y2s1Q',
              title: 'Class 6 Science Chapter 6 | Conductors and Insulators in Circuits',
              duration: '22m 30s',
              durationSeconds: 1350,
              description: 'Demonstrations of safety rules and materials that conduct electric current.',
              isRecommended: false,
              viewCount: 320000,
            },
          ],
          lesson: {
            title: 'Electric Circuits, Cells, and Material Conductivity',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube-nocookie.com/embed/YpL4-dZ-l_s',
            objectives: [
              'Identify the positive and negative terminals of an electric cell',
              'Trace current flow from positive to negative terminal in a closed circuit',
              'Classify materials as conductors (copper, iron) or insulators (rubber, plastic, wood)',
            ],
          },
          note: {
            title: 'Revision Notes: Electricity and Circuits',
            summary: 'Terminals, closed vs open circuit, switch operation, and electrical safety.',
            keyFormulas: 'Current direction: Positive terminal -> External circuit -> Negative terminal.\nConductor: Allows current to pass (Metals, Tap water, Graphite).\nInsulator: Does not allow current to pass (Rubber, Plastic, Glass, Air).',
            contentMarkdown: `# Chapter 6: Electricity and Circuits\n\n- Electric cell produces electricity from chemicals stored inside it.\n- A bulb glows only when a closed, unbroken circuit is formed.\n- Electric switch is a simple device that either breaks or completes the circuit.`,
          },
        },
      ],
    },
    {
      name: 'Social Science',
      code: 'SST-6',
      icon: 'globe',
      color: '#8C6013',
      description: 'NCERT Class 6 Social Science: Ancient history, the solar system, latitudes & longitudes, and unity in diversity.',
      chapters: [
        {
          chapterNumber: 1,
          title: 'History: What, Where, How and When?',
          description: 'Finding out what happened in the past, ancient settlements on river banks, manuscripts, inscriptions, and archaeological dates.',
          topics: [
            { name: 'People Along the River Narmada & Sulaiman Hills', order: 1, desc: 'Early hunters, gatherers, and earliest agriculture.' },
            { name: 'Sources of History: Manuscripts & Inscriptions', order: 2, desc: 'Palm leaf manuscripts, rock inscriptions, and decipherment.' },
          ],
          videos: [
            {
              youtubeVideoId: 'rf_dgWj6iks',
              title: 'Class 6 History Chapter 1 | What, Where, How and When? - Full Chapter Explanation',
              duration: '45m 10s',
              durationSeconds: 2710,
              description: 'Magnet Brains complete narrative on ancient civilizations, river settlements, and archaeological sources.',
              isRecommended: true,
              viewCount: 680000,
            },
            {
              youtubeVideoId: '-riD3A_vwaI',
              title: 'Class 6 History Chapter 1 | Introduction & Archaeological Evidence',
              duration: '25m 40s',
              durationSeconds: 1540,
              description: 'How historians reconstruct the past from monuments, coins, and pottery.',
              isRecommended: false,
              viewCount: 290000,
            },
          ],
          lesson: {
            title: 'Introduction to Ancient History and Archaeological Evidence',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube-nocookie.com/embed/rf_dgWj6iks',
            objectives: [
              'Locate the Narmada River, Sulaiman and Kirthar hills on the map of ancient India',
              'Differentiate between manuscripts (handwritten on palm leaves) and inscriptions (engraved on hard rock/metal)',
              'Understand the terms BC (BCE) and AD (CE) in historical dating',
            ],
          },
          note: {
            title: 'Revision Notes: What, Where, How and When?',
            summary: 'Earliest crops, naming of India, manuscript preservation, and timeline conventions.',
            keyFormulas: 'BCE = Before Common Era (counts backward)\nCE = Common Era\nName "India" comes from river Indus (Sindhu in Sanskrit)\nName "Bharat" mentioned in Rigveda.',
            contentMarkdown: `# Chapter 1: What, Where, How and When?\n\n- Earliest crops: Wheat and barley grown in Sulaiman and Kirthar hills around 8,000 years ago.\n- Rice was first grown to the north of the Vindhyas.\n- Magadha (in modern Bihar) became the first great kingdom.`,
          },
        },
        {
          chapterNumber: 2,
          title: 'Geography: The Earth in the Solar System',
          description: 'Celestial bodies, stars, constellations (Ursa Major/Saptarishi), planets, the Sun, Moon, asteroids, and meteoroids.',
          topics: [
            { name: 'Celestial Bodies & Constellations', order: 1, desc: 'Pole Star, Saptarishi, and planetary orbits.' },
            { name: 'Planets of the Solar System & The Earth', order: 2, desc: 'Why Earth is unique (Geoid shape, life support), Moon phases, and asteroids.' },
          ],
          videos: [
            {
              youtubeVideoId: 'hntFjVk3UuI',
              title: 'Class 6 Geography Chapter 1 | The Earth in the Solar System - Full Chapter Explanation',
              duration: '40m 30s',
              durationSeconds: 2430,
              description: 'Magnet Brains complete visual lesson on the solar system, planets, moon phases, and space facts.',
              isRecommended: true,
              viewCount: 750000,
            },
            {
              youtubeVideoId: 'p4U-t-GZ6YI',
              title: 'Class 6 Geography Chapter 1 | Introduction to Celestial Bodies & Planets',
              duration: '22m 15s',
              durationSeconds: 1335,
              description: 'Comparison of inner rocky planets vs outer gaseous giants.',
              isRecommended: false,
              viewCount: 310000,
            },
          ],
          lesson: {
            title: 'The Solar System, Planetary Motion, and Earth as a Habitat',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/hntFjVk3UuI',
            objectives: [
              'List the 8 planets in order of distance from the Sun (My Very Educated Mother Just Served Us Nuts)',
              'Explain why the Earth is called the "Blue Planet" and has a Geoid shape',
              'Distinguish between asteroids (between Mars and Jupiter) and meteoroids',
            ],
          },
          note: {
            title: 'Revision Notes: The Earth in the Solar System',
            summary: 'Planetary order, Earth characteristics, and lunar phases.',
            keyFormulas: 'Planets in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.\nEarth is 3rd nearest to the Sun and 5th largest planet.\nLight travels at 300,000 km/s; takes ~8 minutes from Sun to Earth.',
            contentMarkdown: `# Chapter 2: The Earth in the Solar System\n\n- Venus is considered "Earth\'s twin" because of its similar size and shape.\n- The Moon takes approximately 27 days to orbit the Earth and the same time to spin on its axis, showing only one side to us.\n- Asteroid belt lies between the orbits of Mars and Jupiter.`,
          },
        },
        {
          chapterNumber: 3,
          title: 'Civics: Understanding Diversity',
          description: 'Concept of diversity, cultural, religious, and linguistic differences, case studies of Ladakh and Kerala, and unity in diversity.',
          topics: [
            { name: 'Meaning & Dimensions of Diversity', order: 1, desc: 'How historical and geographical factors shape human habits.' },
            { name: 'Ladakh and Kerala: Unity in Diversity', order: 2, desc: 'Trade routes, spices, pashmina wool, religions, and national anthem pride.' },
          ],
          videos: [
            {
              youtubeVideoId: 'mY2L7h0wP5o',
              title: 'Class 6 Civics Chapter 1 | Understanding Diversity - Full Chapter Explanation',
              duration: '38m 45s',
              durationSeconds: 2325,
              description: 'Magnet Brains complete civics lecture examining Kerala, Ladakh, and India’s composite culture.',
              isRecommended: true,
              viewCount: 540000,
            },
          ],
          lesson: {
            title: 'Cultural Diversity and National Integration in India',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/mY2L7h0wP5o',
            objectives: [
              'Define diversity and explain how geography influences food, clothing, and livelihood',
              'Contrast cold desert life in Ladakh (Pashmina wool, Buddhism, Islam) with coastal life in Kerala (Spices, Cheena-vala, Christianity, Islam, Hinduism)',
              'Understand the phrase "Unity in Diversity" coined by Jawaharlal Nehru in "The Discovery of India"',
            ],
          },
          note: {
            title: 'Revision Notes: Understanding Diversity',
            summary: 'Ladakh vs Kerala comparative study and national unity concept.',
            keyFormulas: 'Ladakh: Cold desert in Jammu & Kashmir, Little Tibet, Pashmina wool from goats.\nKerala: Southwest coast, spice hub (pepper, cloves, cardamom), St. Thomas arrival in 52 AD.\nUnity in Diversity: Coined by Pandit Jawaharlal Nehru.',
            contentMarkdown: `# Chapter 3: Understanding Diversity\n\n- Diversity adds richness and variety to our lives.\n- Despite contrasting geographical conditions, both Kerala and Ladakh were influenced by Chinese and Arab traders.\n- The Indian freedom struggle brought people of diverse religious and regional backgrounds together.`,
          },
        },
      ],
    },
    {
      name: 'English',
      code: 'ENG-6',
      icon: 'book-open',
      color: '#3765BC',
      description: 'NCERT Class 6 English (Honeysuckle & A Pact with the Sun): Prose, moral stories, and grammar.',
      chapters: [
        {
          chapterNumber: 1,
          title: 'Honeysuckle: Who Did Patrick’s Homework?',
          description: 'Carol Moore’s delightful story of Patrick, his aversion to homework, a mysterious elf, and the discovery of self-help.',
          topics: [
            { name: 'Story Analysis & Patrick’s Transformation', order: 1, desc: 'The elf encounter, hard work, and the secret revealed.' },
            { name: 'Vocabulary & NCERT Grammar Exercises', order: 2, desc: 'Idioms, compound words, rhyming sounds, and comprehension questions.' },
          ],
          videos: [
            {
              youtubeVideoId: '5U9D2P1S9oY',
              title: 'Class 6 English Honeysuckle Chapter 1 | Who Did Patrick\'s Homework? - Full Chapter Explanation',
              duration: '32m 20s',
              durationSeconds: 1940,
              description: 'Magnet Brains line-by-line explanation with word meanings and moral insights.',
              isRecommended: true,
              viewCount: 620000,
            },
            {
              youtubeVideoId: '2HVKYk1M76I',
              title: 'Class 6 English Honeysuckle Chapter 1 | NCERT Solutions & Questions',
              duration: '22m 10s',
              durationSeconds: 1330,
              description: 'Grammar practice, working with language, and writing exercises.',
              isRecommended: false,
              viewCount: 270000,
            },
          ],
          lesson: {
            title: 'Story Reading, Character Analysis, and Vocabulary Building',
            durationMinutes: 18,
            videoUrl: 'https://www.youtube-nocookie.com/embed/5U9D2P1S9oY',
            objectives: [
              'Understand the moral message that self-reliance and diligence lead to success',
              'Infer that Patrick himself did all the homework while believing the elf did it',
              'Use new vocabulary: semester, glitch, shrieked, nag, slyly in sentences',
            ],
          },
          note: {
            title: 'Revision Notes: Who Did Patrick’s Homework?',
            summary: 'Theme, character sketch of Patrick, difficult vocabulary, and message.',
            keyFormulas: 'Theme: Hard work and self-help have no substitutes.\nAuthor: Carol Moore\nVocabulary: Ignoramus (an uneducated person), Glitch (a hitch or problem), Nag (one who constantly complains).',
            contentMarkdown: `# Chapter 1: Who Did Patrick\'s Homework?\n\n- Patrick hated homework and loved Nintendo and basketball.\n- He saved a tiny man (elf) from his cat.\n- To help the elf with homework, Patrick ended up reading dictionaries, calculating tables, and researching history.\n- Patrick earned A grades through his own hard work.`,
          },
        },
        {
          chapterNumber: 2,
          title: 'A Pact with the Sun: A Tale of Two Birds',
          description: 'A classic Panchatantra tale of two twin birds separated by a thunderstorm and how environment shapes character.',
          topics: [
            { name: 'Story Narrative: The Robbers\' Cave vs The Rishi\'s Ashram', order: 1, desc: 'Impact of company on behavior and speech.' },
            { name: 'Moral Lesson & Question Answers', order: 2, desc: 'One is known by the company one keeps.' },
          ],
          videos: [
            {
              youtubeVideoId: '5fL38n7W6sA',
              title: 'Class 6 English Supplementary Chapter 1 | A Tale of Two Birds - Full Explanation & NCERT Solutions',
              duration: '28m 40s',
              durationSeconds: 1720,
              description: 'Magnet Brains complete narrative walkthrough on good company and character building.',
              isRecommended: true,
              viewCount: 490000,
            },
          ],
          lesson: {
            title: 'The Value of Good Association and Moral Judgment',
            durationMinutes: 16,
            videoUrl: 'https://www.youtube-nocookie.com/embed/5fL38n7W6sA',
            objectives: [
              'Appreciate how surrounding influences language, demeanor, and attitude',
              'Compare the welcoming speech of the ashram bird with the harsh words of the cave bird',
              'Retell the story in one\'s own words with clear sequence of events',
            ],
          },
          note: {
            title: 'Revision Notes: A Tale of Two Birds',
            summary: 'Setting, contrast between twin birds, and moral proverb.',
            keyFormulas: 'Proverb: "One is known by the company one keeps."\nSource: Indian folk and Panchatantra tradition.',
            contentMarkdown: `# Chapter 2: A Tale of Two Birds\n\n- Mother bird dies in a great storm; the two fledglings are separated.\n- One lands near a robber\'s cave, learning rude and criminal language.\n- The other lands near a saint\'s ashram, learning to welcome weary travelers warmly.\n- The king observes that despite looking identical, their conduct reflects their company.`,
          },
        },
      ],
    },
    {
      name: 'Hindi',
      code: 'HIN-6',
      icon: 'languages',
      color: '#1B4D2F',
      description: 'NCERT Class 6 Hindi (Vasant Bhaag 1): Poems, inspiring memoirs, stories, and Hindi Vyakaran.',
      chapters: [
        {
          chapterNumber: 1,
          title: 'Vasant: Vah Chidiya Jo (वह चिड़िया जो)',
          description: 'Kedarnath Agarwal’s beloved poem depicting a small blue bird’s love for nature, self-respect, sweet song, and freedom.',
          topics: [
            { name: 'Kavita Ka Bhavarth (कविता का भावार्थ)', order: 1, desc: 'Padya vyakhya, neeli chidiya ki visheshtayein.' },
            { name: 'Prashnottar aur Bhasha ki Baat (प्रश्नोत्तर)', order: 2, desc: 'Visheshan, prayaywachi shabd, and comprehension.' },
          ],
          videos: [
            {
              youtubeVideoId: '1r93F2Fz1pM',
              title: 'Class 6 Hindi Vasant Chapter 1 | Vah Chidiya Jo - Full Poem Explanation & Question Answers',
              duration: '31m 10s',
              durationSeconds: 1870,
              description: 'Magnet Brains complete poetry analysis, word meanings, and NCERT exercise solutions.',
              isRecommended: true,
              viewCount: 810000,
            },
          ],
          lesson: {
            title: 'Vah Chidiya Jo: Kavita Pathan evam Bhavarth',
            durationMinutes: 18,
            videoUrl: 'https://www.youtube-nocookie.com/embed/1r93F2Fz1pM',
            objectives: [
              'Kavita ka uchit laya aur taal ke saath saaswar pathan karna',
              'Neel-pankhon wali chidiya ke guno (santoshi, garveeli, ras-udelkane wali) ko samajhna',
              'Visheshan shabdon ki pehchan karna (neele pankhon wali, choti santoshi chidiya)',
            ],
          },
          note: {
            title: 'Revision Notes: Vah Chidiya Jo',
            summary: 'Kavi parichay, kathin shabdarth, aur mukhya sandesh.',
            keyFormulas: 'Kavi: Kedarnath Agarwal\nShabdarth: Jundi ke dane = Jowar ke kacche dane; Ras udelkar = Meethi aawaz mein; Garveeli = Garv karne wali.',
            contentMarkdown: `# Path 1: Vah Chidiya Jo\n\n- Kavi neel-pankhon wali ek choti santoshi chidiya ke madhyam se manav swabhav ke sundar gunon ka varnan karte hain.\n- Chidiya ko anna se, jangal se aur uffanti nadi se atyadhik prem hai.\n- Sandesh: Humein santoshi, swabhimaani aur prakriti-premi hona chahiye.`,
          },
        },
        {
          chapterNumber: 2,
          title: 'Vasant: Bachpan (बचपन)',
          description: 'Renowned author Krishna Sobti’s nostalgic memoir describing childhood memories in Shimla, changing times, clothing, and food habits.',
          topics: [
            { name: 'Sansmaran ki Vyakhya (संस्मरण की व्याख्या)', order: 1, desc: 'Shimla ki yadein, pehnava, chocolate aur gungune din.' },
            { name: 'Prashnottar aur Bhasha ki Samajh (प्रश्नोत्तर)', order: 2, desc: 'Kriya, kaal, aur sansmaranatmak lekh.' },
          ],
          videos: [
            {
              youtubeVideoId: 'ge3VC4pv3NE',
              title: 'Class 6 Hindi Vasant Chapter 2 | Bachpan - Full Chapter Explanation & NCERT Exercise',
              duration: '36m 45s',
              durationSeconds: 2205,
              description: 'Magnet Brains detailed walkthrough of Krishna Sobti’s childhood memoir with exercises.',
              isRecommended: true,
              viewCount: 670000,
            },
          ],
          lesson: {
            title: 'Bachpan: Krishna Sobti ka Sansmaran',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/ge3VC4pv3NE',
            objectives: [
              'Sansmaran vidha ki visheshtayein aur katha pravah ko samajhna',
              'Lekhika ke bachpan aur vartaman samay ke antar ko rekhaankit karna',
              'Kaal (Bhootkaal, Vartamankaal, Bhavishyatkaal) ke prayog ka abhyas karna',
            ],
          },
          note: {
            title: 'Revision Notes: Bachpan',
            summary: 'Lekhika parichay, Shimla ridge ki dukanon ka zikr, chashma pehanna, aur prashnottar.',
            keyFormulas: 'Lekhika: Krishna Sobti (Janam 1925)\nSahitya Vidha: Sansmaran (Memoir)\nMukhya Bindu: Castor oil ki khushboo, gramophone, Shimla Mall, Chashma lagne par bhai ka chidhana.',
            contentMarkdown: `# Path 2: Bachpan\n\n- Lekhika apne bachpan ki pehnavo (frocks, lehenga, gherdar kurte) aur Saturday ko castor oil peene ke niyam ka zikr karti hain.\n- Us samay gramophone hote the, radio ya television nahi the.\n- Dheere-dheere lekhika ke pehnave mein halka rang aur saadgi aayi.`,
          },
        },
      ],
    },
  ];

  // 3. Process and create in DB
  let totalSubjects = 0;
  let totalChapters = 0;
  let totalVideos = 0;
  let totalLessons = 0;

  for (const sData of subjectsData) {
    // Upsert Subject
    const subject = await prisma.subject.upsert({
      where: {
        classId_code: {
          classId: class6.id,
          code: sData.code,
        },
      },
      update: {
        name: sData.name,
        icon: sData.icon,
        color: sData.color,
        description: sData.description,
      },
      create: {
        classId: class6.id,
        name: sData.name,
        code: sData.code,
        icon: sData.icon,
        color: sData.color,
        description: sData.description,
      },
    });

    totalSubjects++;
    console.log(`[Subject] ${subject.name} (${subject.code}) ready.`);

    for (const chData of sData.chapters) {
      // Find or create Chapter
      let chapter = await prisma.chapter.findFirst({
        where: {
          subjectId: subject.id,
          chapterNumber: chData.chapterNumber,
        },
      });

      if (!chapter) {
        chapter = await prisma.chapter.create({
          data: {
            subjectId: subject.id,
            chapterNumber: chData.chapterNumber,
            title: chData.title,
            description: chData.description,
          },
        });
      } else {
        chapter = await prisma.chapter.update({
          where: { id: chapter.id },
          data: {
            title: chData.title,
            description: chData.description,
          },
        });
      }

      totalChapters++;

      // Create Topics
      const createdTopics = [];
      for (const t of chData.topics) {
        let topic = await prisma.topic.findFirst({
          where: {
            chapterId: chapter.id,
            name: t.name,
          },
        });
        if (!topic) {
          topic = await prisma.topic.create({
            data: {
              chapterId: chapter.id,
              name: t.name,
              order: t.order,
              description: t.desc,
            },
          });
        }
        createdTopics.push(topic);
      }

      // Create Magnet Brains Learning Videos
      for (const v of chData.videos) {
        await prisma.learningVideo.upsert({
          where: { youtubeVideoId: v.youtubeVideoId },
          update: {
            chapterId: chapter.id,
            topicId: createdTopics[0]?.id || null,
            title: v.title,
            channelName: 'Magnet Brains',
            channelId: 'UC7f6k_m3n9P1q7L2n5W8w1v',
            thumbnailUrl: `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`,
            description: v.description,
            duration: v.duration,
            durationSeconds: v.durationSeconds,
            language: 'Hindi/English',
            relevanceScore: 96.0,
            qualityScore: 98.0,
            isRecommended: v.isRecommended,
            isApproved: true,
            isCurated: true,
            viewCount: v.viewCount,
          },
          create: {
            chapterId: chapter.id,
            topicId: createdTopics[0]?.id || null,
            youtubeVideoId: v.youtubeVideoId,
            title: v.title,
            channelName: 'Magnet Brains',
            channelId: 'UC7f6k_m3n9P1q7L2n5W8w1v',
            thumbnailUrl: `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`,
            description: v.description,
            duration: v.duration,
            durationSeconds: v.durationSeconds,
            language: 'Hindi/English',
            relevanceScore: 96.0,
            qualityScore: 98.0,
            isRecommended: v.isRecommended,
            isApproved: true,
            isCurated: true,
            viewCount: v.viewCount,
          },
        });
        totalVideos++;
      }

      // Create Lesson
      if (chData.lesson) {
        const existingLesson = await prisma.lesson.findFirst({
          where: { chapterId: chapter.id, lessonNumber: 1 },
        });

        if (!existingLesson) {
          await prisma.lesson.create({
            data: {
              chapterId: chapter.id,
              topicId: createdTopics[0]?.id || null,
              lessonNumber: 1,
              title: chData.lesson.title,
              durationMinutes: chData.lesson.durationMinutes,
              videoUrl: chData.lesson.videoUrl,
              videoSource: 'Magnet Brains Official',
              objectivesJson: JSON.stringify(chData.lesson.objectives),
              isPublished: true,
            },
          });
          totalLessons++;
        }
      }

      // Create Note
      if (chData.note) {
        const existingNote = await prisma.note.findFirst({
          where: { chapterId: chapter.id },
        });

        if (!existingNote) {
          await prisma.note.create({
            data: {
              chapterId: chapter.id,
              title: chData.note.title,
              summary: chData.note.summary,
              keyFormulas: chData.note.keyFormulas,
              contentMarkdown: chData.note.contentMarkdown,
            },
          });
        }
      }

      // Create Quiz & Questions
      const existingQuiz = await prisma.quiz.findFirst({
        where: { chapterId: chapter.id },
      });

      if (!existingQuiz) {
        const quiz = await prisma.quiz.create({
          data: {
            chapterId: chapter.id,
            title: `${chData.title} - Mastery Assessment`,
            passScore: 7,
            timeLimitMinutes: 15,
          },
        });

        // Add 2 practice questions
        await prisma.question.create({
          data: {
            chapterId: chapter.id,
            questionText: `Which of the following statements is true regarding ${chData.title}?`,
            optionsJson: JSON.stringify([
              'It forms an essential conceptual pillar of Class 6 curriculum',
              'It has no practical application in real life',
              'It is strictly limited to higher secondary education',
              'None of the above',
            ]),
            correctAnswer: 'It forms an essential conceptual pillar of Class 6 curriculum',
            explanation: `According to NCERT Class 6 standards, this chapter builds fundamental foundations for further scientific and mathematical study.`,
            difficulty: 'Easy',
          },
        });

        await prisma.question.create({
          data: {
            chapterId: chapter.id,
            questionText: `What is the most effective approach to revise ${chData.title}?`,
            optionsJson: JSON.stringify([
              'Memorizing without conceptual understanding',
              'Watching curated Magnet Brains lessons, taking notes, and solving NCERT exercises',
              'Skipping foundational examples',
              'Only reading on the exam day',
            ]),
            correctAnswer: 'Watching curated Magnet Brains lessons, taking notes, and solving NCERT exercises',
            explanation: `Structured concept learning through video explanation combined with NCERT exercise practice provides durable retention.`,
            difficulty: 'Easy',
          },
        });
      }
    }
  }

  console.log('--- Seeding Completed Successfully! ---');
  console.log(`Summary:
  - Class 6 Subjects Created/Updated: ${totalSubjects}
  - Chapters Added: ${totalChapters}
  - Magnet Brains Videos Curated: ${totalVideos}
  - Interactive Lessons Created: ${totalLessons}
  `);

  if (!client) {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && process.argv[1].includes('seedClass6MagnetBrains')) {
  seedClass6MagnetBrains().catch((err) => {
    console.error('Error during Class 6 seeding:', err);
    process.exit(1);
  });
}
