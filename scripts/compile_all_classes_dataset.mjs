import fs from 'fs';
import { class6CurriculumData } from './class6Data.mjs';

const rawVideos = JSON.parse(fs.readFileSync('scripts/raw_all_classes_videos.json', 'utf8'));
console.log(`Loaded ${rawVideos.length} raw videos for Classes 7-10.`);

// Helper to detect lecture type
function detectLectureType(title) {
  const t = title.toLowerCase();
  if (/one\s*shot|complete\s*chapter\s*in\s*one|marathon|full\s*chapter\s*revision/i.test(t)) return 'One-Shot Revision';
  if (/revision|summary|mind\s*map|quick\s*recap/i.test(t)) return 'Revision';
  if (/overview|introduction|strategy|complete\s*strategy|book\s*overview/i.test(t)) return 'Chapter Introduction';
  if (/ncert\s*solutions?|exercise\s*\d|ex\s*\d|textbook\s*solutions?/i.test(t)) return 'NCERT Solutions';
  if (/example|solved\s*example|figure\s*it\s*out|activity/i.test(t)) return 'Example Solving';
  if (/mcq|multiple\s*choice|objective\s*questions/i.test(t)) return 'MCQ';
  if (/previous\s*year|pyq|board\s*questions|exam\s*prep|important\s*questions|miq/i.test(t)) return 'Previous Year Questions';
  if (/practice|practice\s*questions|worksheet/i.test(t)) return 'Practice Questions';
  if (/full\s*chapter/i.test(t)) return 'Full Chapter Lecture';
  if (/concept|derivation|theorem|law|proof/i.test(t)) return 'Concept Lecture';
  return 'Topic Explanation';
}

// -------------------------------------------------------------
// CURRICULUM DEFINITIONS
// -------------------------------------------------------------

// CLASS 7 SUBJECTS & CHAPTERS
const class7CurriculumDef = [
  {
    name: 'Mathematics',
    code: 'MATH-7',
    bookName: 'Ganita Prakash',
    icon: 'calculator',
    color: '#2E7D4E',
    description: 'Current NCERT 2026–27 curriculum for Class 7 Mathematics (Ganita Prakash).',
    chapters: [
      { num: 1, title: 'Large Numbers Around Us', desc: 'Understanding large numbers in daily life, estimation, Indian and International place value systems.', key: /large\s*numbers|place\s*value|ch\s*1\b|chapter\s*1\b|part\s*1.*overview/i },
      { num: 2, title: 'Arithmetic Expressions', desc: 'Order of operations, grouping symbols, brackets, and evaluating arithmetic expressions.', key: /arithmetic\s*expressions?|order\s*of\s*operations|bodmas|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'A Peek Beyond the Point', desc: 'Decimals in daily measurements, representation on number line, decimal arithmetic.', key: /peek\s*beyond\s*the\s*point|beyond\s*the\s*point|decimals?|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Expressions Using Letter-Numbers', desc: 'Introduction to variables, forming algebraic expressions, coefficients, and terms.', key: /letter[- ]numbers?|algebraic\s*expressions?|variables|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Parallel and Intersecting Lines', desc: 'Angles formed by intersecting lines, transversal lines, parallel line angle properties.', key: /parallel.*intersecting|lines\s*and\s*angles|transversal|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Number Play', desc: 'Factors, multiples, divisibility tests, prime factorization, and mathematical puzzles.', key: /number\s*play|factors.*multiples|divisibility|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'A Tale of Three Intersecting Lines', desc: 'Properties of triangles, angle sum property, exterior angle theorem, and triangle inequalities.', key: /tale\s*of\s*three|properties\s*of\s*triangles?|triangle\s*and\s*its\s*properties|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Working with Fractions', desc: 'Operations with fractions, mixed fractions, reciprocal fractions, and fractional word problems.', key: /working\s*with\s*fractions|fractions|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'Geometric Twins', desc: 'Congruence of geometric figures, congruence criteria for triangles: SSS, SAS, ASA, RHS.', key: /geometric\s*twins|congruen|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Playing with Integers', desc: 'Integers, rules of addition, subtraction, multiplication, division, and number line proofs.', key: /playing\s*with\s*integers|integers|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'Connecting the Dots…', desc: 'Data handling, frequency tables, bar graphs, double bar graphs, mean, median, mode.', key: /connecting\s*the\s*dots|data\s*handling|statistics|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'Finding the Unknown', desc: 'Simple linear equations, balance method, transposition, and solving practical word problems.', key: /finding\s*the\s*unknown|simple\s*equations?|linear\s*equations?|ch\s*12\b|chapter\s*12\b/i },
    ]
  },
  {
    name: 'Science',
    code: 'SCI-7',
    bookName: 'Curiosity',
    icon: 'microscope',
    color: '#3B82F6',
    description: 'Current NCERT 2026–27 inquiry-based curriculum for Class 7 Science (Curiosity).',
    chapters: [
      { num: 1, title: 'The Ever-Evolving World of Science', desc: 'Scientific inquiry, curiosity, milestones of scientific discovery, observation, and experimentation.', key: /ever[- ]evolving|world\s*of\s*science|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'Exploring Substances: Acidic, Basic, and Neutral', desc: 'Acids, bases, natural and synthetic indicators, neutralization reactions, and practical applications.', key: /acidic|acids?,?\s*bases?|neutral|indicators?|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Electricity: Circuits and their Components', desc: 'Electric circuits, circuit diagrams, electric symbols, heating effect, magnetic effect, and safety fuses.', key: /circuits\s*and\s*their\s*components|electric\s*circuits?|electric\s*current|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'The World of Metals and Non-metals', desc: 'Physical and chemical properties of metals and non-metals, conductivity, ductility, malleability.', key: /metals\s*and\s*non[- ]metals|world\s*of\s*metals|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Changes Around Us: Physical and Chemical', desc: 'Reversible and irreversible changes, physical transformations, chemical reactions, rusting of iron, crystallization.', key: /changes\s*around\s*us|physical\s*and\s*chemical\s*changes?|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Adolescence: A Stage of Growth and Change', desc: 'Biological changes during adolescence, hormones, nutritional needs, reproductive health, emotional well-being.', key: /adolescen|growth\s*and\s*change|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Heat Transfer in Nature', desc: 'Conduction, convection, radiation, sea breeze, land breeze, thermometer use, temperature scales.', key: /heat\s*transfer|conduction|convection|radiation|heat|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Measurement of Time and Motion', desc: 'Simple pendulum, periodic motion, measuring speed, uniform and non-uniform motion, distance-time graphs.', key: /time\s*and\s*motion|motion\s*and\s*time|speed|pendulum|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'Life Processes in Animals', desc: 'Digestion in animals, human digestive system, respiration, circulatory system, blood vessels, excretion.', key: /life\s*processes\s*in\s*animals|nutrition\s*in\s*animals|respiration\s*in\s*organisms|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Life Processes in Plants', desc: 'Photosynthesis, transport of water and nutrients, xylem, phloem, plant reproduction: sexual and vegetative.', key: /life\s*processes\s*in\s*plants|nutrition\s*in\s*plants|reproduction\s*in\s*plants|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'Light: Shadows and Reflections', desc: 'Propagation of light, reflection from mirrors, concave and convex mirrors, lenses, dispersion, Newton’s disc.', key: /light:?\s*shadows|reflection|mirrors|lenses|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'Earth, Moon, and the Sun', desc: 'Solar system mechanics, phases of the moon, eclipses, seasons on earth, gravitational balance, tides.', key: /earth,?\s*moon,?\s*and\s*the\s*sun|solar\s*system|eclipses|ch\s*12\b|chapter\s*12\b/i },
    ]
  },
  {
    name: 'Social Science',
    code: 'SST-7',
    bookName: 'Exploring Society: India and Beyond',
    icon: 'globe',
    color: '#D97706',
    description: 'Current NCERT 2026–27 multidisciplinary social science curriculum for Class 7.',
    chapters: [
      { num: 1, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Geographical Diversity of India', desc: 'Physiographic divisions of India: Himalayas, Northern Plains, Peninsular Plateau, Thar Desert, Coastal Plains, Islands.', key: /geographical\s*diversity|diversity\s*of\s*india|physiographic|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Understanding the Weather', desc: 'Elements of weather, atmospheric temperature, humidity, pressure, wind patterns, rainfall measurement.', key: /understanding\s*the\s*weather|weather|humidity|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Climates of India', desc: 'Monsoon system, seasonal cycles of India, regional climatic variations, climate impact on agriculture and life.', key: /climates?\s*of\s*india|monsoon|seasonal\s*cycles?|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'New Beginnings: Cities and States', desc: 'Second urbanisation, Mahajanapadas, early state formations, coins, guilds, agricultural expansion.', key: /new\s*beginnings|cities\s*and\s*states|mahajanapadas|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Rise of Empires', desc: 'Mauryan empire, Chandragupta Maurya, Ashoka’s Dhamma, imperial administration, rock edicts.', key: /rise\s*of\s*empires|maurya|ashoka|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Age of Reorganisation', desc: 'Post-Mauryan polities, Kushanas, Satavahanas, trade routes, Silk Road connections, cultural exchanges.', key: /age\s*of\s*reorganisation|kushana|satavahana|silk\s*road|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Gupta Era: An Age of Tireless Creativity', desc: 'Gupta empire, governance, classical literature, mathematics, astronomy, art, architecture, metallurgy.', key: /gupta\s*era|age\s*of\s*tireless\s*creativity|kalidasa|aryabhata|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS', title: 'How the Land Becomes Sacred', desc: 'Pilgrimage traditions, sacred geographies, sacred rivers, temples, pilgrimage routes, cultural unity.', key: /how\s*the\s*land\s*becomes\s*sacred|sacred\s*land|pilgrimage|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'From the Rulers to the Ruled: Types of Governments', desc: 'Monarchy, oligarchy, dictatorship, and democracy; citizens’ participation, fundamental principles of democratic rule.', key: /from\s*the\s*rulers|types\s*of\s*governments|forms\s*of\s*government|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'The Constitution of India — An Introduction', desc: 'Framing of Indian Constitution, Constituent Assembly, Preamble, key constitutional values: justice, liberty, equality.', key: /constitution\s*of\s*india|preamble|constituent\s*assembly|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'From Barter to Money', desc: 'Evolution of exchange, barter system drawbacks, commodity money, metallic coinage, modern currency, digital payments.', key: /from\s*barter\s*to\s*money|barter|evolution\s*of\s*money|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'Understanding Markets', desc: 'Weekly markets, neighbourhood shops, shopping complexes, wholesale traders, supply chains, e-commerce.', key: /understanding\s*markets|markets?\s*around\s*us|supply\s*chain|ch\s*12\b|chapter\s*12\b/i },
    ]
  },
  {
    name: 'English',
    code: 'ENG-7',
    bookName: 'Poorvi',
    icon: 'book-open',
    color: '#8B5CF6',
    description: 'Current NCERT 2026–27 English language and literature curriculum (Poorvi).',
    chapters: [
      { num: 1, title: 'Unit 1: Learning Together', desc: 'Collaborative learning, perseverance, and visual perception: The Day the River Spoke, Try Again, Three Days to See.', key: /learning\s*together|day\s*the\s*river\s*spoke|try\s*again|three\s*days\s*to\s*see|unit\s*1\b|book\s*overview/i },
      { num: 2, title: 'Unit 2: Wit and Humour', desc: 'Playful wit, humorous situations, and conversational eloquence: Animals, Birds, and Dr. Dolittle, A Funny Man, Say the Right Thing.', key: /wit\s*and\s*humour|dr\.?\s*dolittle|funny\s*man|say\s*the\s*right\s*thing|unit\s*2\b/i },
      { num: 3, title: 'Unit 3: Dreams and Discoveries', desc: 'Inventive spirit, childhood wonder, and exploration: My Brother’s Great Invention, Paper Boats, North, South, East, West.', key: /dreams\s*and\s*discoveries|great\s*invention|paper\s*boats|north,?\s*south|unit\s*3\b/i },
      { num: 4, title: 'Unit 4: Travel and Adventure', desc: 'Journeys, railway tunnels, wanderlust, and mountain climbs: The Tunnel, Travel, Conquering the Summit.', key: /travel\s*and\s*adventure|the\s*tunnel|conquering\s*the\s*summit|unit\s*4\b/i },
      { num: 5, title: 'Unit 5: Bravehearts', desc: 'Patriotism, valor, sacrifice, and regional warrior heroines: A Homage to Our Brave Soldiers, My Dear Soldiers, Rani Abbakka.', key: /bravehearts|brave\s*soldiers|rani\s*abbakka|unit\s*5\b/i },
    ]
  },
  {
    name: 'Hindi',
    code: 'HIN-7',
    bookName: 'Malhar',
    icon: 'languages',
    color: '#EF4444',
    description: 'Current NCERT 2026–27 Hindi core curriculum for Class 7 (Malhar).',
    chapters: [
      { num: 1, title: 'माँ, कह एक कहानी', desc: 'मैथिलीशरण गुप्त द्वारा रचित महात्मा बुद्ध के बचपन, यशोधरा और राहुल के संवाद पर आधारित प्रसिद्ध कविता।', key: /माँ,?\s*कह\s*एक\s*कहानी|maa\s*kah\s*ek\s*kahani|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'तीन बुद्धिमान', desc: 'बुद्धिमत्ता, प्रत्युत्पन्नमतित्व और न्यायप्रियता को उजागर करती रोचक प्रेरक लोककथा।', key: /तीन\s*बुद्धिमान|teen\s*buddhiman|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'फूल और काँटा', desc: 'अयोध्या सिंह उपाध्याय ‘हरिऔध’ की नीतिपरक कविता जो कर्म और स्वभाव की महत्ता बताती है।', key: /फूल\s*और\s*काँटा|phool\s*aur\s*kanta|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'पानी रे पानी', desc: 'अनुपम मिश्र का जल संरक्षण, जल चक्र और भूजल संकट पर विचारोत्तेजक और ज्ञानवर्धक निबंध।', key: /पानी\s*रे\s*पानी|paani\s*re\s*paani|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'नहीं होना बीमार', desc: 'स्वास्थ्य रक्षा, स्वच्छता, संतुलित दिनचर्या और पौष्टिक आहार के महत्व पर आधारित पाठ।', key: /नहीं\s*होना\s*बीमार|nahi\s*hona\s*bimar|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'गिरधर कविराय की कुंडलियाँ', desc: 'गिरधर कविराय द्वारा रचित लोक-व्यवहार, नीति और व्यावहारिक जीवन मूल्यों की कुंडलियाँ।', key: /गिरधर\s*कविराय|kundaliyan|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'वर्षा-बहार', desc: 'मुकुटधर पाण्डेय द्वारा रचित वर्षा ऋतु के प्राकृतिक सौंदर्य, हरियाली और उल्लास की सजीव कविता।', key: /वर्षा[- ]बहार|varsha\s*bahar|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'बिरजू महाराज से साक्षात्कार', desc: 'कथक सम्राट पंडित बिरजू महाराज के नृत्य-साधना, रियाज और जीवन-संघर्ष पर आधारित प्रेरक साक्षात्कार।', key: /बिरजू\s*महाराज|birju\s*maharaj|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'चिड़िया', desc: 'आरसी प्रसाद सिंह की कविता जो पक्षियों के उन्मुक्त जीवन, स्वाधीनता और प्रकृति के अनुराग को दर्शाती है।', key: /चिड़िया|chidiya|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'मीरा के पद', desc: 'भक्तिकालीन संत कवयित्री मीराबाई के श्रीकृष्ण भक्ति, समर्पण और विरह से परिपूर्ण प्रसिद्ध पद।', key: /मीरा\s*के\s*पद|meera\s*ke\s*pad|पाठ\s*10\b|ch\s*10\b/i },
    ]
  },
  {
    name: 'Sanskrit',
    code: 'SKT-7',
    bookName: 'Deepakam',
    icon: 'scroll',
    color: '#B45309',
    description: 'Current NCERT 2026–27 Sanskrit curriculum for Class 7 (Deepakam).',
    chapters: [
      { num: 1, title: 'वन्दे भारतमातरम्', desc: 'मातृभूमि-वन्दना, राष्ट्रगौरवः, देशभक्तिपूर्णं मङ्गलगीतम्।', key: /वन्दे\s*भारतमातरम्|vande\s*bharat|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'नित्यं पिबामः सुभाषितरसम्', desc: 'सुभाषितानि, विद्यायाः महत्वं, सज्जनसङ्गतिः, नैतिकमूल्यानि।', key: /नित्यं\s*पिबामः|सुभाषितरसम्|subhashita|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'मित्राय नमः', desc: 'मित्रतायाः स्वरूपं, सूर्यस्य द्वादशनामानि, आरोग्यम् योगसाधना च।', key: /मित्राय\s*नमः|mitraya\s*namah|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'न लभ्यते चेत् आम्लं द्राक्षाफलम्', desc: 'लोमश्याः कथा, सङ्घर्षः, आत्मप्रबोधः, हास्यरसपूर्णा कथा।', key: /आम्लं\s*द्राक्षाफलम्|drakshaphalam|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'सेवा हि परमो धर्मः', desc: 'परोपकारः, सेवाभावः, परोपकाराय सतां विभूतयः।', key: /सेवा\s*हि\s*परमो\s*धर्मः|seva\s*hi\s*paramo|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'क्रीडाम वयं श्लोकान्त्याक्षरीम्', desc: 'श्लोक-अन्त्याक्षरी-क्रीडा, संस्कृतभाषया ज्ञानवर्धनम् मनोरञ्जनं च।', key: /श्लोकान्त्याक्षरीम्|antyakshari|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'ईशावास्यम् इदं सर्वम्', desc: 'ईशावास्योपनिषदः मन्त्राः, त्यागभावेन भोगः, अध्यात्मदर्शनम्।', key: /ईशावास्यम्|ishavasyam|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'हितं मनोहारि च दुर्लभं वचः', desc: 'किरातार्जुनीयस्य सूक्तयः, सत्यप्रियवचनं, नीतिशिक्षा।', key: /हितं\s*मनोहारि|hitam\s*manohari|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'अन्नाद् भवन्ति भूतानि', desc: 'अन्नस्य महत्वं, कृषिकार्यं, प्रकृतिसंरक्षणम्, उपनिषद्वाणी।', key: /अन्नाद्\s*भवन्ति|annad\s*bhavanti|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'दशमः कः?', desc: 'दशबालकानां कथा, आत्मज्ञानम्, व्यावहारिकचातुर्यम्।', key: /दशमः\s*कः|dashamah\s*kah|पाठ\s*10\b|ch\s*10\b/i },
      { num: 11, title: 'द्वीपेषु रम्यः द्वीपोऽण्डमानः', desc: 'अण्डमान-निकोबार-द्वीपसमूहस्य प्राकृतिकसौन्दर्यं, ऐतिहासिकमहत्वम्।', key: /अण्डमान|andaman|पाठ\s*11\b|ch\s*11\b/i },
      { num: 12, title: 'वीराङ्गना पन्नाधाया', desc: 'पन्नाधायस्य अपूर्वत्यागः, स्वामिभक्तिः, शौर्यकथा।', key: /पन्नाधाया|pannadhaya|पाठ\s*12\b|ch\s*12\b/i },
    ]
  }
];

// CLASS 8 SUBJECTS & CHAPTERS
const class8CurriculumDef = [
  {
    name: 'Mathematics',
    code: 'MATH-8',
    bookName: 'Ganita Prakash (Part 1 & 2)',
    icon: 'calculator',
    color: '#2E7D4E',
    description: 'Current NCERT 2026–27 curriculum for Class 8 Mathematics (Ganita Prakash).',
    chapters: [
      { num: 1, title: 'A Square and A Cube', desc: 'Square numbers, properties, square roots by prime factorisation and division method; cube numbers and cube roots.', key: /square.*cube|squares?\s*and\s*cubes?|square\s*roots?|ch\s*1\b|chapter\s*1\b|part\s*1.*overview/i },
      { num: 2, title: 'Power Play', desc: 'Powers with negative exponents, laws of exponents, standard form of small and large numbers.', key: /power\s*play|exponents?\s*and\s*powers?|laws\s*of\s*exponents|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'A Story of Numbers', desc: 'Rational numbers, closure, commutativity, associativity, distributive property, additive and multiplicative identities.', key: /story\s*of\s*numbers|rational\s*numbers?|properties\s*of\s*rational|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Quadrilaterals', desc: 'Classification of polygons, interior and exterior angle sum, special quadrilaterals: trapezium, parallelogram, rhombus, rectangle, square.', key: /quadrilaterals?|polygons?|parallelogram|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Number Play', desc: 'Digits in disguise, cryptarithms, divisibility tests by 2, 3, 5, 9, 10, 11, and number patterns.', key: /number\s*play|digits\s*in\s*disguise|divisibility|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'We Distribute, Yet Things Multiply', desc: 'Algebraic terms, multiplication of monomials, binomials and polynomials, distributive law in algebra.', key: /distribute.*multiply|algebraic\s*multiplication|polynomials?|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Proportional Reasoning-1', desc: 'Direct proportion, constant of variation, unitary method, real-life applications and scale drawing.', key: /proportional\s*reasoning[- ]1|direct\s*proportion|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Fractions in Disguise', desc: 'Decimals, fractions, percentages, profit & loss, discount, tax, and sales calculation.', key: /fractions\s*in\s*disguise|comparing\s*quantities|percentage|profit\s*and\s*loss|part\s*2\s*ch\s*1|ch\s*8\b/i },
      { num: 9, title: 'The Baudhayana-Pythagoras Theorem', desc: 'Baudhayana-Pythagoras theorem, geometric proofs, Pythagorean triplets, and right-angled triangle problems.', key: /baudhayana|pythagor|part\s*2\s*ch\s*2|ch\s*9\b/i },
      { num: 10, title: 'Proportional Reasoning-2', desc: 'Inverse proportion, time and work, speed and time problems, multi-step ratio reasoning.', key: /proportional\s*reasoning[- ]2|inverse\s*proportion|time\s*and\s*work|part\s*2\s*ch\s*3|ch\s*10\b/i },
      { num: 11, title: 'Exploring Some Geometric Themes', desc: 'Geometric transformations, tessellations, symmetry, and architectural patterns.', key: /exploring\s*some\s*geometric|geometric\s*themes|tessellation|part\s*2\s*ch\s*4|ch\s*11\b/i },
      { num: 12, title: 'Tales by Dots and Lines', desc: 'Data handling, frequency distribution, histograms, pie charts, and introduction to coordinate plotting.', key: /tales\s*by\s*dots|data\s*handling|histograms?|pie\s*charts?|part\s*2\s*ch\s*5|ch\s*12\b/i },
      { num: 13, title: 'Algebra Play', desc: 'Standard algebraic identities, factorisation by grouping, factorisation using identities, linear equations in one variable.', key: /algebra\s*play|factorisation|algebraic\s*identities|linear\s*equations?|part\s*2\s*ch\s*6|ch\s*13\b/i },
      { num: 14, title: 'Area', desc: 'Mensuration: area of trapezium, general quadrilateral, rhombus; surface area and volume of cube, cuboid, cylinder.', key: /mensuration|area|surface\s*area|volume|cylinder|part\s*2\s*ch\s*7|ch\s*14\b/i },
    ]
  },
  {
    name: 'Science',
    code: 'SCI-8',
    bookName: 'Curiosity',
    icon: 'microscope',
    color: '#3B82F6',
    description: 'Current NCERT 2026–27 inquiry-based curriculum for Class 8 Science (Curiosity).',
    chapters: [
      { num: 1, title: 'Exploring the Investigative World of Science', desc: 'Scientific inquiry method, asking testable questions, controlled experiments, data interpretation.', key: /investigative\s*world|world\s*of\s*science|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'The Invisible Living World: Beyond Our Naked Eye', desc: 'Microorganisms, bacteria, fungi, protozoa, algae, viruses, beneficial microbes in food and medicine, pathogenic microbes.', key: /invisible\s*living\s*world|microorganisms?|bacteria|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Health: The Ultimate Treasure', desc: 'Nutrition, balanced diet, infectious and non-communicable diseases, immunity, vaccination, mental well-being.', key: /health:?\s*the\s*ultimate\s*treasure|ultimate\s*treasure|disease|vaccin|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Electricity: Magnetic and Heating Effects', desc: 'Magnetic effects of current, electromagnets, electric bell, chemical effects, electroplating, heating elements.', key: /magnetic\s*and\s*heating\s*effects|electromagnet|electroplating|chemical\s*effects?\s*of\s*electric|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Exploring Forces', desc: 'Contact and non-contact forces, friction, muscular force, gravitational force, electrostatic force, resultant forces.', key: /exploring\s*forces|force\s*and\s*pressure|friction|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Pressure, Winds, Storms, and Cyclones', desc: 'Atmospheric pressure, liquid pressure, high-speed winds and reduced air pressure, thunderstorm and cyclone safety.', key: /pressure,?\s*winds|storms|cyclones|atmospheric\s*pressure|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Particulate Nature of Matter', desc: 'States of matter, particle motion, kinetic energy, Brownian motion, intermolecular spaces and forces.', key: /particulate\s*nature|nature\s*of\s*matter|particle\s*model|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Nature of Matter: Elements, Compounds, and Mixtures', desc: 'Pure substances, chemical elements, chemical compounds, homogeneous and heterogeneous mixtures, separation techniques.', key: /elements,?\s*compounds|mixtures|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'The Amazing World of Solutes, Solvents, and Solutions', desc: 'Solutions, solubility, concentration of solutions, saturation, temperature effect, colloids and suspensions.', key: /solutes,?\s*solvents|solutions|solubility|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Light', desc: 'Laws of reflection, regular and diffused reflection, multiple images, kaleidoscope, structure of human eye, vision care.', key: /laws\s*of\s*reflection|human\s*eye|light\s*and\s*vision|light\b|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'The Sky and Astronomical Observations', desc: 'Celestial bodies, constellations, pole star, the solar system, planets, asteroids, comets, space missions.', key: /sky\s*and\s*astronomical|stars\s*and\s*the\s*solar\s*system|astronomy|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'How Nature Works in Harmony', desc: 'Ecosystems, food chains, food webs, ecological balance, conservation of plants, animals, and biodiversity.', key: /nature\s*works\s*in\s*harmony|ecosystem|conservation\s*of\s*plants|ch\s*12\b|chapter\s*12\b/i },
      { num: 13, title: 'Our Home: Earth, a Unique Life Sustaining Planet', desc: 'Biosphere, atmosphere, natural resources, water cycle, environmental challenges: pollution, climate change, sustainable living.', key: /our\s*home:?\s*earth|unique\s*life\s*sustaining|pollution\s*of\s*air|ch\s*13\b|chapter\s*13\b/i },
    ]
  },
  {
    name: 'Social Science',
    code: 'SST-8',
    bookName: 'Exploring Society: India and Beyond',
    icon: 'globe',
    color: '#D97706',
    description: 'Current NCERT 2026–27 multidisciplinary social science curriculum for Class 8.',
    chapters: [
      { num: 1, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Natural Resources and Their Use', desc: 'Classification of natural resources, renewable and non-renewable, distribution, conservation of resources.', key: /natural\s*resources|resources\s*and\s*development|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'Reshaping India’s Political Map', desc: 'Decline of Mughal empire, successor states: Bengal, Awadh, Hyderabad, regional power centers.', key: /reshaping\s*india|political\s*map|successor\s*states|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Rise of the Marathas', desc: 'Chhatrapati Shivaji Maharaj, administrative structure, Ashta Pradhan, Peshwa era, Maratha confederacy.', key: /rise\s*of\s*the\s*marathas|maratha|shivaji|peshwa|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Colonial Era in India', desc: 'East India Company trade, Battle of Plassey, Buxar, dual government, revenue settlements: Permanent, Ryotwari, Mahalwari.', key: /colonial\s*era|trade\s*to\s*territory|plassey|permanent\s*settlement|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Universal Franchise and India’s Electoral System', desc: 'Universal adult suffrage, Election Commission of India, electoral process, voter rights, EVM voting.', key: /universal\s*franchise|electoral\s*system|elections?|voting|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'The Parliamentary System: Legislature and Executive', desc: 'Lok Sabha, Rajya Sabha, President, Prime Minister, Council of Ministers, law-making process in Parliament.', key: /parliamentary\s*system|legislature|executive|parliament|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'Factors of Production', desc: 'Land, labour, physical capital, human capital; organisation of production, rural and urban economic inputs.', key: /factors\s*of\s*production|production|land,?\s*labour|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, theme: 'THEME A — INDIA & THE WORLD: LAND & PEOPLE', title: 'World Geography: Some Glimpses', desc: 'Global landforms, ocean currents, world climatic zones, international trade routes, human habitats.', key: /world\s*geography|ocean\s*currents|climatic\s*zones|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'India’s Long Road to Independence', desc: '1857 revolt, social and religious reform movements, Indian National Congress, Mahatma Gandhi, Quit India Movement.', key: /long\s*road\s*to\s*independence|national\s*movement|1857|freedom\s*struggle|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, theme: 'THEME C — OUR CULTURAL HERITAGE & TRADITIONS', title: 'A Journey Through Indian Architecture', desc: 'Temple architecture: Nagara, Dravida, Vesara; rock-cut caves, Buddhist stupas, Indo-Islamic monuments.', key: /indian\s*architecture|temple\s*architecture|stupas?|monuments|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'The Role of the Judiciary in Our Society', desc: 'Supreme Court, High Courts, Subordinate Courts, independence of judiciary, Public Interest Litigation (PIL).', key: /role\s*of\s*the\s*judiciary|judiciary|courts?|pil\b|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Citizenship: Rights and Duties', desc: 'Fundamental Rights, Fundamental Duties, Directive Principles of State Policy, active civic participation.', key: /citizenship:?\s*rights|fundamental\s*rights|duties|ch\s*12\b|chapter\s*12\b/i },
      { num: 13, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'Dynamics of Population', desc: 'Population distribution, density, population growth factors: birth rate, death rate, migration, human capital.', key: /dynamics\s*of\s*population|human\s*resources|population\s*pyramid|ch\s*13\b|chapter\s*13\b/i },
      { num: 14, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'India’s Urban Landscape', desc: 'Urbanisation trends, smart cities, municipal governance, urban informal economy, sustainable urban planning.', key: /urban\s*landscape|urbanisation|smart\s*cities|ch\s*14\b|chapter\s*14\b/i },
      { num: 15, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'Cultural Currents: 13th to 17th Centuries', desc: 'Bhakti and Sufi movements, regional literature, devotional poetry: Kabir, Guru Nanak, Mirabai, cultural synthesis.', key: /cultural\s*currents|bhakti|sufi|ch\s*15\b|chapter\s*15\b/i },
    ]
  },
  {
    name: 'English',
    code: 'ENG-8',
    bookName: 'Poorvi',
    icon: 'book-open',
    color: '#8B5CF6',
    description: 'Current NCERT 2026–27 English language and literature curriculum for Class 8 (Poorvi).',
    chapters: [
      { num: 1, title: 'Unit 1: Wit and Wisdom', desc: 'Timeless wit, quick problem-solving, and discernment: The Wit That Won Hearts, A Concrete Example, Wisdom Paves The Way.', key: /wit\s*and\s*wisdom|wit\s*that\s*won\s*hearts|concrete\s*example|wisdom\s*paves|unit\s*1\b|book\s*overview/i },
      { num: 2, title: 'Unit 2: Values and Dispositions', desc: 'Courage, selflessness, and inspiring national visionaries: Major Somnath Sharma, Somebody’s Mother, Verghese Kurien.', key: /values\s*and\s*dispositions|somnath\s*sharma|somebody'?s\s*mother|verghese\s*kurien|unit\s*2\b/i },
      { num: 3, title: 'Unit 3: Mystery and Magic', desc: 'Detective deduction, vivid imagination, and natural marvels: The Case of the Fifth Word, The Magic Brush of Dreams, Spectacular Wonders.', key: /mystery\s*and\s*magic|fifth\s*word|magic\s*brush|spectacular\s*wonders|unit\s*3\b/i },
      { num: 4, title: 'Unit 4: Environment', desc: 'Ecological consciousness, agrarian rhythm, and seasonal joy: The Cherry Tree, Harvest Hymn, Waiting For The Rain.', key: /environment|cherry\s*tree|harvest\s*hymn|waiting\s*for\s*the\s*rain|unit\s*4\b/i },
      { num: 5, title: 'Unit 5: Science and Curiosity', desc: 'Scientific inquiry, cosmic mysteries, and pioneering women scientists: Feathered Friend, Magnifying Glass, Bibha Chowdhuri.', key: /science\s*and\s*curiosity|feathered\s*friend|magnifying\s*glass|bibha\s*chowdhuri|unit\s*5\b/i },
    ]
  },
  {
    name: 'Hindi',
    code: 'HIN-8',
    bookName: 'Malhar',
    icon: 'languages',
    color: '#EF4444',
    description: 'Current NCERT 2026–27 Hindi core curriculum for Class 8 (Malhar).',
    chapters: [
      { num: 1, title: 'स्वदेश', desc: 'गयाप्रसाद शुक्ल \'सनेही\' की ओजस्वी राष्ट्रभक्ति कविता जो मातृभूमि के प्रति समर्पण सिखाती है।', key: /स्वदेश|swadesh|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'दो गौरैया', desc: 'भीष्म साहनी की संवेदनशील कहानी जो मनुष्य और वन्य जीवों के आत्मीय संबंधों को दर्शाती है।', key: /दो\s*गौरैया|do\s*gauraiya|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'एक आशीर्वाद', desc: 'दुष्यंत कुमार की प्रेरणादायी कविता जो कर्मण्यता, आत्मनिर्भरता और संघर्षशीलता की प्रेरणा देती है।', key: /एक\s*आशीर्वाद|ek\s*aashirwad|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'हरिद्वार', desc: 'भारतेंदु हरिश्चंद्र का रोचक और सांस्कृतिक यात्रा-वृत्तांत जो ऐतिहासिक धरोहर का सजीव चित्रण करता है।', key: /हरिद्वार|haridwar|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'कबीर के दोहे', desc: 'संत कबीरदास के जीवन-मूल्यों, आडंबर-विरोध और गुरु-महिमा से ओत-प्रोत नीतिपरक दोहे।', key: /कबीर\s*के\s*दोहे|kabir\s*ke\s*dohe|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'एक टोकरी भर मिट्टी', desc: 'माधवराव सप्रे की हिंदी की प्रथम मौलिक कहानी: अहंकार पर मानवीय संवेदना और न्याय की विजय।', key: /टोकरी\s*भर\s*मिट्टी|tokri\s*bhar\s*mitti|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'मत बाँधो', desc: 'महादेवी वर्मा की मर्मस्पर्शी कविता जो प्रकृति, जीवों की स्वतंत्रता और अनुराग की वकालत करती है।', key: /मत\s*बाँधो|mat\s*bandho|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'नए मेहमान', desc: 'उदयशंकर भट्ट का सुप्रसिद्ध एकांकी: मध्यमवर्गीय गृहस्थी की विवशता, आतिथ्य और संवेदना।', key: /नए\s*मेहमान|naye\s*mehman|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'आदमी का अनुपात', desc: 'मानवीय मूल्यों, चरित्र की महत्ता और आत्म-मूल्यांकन पर आधारित विचारोत्तेजक आधुनिक कविता।', key: /आदमी\s*का\s*अनुपात|aadmi\s*ka\s*anupat|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'तरुण के स्वप्न', desc: 'सुभाष चंद्र बोस के तरुणों के नाम उद्बोधन: राष्ट्रीय चेतना, संगठन शक्ति और बलिदान की पुकार।', key: /तरुण\s*के\s*स्वप्न|tarun\s*ke\s*swapna|पाठ\s*10\b|ch\s*10\b/i },
    ]
  },
  {
    name: 'Sanskrit',
    code: 'SKT-8',
    bookName: 'Deepakam',
    icon: 'scroll',
    color: '#B45309',
    description: 'Current NCERT 2026–27 Sanskrit curriculum for Class 8 (Deepakam).',
    chapters: [
      { num: 1, title: 'संगच्छध्वं संवदध्वम्', desc: 'ऋग्वेदस्य शान्तिमन्त्रः, ऐक्यभावः, सामूहिक-सहयोगस्य मङ्गलकामना।', key: /संगच्छध्वं|samgacchadhvam|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका', desc: 'हितोपदेशस्य कथा, सङ्घटनशक्तेः महत्वं, कपोतराजस्य कथा।', key: /अल्पानामपि|samhati|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'सुभाषितरसं पीत्वा जीवनं सफलं कुरु', desc: 'नीतिश्लोकाः, परोपकारः, विद्यार्जनम्, सत्सङ्गतिः, समयपालनम्।', key: /सुभाषितरसं|subhashita|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'प्रणम्यो देशभक्तोऽयं गोपबन्धुर्महामनाः', desc: 'उत्कलमणि-पण्डित-गोपबन्धु-दासस्य देशसेवा, त्यागः, समाजकल्याणम्।', key: /गोपबन्धु|gopabandhu|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'गीता सुगीता कर्तव्या', desc: 'श्रीमद्भगवद्गीतायाः सारः, निष्कामकर्मयोगः, स्थितप्रज्ञस्य लक्षणम्।', key: /गीता\s*सुगीता|gita|karmayoga|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'डिजिभारतम् (युगपरिवर्तनम्)', desc: 'डिजिटल-इण्डिया, वैज्ञानिकप्रौद्योगिकी, अन्तर्जालस्य सदुपयोगः।', key: /डिजिभारतम्|digibharat|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'मञ्जुलमञ्जूषा सुन्दरसुरभाषा', desc: 'संस्कृतभाषायाः वैशिष्ट्यम्, वैज्ञानिकता, समृद्धवाङ्मयस्य परिचयः।', key: /मञ्जुलमञ्जूषा|sanskrit\s*language|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'पश्यत कोणमैशान्यं भारतस्य मनोहरम्', desc: 'ईशान्य-भारतस्य (पूर्वोत्तरराज्यानाम्) प्राकृतिकं सांस्कृतिकं च सौन्दर्यम्।', key: /कोणमैशान्यं|northeast|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'कोऽरुक्? कोऽरुक्? कोऽरुक्?', desc: 'आयुर्वेदज्ञानम्, वाग्भटस्य स्वास्थ्यसूत्राणि: हितभुक् मितभुक् ऋतभुक्।', key: /कोऽरुक्|koruk|ayurveda|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'सन्निमित्ते वरं त्यागः', desc: 'दधीचिश्रेष्ठस्य अपूर्वास्थिदानकथा, परार्थे जीवनार्पणम्।', key: /सन्निमित्ते\s*वरं\s*त्यागः|dadhichi|पाठ\s*10\b|ch\s*10\b/i },
    ]
  }
];

// CLASS 9 SUBJECTS & CHAPTERS (CBSE 2026-27 Rationalized)
const class9CurriculumDef = [
  {
    name: 'Mathematics',
    code: 'MATH-9',
    bookName: 'NCERT Mathematics',
    icon: 'calculator',
    color: '#2E7D4E',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 Mathematics.',
    chapters: [
      { num: 1, title: 'Number Systems', desc: 'Real numbers, representation of irrational numbers on number line, real numbers and decimal expansions, rationalising denominator, laws of exponents.', key: /number\s*systems?|irrational\s*numbers?|rationalis|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'Polynomials', desc: 'Polynomials in one variable, zeroes of polynomial, factor theorem, algebraic identities, and factorisation.', key: /polynomials?|factor\s*theorem|algebraic\s*identities|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Coordinate Geometry', desc: 'Cartesian system, coordinate axes, quadrants, coordinates of a point, plotting points on Cartesian plane.', key: /coordinate\s*geometry|cartesian|quadrants?|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Linear Equations in Two Variables', desc: 'Linear equations in two variables, standard form ax + by + c = 0, solutions, graphical representation.', key: /linear\s*equations?\s*in\s*two\s*variables|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Introduction to Euclid’s Geometry', desc: 'Euclid’s definitions, axioms and postulates, five postulates, equivalent versions of fifth postulate.', key: /euclid'?s?\s*geometry|axioms|postulates|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Lines and Angles', desc: 'Basic terms and definitions, intersecting lines, linear pair axiom, vertically opposite angles, parallel lines and transversals, angle sum property of triangle.', key: /lines\s*and\s*angles|transversal|linear\s*pair|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Triangles', desc: 'Congruence of triangles, SAS, ASA, AAS, SSS, RHS congruence rules, properties of isosceles triangles, inequalities in a triangle.', key: /triangles?|congruence\s*of\s*triangles|isosceles|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Quadrilaterals', desc: 'Angle sum property of a quadrilateral, properties of a parallelogram, mid-point theorem and its converse.', key: /quadrilaterals?|mid[- ]point\s*theorem|parallelogram\s*properties|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'Circles', desc: 'Equal chords and distances from center, angle subtended by chord at center, cyclic quadrilaterals, angle in semi-circle.', key: /circles?|cyclic\s*quadrilateral|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Heron’s Formula', desc: 'Area of triangle by Heron’s formula and applications in finding areas of quadrilaterals.', key: /heron'?s?\s*formula|semi[- ]perimeter|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'Surface Areas and Volumes', desc: 'Surface areas and volumes of right circular cones and spheres, hemispheres, practical problem solving.', key: /surface\s*areas?\s*and\s*volumes?|cones?|spheres?|hemispheres?|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'Statistics', desc: 'Collection and presentation of data, bar graphs, histograms (with varying base lengths), frequency polygons.', key: /statistics|histograms?|frequency\s*polygons?|ch\s*12\b|chapter\s*12\b/i },
    ]
  },
  {
    name: 'Science',
    code: 'SCI-9',
    bookName: 'NCERT Science',
    icon: 'atom',
    color: '#3B82F6',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 Science (Physics, Chemistry, Biology).',
    chapters: [
      { num: 1, title: 'Matter in Our Surroundings', desc: 'Physical nature of matter, characteristics of particles, states of matter, change of state: melting, boiling, evaporation, latent heat.', key: /matter\s*in\s*our\s*surroundings|states\s*of\s*matter|evaporation|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'Is Matter Around Us Pure?', desc: 'Mixtures, solutions, suspensions, colloids, concentration of solution, physical and chemical changes, elements and compounds.', key: /matter\s*around\s*us\s*pure|mixtures|colloids|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Atoms and Molecules', desc: 'Law of chemical combination, Dalton’s atomic theory, atomic mass, chemical formula, molecular mass, mole concept overview.', key: /atoms\s*and\s*molecules|chemical\s*formula|molecular\s*mass|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Structure of the Atom', desc: 'Charged particles in matter, Thomson’s model, Rutherford’s model, Bohr’s model, electrons distribution, valency, atomic number, mass number, isotopes, isobars.', key: /structure\s*of\s*the\s*atom|bohr|rutherford|valency|isotopes|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'The Fundamental Unit of Life', desc: 'Cell as fundamental unit of life, plasma membrane, cell wall, nucleus, cytoplasm, organelles: ER, Golgi, lysosomes, mitochondria, plastids, vacuoles.', key: /fundamental\s*unit\s*of\s*life|cell\s*structure|mitochondria|nucleus|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Tissues', desc: 'Plant tissues: meristematic, permanent (simple, complex); Animal tissues: epithelial, connective, muscular, nervous tissue.', key: /tissues?|meristematic|xylem|phloem|connective\s*tissue|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Motion', desc: 'Describing motion, distance and displacement, uniform and non-uniform motion, velocity, acceleration, equations of motion by graphical method, circular motion.', key: /motion\b|equations\s*of\s*motion|velocity|acceleration|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Force and Laws of Motion', desc: 'Balanced and unbalanced forces, Newton’s first, second, and third laws of motion, inertia and mass, momentum, conservation of momentum.', key: /force\s*and\s*laws\s*of\s*motion|newton'?s?\s*laws|inertia|momentum|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'Gravitation', desc: 'Universal law of gravitation, free fall, acceleration due to gravity (g), mass vs weight, thrust and pressure, Archimedes’ principle, relative density.', key: /gravitation|free\s*fall|archimedes|universal\s*law\s*of\s*gravitation|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Work and Energy', desc: 'Scientific conception of work, kinetic energy, potential energy, law of conservation of energy, rate of doing work (power), commercial unit of energy.', key: /work\s*and\s*energy|kinetic\s*energy|potential\s*energy|conservation\s*of\s*energy|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'Sound', desc: 'Production and propagation of sound, longitudinal waves, characteristics of sound wave, speed of sound, reflection of sound, echo, ultrasound, human ear structure.', key: /sound\b|propagation\s*of\s*sound|echo|ultrasound|human\s*ear|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'Improvement in Food Resources', desc: 'Crop yield improvement, crop variety improvement, crop production management, nutrient management (manure, fertilisers), irrigation, cropping patterns, animal husbandry.', key: /improvement\s*in\s*food\s*resources|animal\s*husbandry|crop\s*production|ch\s*12\b|chapter\s*12\b/i },
    ]
  },
  {
    name: 'Social Science',
    code: 'SST-9',
    bookName: 'NCERT Social Science',
    icon: 'globe',
    color: '#D97706',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 Social Science.',
    chapters: [
      { num: 1, theme: 'History — India and the Contemporary World I', title: 'The French Revolution', desc: 'French society during late 18th century, outbreak of revolution, constitutional monarchy, Jacobins, Reign of Terror, abolition of slavery.', key: /french\s*revolution|bastille|robespierre|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, theme: 'History — India and the Contemporary World I', title: 'Socialism in Europe and the Russian Revolution', desc: 'Liberals, radicals, conservatives; industrial society, Russian revolution 1917, February and October revolutions, Stalinism and collectivisation.', key: /russian\s*revolution|socialism\s*in\s*europe|bolshevik|lenin|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, theme: 'History — India and the Contemporary World I', title: 'Nazism and the Rise of Hitler', desc: 'Birth of Weimar Republic, Hitler’s rise to power, Nazi worldview, youth in Nazi Germany, Holocaust.', key: /nazism|rise\s*of\s*hitler|weimar\s*republic|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, theme: 'Geography — Contemporary India I', title: 'India – Size and Location', desc: 'Location, latitudinal and longitudinal extent, size, standard meridian, India and the world, neighboring nations.', key: /size\s*and\s*location|standard\s*meridian|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, theme: 'Geography — Contemporary India I', title: 'Physical Features of India', desc: 'Plate tectonics, Himalayan mountains, Northern plains, Peninsular plateau, Indian desert, Coastal plains, Islands.', key: /physical\s*features\s*of\s*india|himalayas|peninsular\s*plateau|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, theme: 'Geography — Contemporary India I', title: 'Drainage', desc: 'Himalayan rivers (Indus, Ganga, Brahmaputra), Peninsular rivers (Narmada, Tapi, Godavari, Krishna), lakes, economic role of rivers.', key: /drainage|ganga|indus|brahmaputra|river\s*systems?|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, theme: 'Geography — Contemporary India I', title: 'Climate', desc: 'Climatic controls, factors affecting India’s climate, Indian monsoon, advancing and retreating monsoon, distribution of rainfall.', key: /climate\b|monsoon\s*mechanism|retreating\s*monsoon|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, theme: 'Geography — Contemporary India I', title: 'Natural Vegetation and Wildlife', desc: 'Types of vegetation: tropical evergreen, deciduous, thorn, montane, mangrove forests; wildlife sanctuaries and conservation.', key: /natural\s*vegetation|wildlife|forest\s*types|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, theme: 'Geography — Contemporary India I', title: 'Population', desc: 'Population size, distribution, population growth and processes of population change, age composition, sex ratio, literacy rates.', key: /population\b|population\s*growth|literacy\s*rate|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, theme: 'Political Science — Democratic Politics I', title: 'What is Democracy? Why Democracy?', desc: 'Definition of democracy, features of democracy, arguments for and against democracy, broader meanings of democracy.', key: /what\s*is\s*democracy|why\s*democracy|features\s*of\s*democracy|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, theme: 'Political Science — Democratic Politics I', title: 'Constitutional Design', desc: 'Democratic constitution in South Africa, why do we need a constitution, making of the Indian Constitution, guiding values of Constitution.', key: /constitutional\s*design|south\s*africa|making\s*of\s*indian\s*constitution|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, theme: 'Political Science — Democratic Politics I', title: 'Electoral Politics', desc: 'Why elections, system of elections in India, election campaigns, polling and counting of votes, free and fair elections.', key: /electoral\s*politics|election\s*campaigns?|election\s*commission|ch\s*12\b|chapter\s*12\b/i },
      { num: 13, theme: 'Political Science — Democratic Politics I', title: 'Working of Institutions', desc: 'How is a major policy decision taken, Parliament (Lok Sabha & Rajya Sabha), Political executive, Prime Minister, Cabinet, Judiciary.', key: /working\s*of\s*institutions|parliament|prime\s*minister|cabinet|judiciary|ch\s*13\b|chapter\s*13\b/i },
      { num: 14, theme: 'Political Science — Democratic Politics I', title: 'Democratic Rights', desc: 'Life without rights, rights in a democracy, fundamental rights in Indian Constitution, expanding scope of rights.', key: /democratic\s*rights|fundamental\s*rights|right\s*to\s*equality|ch\s*14\b|chapter\s*14\b/i },
      { num: 15, theme: 'Economics', title: 'The Story of Village Palampur', desc: 'Overview of production, farming in Palampur, land fixed, multiple cropping, modern farming methods, non-farm activities.', key: /village\s*palampur|palampur|farming\s*methods|ch\s*15\b|chapter\s*15\b/i },
      { num: 16, theme: 'Economics', title: 'People as Resource', desc: 'Overview of human capital, economic activities by men and women, quality of population: education, health; unemployment types.', key: /people\s*as\s*resource|human\s*capital|unemployment|ch\s*16\b|chapter\s*16\b/i },
      { num: 17, theme: 'Economics', title: 'Poverty as a Challenge', desc: 'Dimensions of poverty, poverty line estimation, poverty trends in India, vulnerable groups, interstate disparities, anti-poverty measures.', key: /poverty\s*as\s*a\s*challenge|poverty\s*line|anti[- ]poverty|ch\s*17\b|chapter\s*17\b/i },
      { num: 18, theme: 'Economics', title: 'Food Security in India', desc: 'Food security dimensions, famine, green revolution, buffer stock, Public Distribution System (PDS), cooperatives role in food security.', key: /food\s*security\s*in\s*india|pds|buffer\s*stock|green\s*revolution|ch\s*18\b|chapter\s*18\b/i },
    ]
  },
  {
    name: 'English',
    code: 'ENG-9',
    bookName: 'Beehive & Moments',
    icon: 'book-open',
    color: '#8B5CF6',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 English Language and Literature.',
    chapters: [
      { num: 1, title: 'The Fun They Had / The Road Not Taken', desc: 'Isaac Asimov’s futuristic school narrative; Robert Frost’s poem on choices and life pathways.', key: /the\s*fun\s*they\s*had|road\s*not\s*taken|isaac\s*asimov|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'The Sound of Music / Wind', desc: 'Evelyn Glennie listening without hearing; Bismillah Khan shehnai mastery; Subramania Bharati’s Wind poem.', key: /sound\s*of\s*music|evelyn\s*glennie|bismillah\s*khan|wind\b|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'The Little Girl / Rain on the Roof', desc: 'Kezia and her father’s misunderstood relationship; Coates Kinney’s nostalgic rainy day memories.', key: /little\s*girl|kezia|rain\s*on\s*the\s*roof|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'A Truly Beautiful Mind / Lake Isle of Innisfree', desc: 'Albert Einstein’s life, scientific genius, and humanitarian advocacy; W.B. Yeats’s Innisfree poem.', key: /truly\s*beautiful\s*mind|einstein|lake\s*isle\s*of\s*innisfree|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'The Snake and the Mirror / Legend of Northland', desc: 'A doctor’s humorous encounter with a snake; Phoebe Cary’s ballad on self-righteous greed.', key: /snake\s*and\s*the\s*mirror|legend\s*of\s*the\s*northland|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'My Childhood / No Men Are Foreign', desc: 'A.P.J. Abdul Kalam’s childhood in Rameswaram; James Kirkup’s universal brotherhood poem.', key: /my\s*childhood|abdul\s*kalam|no\s*men\s*are\s*foreign|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Reach for the Top / On Killing a Tree', desc: 'Santosh Yadav and Maria Sharapova’s determination; Gieve Patel’s environmental resilience poem.', key: /reach\s*for\s*the\s*top|santosh\s*yadav|maria\s*sharapova|on\s*killing\s*a\s*tree|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Kathmandu / A Slumber Did My Spirit Seal', desc: 'Vikram Seth’s vivid travelogue of Pashupatinath and Baudhnath; William Wordsworth’s poem.', key: /kathmandu|vikram\s*seth|slumber\s*did\s*my\s*spirit|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'If I Were You', desc: 'Douglas James’s suspense play: Gerrard outwits an intruder through calm presence of mind.', key: /if\s*i\s*were\s*you|gerrard|intruder|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Moments: The Lost Child & Adventures of Toto', desc: 'Mulk Raj Anand’s festival tale of child longing; Ruskin Bond’s mischievous pet monkey narrative.', key: /lost\s*child|adventures\s*of\s*toto|toto|ch\s*10\b/i },
      { num: 11, title: 'Moments: Iswaran the Storyteller & Kingdom of Fools', desc: 'Mahendra and imaginative Iswaran; A.K. Ramanujan’s Kannada folk tale of wise guru and foolish disciple.', key: /iswaran|kingdom\s*of\s*fools|ch\s*11\b/i },
      { num: 12, title: 'Moments: The Happy Prince & The Last Leaf', desc: 'Oscar Wilde’s compassionate statue and swallow; O. Henry’s masterpiece of sacrifice and masterpiece leaf.', key: /happy\s*prince|the\s*last\s*leaf|behrman|ch\s*12\b/i },
      { num: 13, title: 'Moments: A House Is Not a Home & The Beggar', desc: 'Zan Gaudioso’s healing after tragedy; Anton Chekhov’s reform of Lushkoff through Olga’s kindness.', key: /house\s*is\s*not\s*a\s*home|the\s*beggar|lushkoff|ch\s*13\b/i },
    ]
  },
  {
    name: 'Hindi',
    code: 'HIN-9',
    bookName: 'Kshitij & Kritika (Course A)',
    icon: 'languages',
    color: '#EF4444',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 Hindi Course A.',
    chapters: [
      { num: 1, title: 'दो बैलों की कथा', desc: 'प्रेमचंद की प्रसिद्ध कहानी: झूरी के बैल हीरा और मोती की मित्रता, स्वाभिमान और स्वतंत्रता-संघर्ष।', key: /दो\s*बैलों\s*की\s*कथा|do\s*bailon\s*ki\s*katha|हीरा\s*और\s*मोती|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'ल्हासा की ओर', desc: 'राहुल सांकृत्यायन का तिब्बत यात्रा-वृत्तांत: दुर्गम पहाड़ी रास्तों, डांडों और बौद्ध संस्कृति का रोमांचक वर्णन।', key: /ल्हासा\s*की\s*ओर|lhasa\s*ki\s*aur|तिब्बत|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'उपभोक्तावाद की संस्कृति', desc: 'श्यामाचरण दुबे का निबंध: आधुनिक बाज़ारवाद, विज्ञापन की चकाचौंध और सामाजिक दिखावे की संस्कृति की तीखी समीक्षा।', key: /उपभोक्तावाद\s*की\s*संस्कृति|upbhoktavad|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'साँवले सपनों की याद', desc: 'जाबिर हुसैन द्वारा प्रसिद्ध पक्षी-विज्ञानी सालिम अली के व्यक्तित्व, पक्षी-प्रेम और प्रकृति-अनुराग पर संस्मरण।', key: /साँवले\s*सपनों\s*की\s*याद|salim\s*ali|सालिम\s*अली|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'प्रेमचंद के फटे जूते', desc: 'हरिशंकर परसाई का प्रसिद्ध व्यंग्य निबंध: प्रेमचंद की सादगी, ईमानदारी और समाज के खोखलेपन पर प्रहार।', key: /प्रेमचंद\s*के\s*फटे\s*जूते|premchand\s*ke\s*fate\s*joote|परसाई|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'मेरे बचपन के दिन', desc: 'महादेवी वर्मा का आत्मकथात्मक संस्मरण: बचपन की शिक्षा, छात्रावास की सहेलियाँ और सुभद्रा कुमारी चौहान का सान्निध्य।', key: /मेरे\s*बचपन\s*के\s*दिन|mere\s*bachpan\s*ke\s*din|महादेवी|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'साखियाँ एवं सबद', desc: 'संत कबीरदास की साखियाँ और सबद: ईश्वर की सर्वव्यापकता, पाखंड-विरोध, ज्ञान-महिमा और सच्चा प्रेम।', key: /साखियाँ|सबद|कबीर|sakhiyan|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'वाख', desc: 'कश्मीरी कवयित्री ललद्यद के वाख: सांसारिक बंधनों से मुक्ति, आत्मज्ञान और ईश्वर-प्राप्ति का सरल मार्ग।', key: /वाख|ललद्यद|vaakh|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'सवैये', desc: 'रसखान के सवैये: श्रीकृष्ण, गोकुल और ब्रजभूमि के प्रति अनन्य प्रेम, निष्ठा और समर्पण भाव।', key: /सवैये|रसखान|savaiye|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'कैदी और कोकिला', desc: 'माखनलाल चतुर्वेदी की कविता: स्वतंत्रता सेनानियों पर ब्रिटिश शासन के अत्याचार, जेल की यातना और कोयल से संवाद।', key: /कैदी\s*और\s*कोकिला|kaidi\s*aur\s*kokila|पाठ\s*10\b|ch\s*10\b/i },
      { num: 11, title: 'ग्राम श्री', desc: 'सुमित्रानंदन पंत की प्राकृतिक कविता: खेतों में लहलहाती हरी-भरी फसलें, फल-फूल और भारतीय ग्रामीण छटा।', key: /ग्राम\s*श्री|gram\s*shree|पंत|पाठ\s*11\b|ch\s*11\b/i },
      { num: 12, title: 'मेघ आए', desc: 'सर्वेश्वर दयाल सक्सेना की कविता: गाँव में बादलों का दामाद (पाहुन) की तरह बन-ठन कर आगमन और प्राकृतिक उल्लास।', key: /मेघ\s*आए|megh\s*aaye|पाठ\s*12\b|ch\s*12\b/i },
      { num: 13, title: 'बच्चे काम पर जा रहे हैं', desc: 'राजेश जोशी की मार्मिक सामाजिक कविता: बाल-मजदूरी, बच्चों के छिनते बचपन और समाज की संवेदनहीनता पर सवाल।', key: /बच्चे\s*काम\s*पर\s*जा\s*रहे\s*हैं|bacche\s*kaam\s*par|पाठ\s*13\b|ch\s*13\b/i },
    ]
  },
  {
    name: 'Sanskrit',
    code: 'SKT-9',
    bookName: 'Shemushi (शेमुषी प्रथमो भागः)',
    icon: 'scroll',
    color: '#B45309',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 Sanskrit.',
    chapters: [
      { num: 1, title: 'भारतीवसन्तगीतिः', desc: 'पण्डित-जानकीवल्लभ-शास्त्रिणः काकली-गीतसङ्ग्रहात् सरस्वती-वन्दना, वसन्त-ऋतोः सौन्दर्यम्।', key: /भारतीवसन्तगीतिः|bharati\s*vasanta|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'स्वर्णकाकः', desc: 'श्रीपद्मशास्त्रिणः विश्वकथाशतकम् ग्रन्थात् बर्मादेशस्य लोककथा: लोभस्य दुष्परिणामः, त्यागस्य शुभफलम्।', key: /स्वर्णकाकः|swarnakakah|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'गोदोहनम्', desc: 'चतुर्व्यूहम् नाटकात सङ्गृहीतः: अद्यतनं कार्यम् अद्यैव करणीयम्, कालस्य सदुपयोगः।', key: /गोदोहनम्|godohanam|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'कल्पतरुः', desc: 'वेतालपञ्चविंशतिः ग्रन्थात् जीमूतवाहनस्य कथा: परोपकाराय जीवनसमर्पणम्, कल्पवृक्षस्य वरदानम्।', key: /कल्पतरुः|kalpataruh|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'सूक्तिमौक्तिकम्', desc: 'विविध-सुभाषितग्रन्थेभ्यः सङ्गृहीतानि नीतिपद्यानि: सदाचारः, गुणार्जनम्, मधुरभाषिणः।', key: /सूक्तिमौक्तिकम्|suktimauktikam|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'भ्रान्तो बालः', desc: 'संस्कृतप्रौढकथासङ्ग्रहात्: कर्तव्यपालने आलस्यत्यागः, समयानुसारं विद्याध्ययनम्।', key: /भ्रान्तो\s*बालः|bhranto\s*balah|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'प्रत्यभिज्ञानम्', desc: 'महाकवि-भासस्य पञ्चरात्रम् नाटकात: अज्ञातवासे पाण्डवानां पराक्रमः, अभिमन्योः प्रत्यभिज्ञानम्।', key: /प्रत्यभिज्ञानम्|pratyabhijnanam|भास|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'सिकतासेतुः', desc: 'सोमदेवस्य कथासरित्सागरात्: तपस्यायाः अपेक्षया विद्यार्जनं गुरुमुखेन श्रमेण च सम्भवति।', key: /सिकतासेतुः|sikatasetuh|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'जटायोः शौर्यम्', desc: 'वाल्मीकि-रामायणस्य अरण्यकाण्डात्: धर्मरक्षार्थं वृद्धजटायोः रावणविरोधः, वीरता, आत्मबलिदानम्।', key: /जटायोः\s*शौर्यम्|jatayoh\s*shauryam|रामायण|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'पर्यावरणम्', desc: 'प्रकृतिसंरक्षणम्, शुद्धवायु-जल-मृत्तिकानां महत्वं, वृक्षारोपणम्, पर्यावरणसन्तुलनम्।', key: /पर्यावरणम्|paryavaranam|पाठ\s*10\b|ch\s*10\b/i },
    ]
  }
];

// CLASS 10 SUBJECTS & CHAPTERS (CBSE 2026-27 Board Curriculum)
const class10CurriculumDef = [
  {
    name: 'Mathematics',
    code: 'MATH-10',
    bookName: 'NCERT Mathematics (Standard & Basic)',
    icon: 'calculator',
    color: '#2E7D4E',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 10 Mathematics (Standard & Basic).',
    chapters: [
      { num: 1, title: 'Real Numbers', desc: 'Fundamental Theorem of Arithmetic, prime factorisation, revisiting irrational numbers: proofs of √2, √3, √5 irrationality.', key: /real\s*numbers?|fundamental\s*theorem\s*of\s*arithmetic|irrationality|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'Polynomials', desc: 'Geometrical meaning of zeroes, relationship between zeroes and coefficients of quadratic polynomials.', key: /polynomials?|zeroes\s*of\s*polynomial|quadratic\s*polynomials?|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Pair of Linear Equations in Two Variables', desc: 'Graphical method of solution, consistency/inconsistency, algebraic methods: substitution method, elimination method, practical word problems.', key: /pair\s*of\s*linear\s*equations|linear\s*equations?\s*in\s*two|substitution|elimination|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Quadratic Equations', desc: 'Standard form ax² + bx + c = 0, solutions by factorisation and quadratic formula, nature of roots: discriminant b² - 4ac.', key: /quadratic\s*equations?|quadratic\s*formula|discriminant|nature\s*of\s*roots|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Arithmetic Progressions', desc: 'General term (nth term) of an AP, sum of first n terms of an AP, daily life applications of AP series.', key: /arithmetic\s*progressions?|ap\b|general\s*term\s*of\s*ap|sum\s*of\s*n\s*terms|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Triangles', desc: 'Similarity of triangles, Basic Proportionality Theorem (Thales Theorem) and converse, AAA, SAS, SSS similarity criteria.', key: /triangles?|similar\s*triangles?|thales\s*theorem|basic\s*proportionality|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Coordinate Geometry', desc: 'Distance formula between two points, section formula (internal division), mid-point formula.', key: /coordinate\s*geometry|distance\s*formula|section\s*formula|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Introduction to Trigonometry', desc: 'Trigonometric ratios of acute angles, values of ratios for 0°, 30°, 45°, 60°, 90°, trigonometric identities: sin²θ + cos²θ = 1.', key: /introduction\s*to\s*trigonometry|trigonometric\s*ratios|trigonometry\b|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'Some Applications of Trigonometry', desc: 'Heights and distances, line of sight, angle of elevation, angle of depression, practical navigation and tower problems.', key: /applications?\s*of\s*trigonometry|heights?\s*and\s*distances?|angle\s*of\s*elevation|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Circles', desc: 'Tangent to a circle, point of contact, theorem: tangent is perpendicular to radius, theorem: tangents drawn from external point are equal.', key: /circles?|tangents?\s*to\s*a\s*circle|point\s*of\s*contact|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'Areas Related to Circles', desc: 'Perimeter and area of circle, area of sector and segment of circle, angles 60°, 90°, 120°.', key: /areas?\s*related\s*to\s*circles|sector|segment\s*of\s*circle|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'Surface Areas and Volumes', desc: 'Surface areas and volumes of combinations of solids: cubes, cuboids, spheres, hemispheres, right circular cylinders and cones.', key: /surface\s*areas?\s*and\s*volumes?|combinations?\s*of\s*solids|ch\s*12\b|chapter\s*12\b/i },
      { num: 13, title: 'Statistics', desc: 'Mean, median, and mode of grouped data; mean by direct method and assumed mean method; modal class and median class.', key: /statistics|mean,?\s*median,?\s*mode|grouped\s*data|assumed\s*mean|ch\s*13\b|chapter\s*13\b/i },
      { num: 14, title: 'Probability', desc: 'Classical definition of probability, equally likely events, simple problems on finding probability of events, complementary events.', key: /probability|equally\s*likely|ch\s*14\b|chapter\s*14\b/i },
    ]
  },
  {
    name: 'Science',
    code: 'SCI-10',
    bookName: 'NCERT Science',
    icon: 'atom',
    color: '#3B82F6',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 10 Science (Physics, Chemistry, Biology).',
    chapters: [
      { num: 1, title: 'Chemical Reactions and Equations', desc: 'Chemical equations, balancing chemical equations, types of reactions: combination, decomposition, displacement, double displacement, precipitation, redox; rancidity, corrosion.', key: /chemical\s*reactions?\s*and\s*equations|balancing\s*chemical|redox|corrosion|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'Acids, Bases and Salts', desc: 'Chemical properties of acids and bases, pH scale, significance in everyday life, salts: sodium hydroxide, bleaching powder, baking soda, washing soda, plaster of paris.', key: /acids?,?\s*bases?\s*and\s*salts|ph\s*scale|plaster\s*of\s*paris|baking\s*soda|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Metals and Non-metals', desc: 'Physical and chemical properties of metals, reactivity series, ionic compounds properties, extraction of metals, corrosion prevention.', key: /metals\s*and\s*non[- ]metals|reactivity\s*series|extraction\s*of\s*metals|ionic\s*compounds|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'Carbon and its Compounds', desc: 'Covalent bonding, versatile nature of carbon, homologous series, functional groups, combustion, oxidation, addition and substitution reactions, ethanol and ethanoic acid, soaps and detergents.', key: /carbon\s*and\s*its\s*compounds|covalent\s*bonding|homologous\s*series|soaps\s*and\s*detergents|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Life Processes', desc: 'Nutrition: autotrophic and heterotrophic; Respiration: aerobic and anaerobic; Transportation: human heart, blood vessels, lymph, xylem and phloem; Excretion: nephron, urine formation.', key: /life\s*processes|human\s*heart|nephron|autotrophic|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Control and Coordination', desc: 'Nervous system, neurons, reflex arc, human brain structure, plant hormones (auxin, gibberellin, cytokinin, abscisic acid), animal endocrine hormones: thyroid, pancreas, adrenal.', key: /control\s*and\s*coordination|neurons?|reflex\s*arc|human\s*brain|plant\s*hormones|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'How do Organisms Reproduce?', desc: 'Asexual reproduction: fission, fragmentation, regeneration, budding, spore formation; Sexual reproduction in flowering plants; Human male and female reproductive systems, contraception.', key: /how\s*do\s*organisms\s*reproduce|asexual\s*reproduction|sexual\s*reproduction|reproductive\s*system|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'Heredity and Evolution', desc: 'Mendel’s contributions, laws of inheritance: monohybrid and dihybrid cross, sex determination in humans.', key: /heredity|mendel|monohybrid|sex\s*determination|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'Light – Reflection and Refraction', desc: 'Spherical mirrors, mirror formula, magnification, refraction of light, laws of refraction, refractive index, spherical lenses, lens formula, power of a lens.', key: /light\s*[-–—]\s*reflection|refraction|spherical\s*mirrors?|lenses|lens\s*formula|mirror\s*formula|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'The Human Eye and Colourful World', desc: 'Structure of human eye, power of accommodation, defects of vision: myopia, hypermetropia, presbyopia; refraction through prism, dispersion, atmospheric refraction, scattering of light, Tyndall effect.', key: /human\s*eye|colourful\s*world|myopia|hypermetropia|dispersion|atmospheric\s*refraction|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, title: 'Electricity', desc: 'Electric current and circuit, potential difference, Ohm’s law, resistance, factors affecting resistance, resistivity, resistors in series and parallel, heating effect of electric current, electric power.', key: /electricity\b|ohm'?s?\s*law|resistivity|resistors\s*in\s*series|joule'?s?\s*law|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, title: 'Magnetic Effects of Electric Current', desc: 'Magnetic field and field lines, field due to current-carrying conductor, right-hand thumb rule, solenoid, force on current-carrying conductor, Fleming’s left-hand rule, domestic electric circuits.', key: /magnetic\s*effects?\s*of\s*electric|solenoid|fleming'?s?\s*left|domestic\s*electric\s*circuits|ch\s*12\b|chapter\s*12\b/i },
      { num: 13, title: 'Our Environment', desc: 'Ecosystem components, producers, consumers, decomposers, food chain and food webs, trophic levels, 10% energy law, ozone layer depletion, waste management, biodegradable waste.', key: /our\s*environment|ecosystem|trophic\s*levels|ozone\s*layer|food\s*chain|ch\s*13\b|chapter\s*13\b/i },
    ]
  },
  {
    name: 'Social Science',
    code: 'SST-10',
    bookName: 'NCERT Social Science',
    icon: 'globe',
    color: '#D97706',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 10 Social Science.',
    chapters: [
      { num: 1, theme: 'History — India and the Contemporary World II', title: 'The Rise of Nationalism in Europe', desc: 'French Revolution and idea of nation, making of nationalism in Europe, age of revolutions 1830–1848, unification of Germany and Italy, visualising the nation, nationalism and imperialism.', key: /rise\s*of\s*nationalism\s*in\s*europe|nationalism\s*in\s*europe|mazzini|garibaldi|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, theme: 'History — India and the Contemporary World II', title: 'Nationalism in India', desc: 'First World War, Khilafat and Non-Cooperation, differing strands within movement, Civil Disobedience Movement, Salt March, sense of collective belonging.', key: /nationalism\s*in\s*india|non[- ]cooperation|civil\s*disobedience|salt\s*march|rowlatt|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, theme: 'History — India and the Contemporary World II', title: 'The Making of a Global World', desc: 'Pre-modern world, Silk routes, conquest, disease and trade, 19th century global economy, indentured labour, Great Depression, post-war settlement: Bretton Woods.', key: /making\s*of\s*a\s*global\s*world|global\s*world|silk\s*routes|great\s*depression|bretton\s*woods|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, theme: 'History — India and the Contemporary World II', title: 'The Age of Industrialisation', desc: 'Before Industrial Revolution, proto-industrialisation, hand labour and steam power, industrialisation in colonies, factories come up, market for goods.', key: /age\s*of\s*industrialisation|industrial\s*revolution|factories|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, theme: 'History — India and the Contemporary World II', title: 'Print Culture and the Modern World', desc: 'First printed books in China and Japan, print comes to Europe, Gutenberg printing press, print revolution, religious debates, print in India, censorship.', key: /print\s*culture|gutenberg|print\s*revolution|vernacular\s*press|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, theme: 'Geography — Contemporary India II', title: 'Resources and Development', desc: 'Concept of resources, classification of resources, development of resources, resource planning in India, land resources, land utilisation, soil types and conservation.', key: /resources\s*and\s*development|land\s*resources|soil\s*erosion|soil\s*types|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, theme: 'Geography — Contemporary India II', title: 'Forest and Wildlife Resources', desc: 'Flora and fauna in India, classification of species (IUCN), factors causing depletion, conservation of forests and wildlife, Chipko movement, community conservation.', key: /forest\s*and\s*wildlife|flora\s*and\s*fauna|chipko|tiger\s*project|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, theme: 'Geography — Contemporary India II', title: 'Water Resources', desc: 'Water scarcity, need for water conservation, multi-purpose river projects and integrated water resources management, rainwater harvesting techniques.', key: /water\s*resources|rainwater\s*harvesting|multi[- ]purpose\s*river|dams|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, theme: 'Geography — Contemporary India II', title: 'Agriculture', desc: 'Types of farming: primitive subsistence, intensive subsistence, commercial farming; cropping pattern: rabi, kharif, zaid; major crops: rice, wheat, pulses, sugarcane, tea, coffee; institutional reforms.', key: /agriculture\b|cropping\s*pattern|rabi|kharif|cash\s*crops|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, theme: 'Geography — Contemporary India II', title: 'Minerals and Energy Resources', desc: 'Mode of occurrence of minerals, ferrous and non-ferrous minerals, non-metallic minerals, conventional energy sources (coal, petroleum), non-conventional energy (solar, wind, biogas).', key: /minerals?\s*and\s*energy|ferrous|coal|petroleum|solar\s*energy|ch\s*10\b|chapter\s*10\b/i },
      { num: 11, theme: 'Geography — Contemporary India II', title: 'Manufacturing Industries', desc: 'Importance of manufacturing, industrial location, classification of industries, agro-based industries (textiles, sugar), mineral-based (iron & steel, aluminium, chemical, cement), industrial pollution.', key: /manufacturing\s*industries|iron\s*and\s*steel|industrial\s*location|ch\s*11\b|chapter\s*11\b/i },
      { num: 12, theme: 'Geography — Contemporary India II', title: 'Lifelines of National Economy', desc: 'Transport: roadways, railways, pipelines, waterways, major sea ports, airways; communication: postal, telecom; international trade, tourism as a trade.', key: /lifelines\s*of\s*national\s*economy|roadways|railways|ports|communication|ch\s*12\b|chapter\s*12\b/i },
      { num: 13, theme: 'Political Science — Democratic Politics II', title: 'Power Sharing', desc: 'Case studies of Belgium and Sri Lanka, majoritarianism in Sri Lanka, accommodation in Belgium, why power sharing is desirable, forms of power sharing: horizontal and vertical.', key: /power\s*sharing|belgium|sri\s*lanka|majoritarianism|ch\s*13\b|chapter\s*13\b/i },
      { num: 14, theme: 'Political Science — Democratic Politics II', title: 'Federalism', desc: 'What is federalism, key features of federalism, what makes India a federal country (Union, State, Concurrent lists), how is federalism practised, decentralisation in India (Panchayati Raj).', key: /federalism|decentralisation|panchayati\s*raj|concurrent\s*list|ch\s*14\b|chapter\s*14\b/i },
      { num: 15, theme: 'Political Science — Democratic Politics II', title: 'Gender, Religion and Caste', desc: 'Gender and politics: public/private division, women’s political representation; religion, communalism and politics, secular state; caste and politics, caste inequalities.', key: /gender,?\s*religion\s*and\s*caste|communalism|secular\s*state|caste\s*in\s*politics|ch\s*15\b|chapter\s*15\b/i },
      { num: 16, theme: 'Political Science — Democratic Politics II', title: 'Political Parties', desc: 'Why do we need political parties, functions of parties, how many parties should we have, national and state parties, challenges to political parties, how can parties be reformed.', key: /political\s*parties|national\s*parties|regional\s*parties|party\s*reforms|ch\s*16\b|chapter\s*16\b/i },
      { num: 17, theme: 'Political Science — Democratic Politics II', title: 'Outcomes of Democracy', desc: 'How do we assess democracy’s outcomes, accountable, responsive and legitimate government, economic growth and development, reduction of inequality and poverty, accommodation of social diversity.', key: /outcomes\s*of\s*democracy|accountable.*government|legitimate\s*government|ch\s*17\b|chapter\s*17\b/i },
      { num: 18, theme: 'Economics', title: 'Development', desc: 'What development promises: different people different goals; national development, income and other criteria, public facilities, sustainability of development, HDI overview.', key: /development\b|per\s*capita\s*income|hdi|sustainability|ch\s*18\b|chapter\s*18\b/i },
      { num: 19, theme: 'Economics', title: 'Sectors of the Indian Economy', desc: 'Sectors of economic activities: primary, secondary, tertiary; comparing three sectors, historical change in sectors, rising importance of tertiary sector, organised and unorganised sectors.', key: /sectors\s*of\s*the\s*indian\s*economy|primary,?\s*secondary|tertiary|unorganised\s*sector|ch\s*19\b|chapter\s*19\b/i },
      { num: 20, theme: 'Economics', title: 'Money and Credit', desc: 'Money as medium of exchange, modern forms of money (currency, bank deposits), loan activities of banks, terms of credit, formal and informal credit in India, self-help groups (SHGs).', key: /money\s*and\s*credit|terms\s*of\s*credit|formal\s*credit|self[- ]help\s*groups|shgs?|ch\s*20\b|chapter\s*20\b/i },
      { num: 21, theme: 'Economics', title: 'Globalisation and the Indian Economy', desc: 'Production across countries, multinational corporations (MNCs), interlinking production across countries, foreign trade and integration of markets, what is globalisation, factors enabling globalisation (technology, trade liberalisation, WTO), impact of globalisation.', key: /globalisation|multinational|mncs?|wto|liberalisation|foreign\s*trade|ch\s*21\b|chapter\s*21\b/i },
      { num: 22, theme: 'Economics', title: 'Consumer Rights', desc: 'Consumer movement in India, Consumer Protection Act (COPRA), consumer rights: right to information, right to safety, right to seek redressal, consumer courts.', key: /consumer\s*rights|copra|consumer\s*protection|right\s*to\s*information|ch\s*22\b|chapter\s*22\b/i },
    ]
  },
  {
    name: 'English',
    code: 'ENG-10',
    bookName: 'First Flight & Footprints without Feet',
    icon: 'book-open',
    color: '#8B5CF6',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 10 English Language and Literature.',
    chapters: [
      { num: 1, title: 'A Letter to God / Dust of Snow / Fire and Ice', desc: 'G.L. Fuentes’s Lencho faith story; Robert Frost’s Dust of Snow and Fire and Ice poems.', key: /letter\s*to\s*god|lencho|dust\s*of\s*snow|fire\s*and\s*ice|ch\s*1\b|chapter\s*1\b|book\s*overview/i },
      { num: 2, title: 'Nelson Mandela: Long Walk to Freedom / A Tiger in the Zoo', desc: 'Nelson Mandela’s historic inauguration speech on freedom; Leslie Norris’s captive tiger poem.', key: /nelson\s*mandela|long\s*walk\s*to\s*freedom|tiger\s*in\s*the\s*zoo|ch\s*2\b|chapter\s*2\b/i },
      { num: 3, title: 'Two Stories about Flying / How to Tell Wild Animals / Ball Poem', desc: 'Liam O’Flaherty’s young seagull; The Black Aeroplane; Carolyn Wells’s Wild Animals; John Berryman’s Ball Poem.', key: /two\s*stories\s*about\s*flying|his\s*first\s*flight|black\s*aeroplane|ball\s*poem|wild\s*animals|ch\s*3\b|chapter\s*3\b/i },
      { num: 4, title: 'From the Diary of Anne Frank / Amanda!', desc: 'Anne Frank’s secret annex reflections; Robin Klein’s poem on adolescent freedom.', key: /diary\s*of\s*anne\s*frank|anne\s*frank|amanda\b|ch\s*4\b|chapter\s*4\b/i },
      { num: 5, title: 'Glimpses of India / The Trees', desc: 'A Baker from Goa; Coorg; Tea from Assam; Adrienne Rich’s feminist forest liberation poem.', key: /glimpses\s*of\s*india|baker\s*from\s*goa|coorg|tea\s*from\s*assam|the\s*trees|ch\s*5\b|chapter\s*5\b/i },
      { num: 6, title: 'Mijbil the Otter / Fog', desc: 'Gavin Maxwell’s pet otter journey in London; Carl Sandburg’s evocative Fog poem.', key: /mijbil\s*the\s*otter|mijbil|fog\b|ch\s*6\b|chapter\s*6\b/i },
      { num: 7, title: 'Madam Rides the Bus / Tale of Custard the Dragon', desc: 'Vallikkannan’s 8-year-old Valli’s adventurous bus ride; Ogden Nash’s humorous cowardly dragon ballad.', key: /madam\s*rides\s*the\s*bus|valli|custard\s*the\s*dragon|ch\s*7\b|chapter\s*7\b/i },
      { num: 8, title: 'The Sermon at Benares / For Anne Gregory', desc: 'Gautama Buddha and Kisa Gotami’s mustard seed lesson; W.B. Yeats’s spiritual vs physical beauty poem.', key: /sermon\s*at\s*benares|kisa\s*gotami|anne\s*gregory|ch\s*8\b|chapter\s*8\b/i },
      { num: 9, title: 'The Proposal', desc: 'Anton Chekhov’s hilarious one-act farce: Lomov, Natalya, and Chubukov arguing over Oxen Meadows.', key: /the\s*proposal|lomov|natalya|chekhov|ch\s*9\b|chapter\s*9\b/i },
      { num: 10, title: 'Footprints: A Triumph of Surgery & The Thief’s Story', desc: 'James Herriot’s Tricki veterinary story; Ruskin Bond’s Hari Singh and Anil mentorship narrative.', key: /triumph\s*of\s*surgery|tricki|thief'?s?\s*story|hari\s*singh|ch\s*10\b/i },
      { num: 11, title: 'Footprints: The Midnight Visitor & A Question of Trust', desc: 'Robert Arthur’s spy Ausable outwitting Max; Victor Canning’s Horace Danby jewel robbery twist.', key: /midnight\s*visitor|ausable|question\s*of\s*trust|horace\s*danby|ch\s*11\b/i },
      { num: 12, title: 'Footprints: Footprints without Feet & Making of a Scientist', desc: 'H.G. Wells’s invisible scientist Griffin; Richard Ebright’s monarch butterfly experiments.', key: /footprints\s*without\s*feet|griffin|making\s*of\s*a\s*scientist|ebright|ch\s*12\b/i },
      { num: 13, title: 'Footprints: The Necklace & Bholi & Book That Saved Earth', desc: 'Guy de Maupassant’s Mathilde Loisel; K.A. Abbas’s empowering story of Bholi; Claire Boiko’s Martian comedy.', key: /the\s*necklace|bholi|book\s*that\s*saved\s*the\s*earth|think[- ]tank|ch\s*13\b/i },
    ]
  },
  {
    name: 'Hindi',
    code: 'HIN-10',
    bookName: 'Kshitij Part 2 & Kritika Part 2',
    icon: 'languages',
    color: '#EF4444',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 10 Hindi Course A.',
    chapters: [
      { num: 1, title: 'पद (सूरदास)', desc: 'सूरदास के भ्रमरगीत से चार पद: गोपियों और उद्धव का ज्ञान-योग बनाम प्रेम-भक्ति संवाद।', key: /पद\s*\(सूरदास\)|सूरदास\s*के\s*पद|surdas|भ्रमरगीत|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)', desc: 'तुलसीदास के रामचरितमानस (बालकाण्ड) से: धनुष-भंग के पश्चात लक्ष्मण और परशुराम का वाक्युद्ध।', key: /राम[- ]लक्ष्मण[- ]परशुराम|parshuram|तुलसीदास|tulsidas|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'उत्साह और अट नहीं रही (सूर्यकांत त्रिपाठी ‘निराला’)', desc: 'निराला जी की क्रांति और नवजीवन का आह्वान करती बादल पर कविता एवं फाल्गुन का सौंदर्य।', key: /उत्साह|अट\s*नहीं\s*रही|निराला|nirala|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'यह दंतुरित मुस्कान और फसल (नागार्जुन)', desc: 'नागार्जुन द्वारा शिशु की मनमोहक मुस्कान तथा श्रम, मिट्टी और पानी के संगम से उपजी फसल का गान।', key: /दंतुरित\s*मुस्कान|फसल|नागार्जुन|nagarjun|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'संगतकार (मंगलेश डबराल)', desc: 'मुख्य गायक को संबल देने वाले पृष्ठभूमि के कलाकारों, त्याग और मानवीय सहयोग की वंदना।', key: /संगतकार|sangatkar|मंगलेश\s*डबराल|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'नेताजी का चश्मा (स्वयं प्रकाश)', desc: 'हालदार साहब और कैप्टन चश्मेवाले की देशभक्ति: देशप्रेम नारों में नहीं, आचरण और सेवा में है।', key: /नेताजी\s*का\s*चश्मा|netaji\s*ka\s*chashma|कैप्टन|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'बालगोबिन भगत (रामवृक्ष बेनीपुरी)', desc: 'कबीरपंथी संन्यासी बालगोबिन भगत का कर्मयोगी गृहस्थ जीवन, सामाजिक रूढ़ियों का विरोध।', key: /बालगोबिन\s*भगत|balgobin\s*bhagat|बेनीपुरी|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'लखनवी अंदाज़ (यशपाल)', desc: 'नवाब साहब का दिखावटी जीवन, खीरे का रसास्वादन और बिना विचार-कथा के कहानी लिखने पर व्यंग्य।', key: /लखनवी\s*अंदाज़|lakhnavi\s*andaz|यशपाल|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'एक कहानी यह भी (मन्नू भंडारी)', desc: 'मन्नू भंडारी का आत्मकथ्य: पिता का प्रभाव, शीला अग्रवाल का मार्गदर्शन और स्वाधीनता आंदोलन में भागीदारी।', key: /एक\s*कहानी\s*यह\s*भी|ek\s*kahani\s*yeh\s*bhi|मन्नू\s*भंडारी|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'नौबतखाने में इबादत (यतींद्र मिश्र)', desc: 'शहनाई नवाज़ भारत रत्न उस्ताद बिस्मिल्ला खाँ की संगीत-साधना, गंगा-जमुनी तहज़ीब और सादगी।', key: /नौबतखाने\s*में\s*इबादत|बिस्मिल्ला\s*खाँ|bismillah|पाठ\s*10\b|ch\s*10\b/i },
      { num: 11, title: 'संस्कृति (भदंत आनंद कौसल्यायन)', desc: 'सभ्यता और संस्कृति में अंतर, मानव-कल्याण की भावना, खोज और अविष्कार के मूल में संस्कृति।', key: /संस्कृति|sanskriti|कौसल्यायन|पाठ\s*11\b|ch\s*11\b/i },
    ]
  },
  {
    name: 'Sanskrit',
    code: 'SKT-10',
    bookName: 'Shemushi (शेमुषी द्वितीयो भागः)',
    icon: 'scroll',
    color: '#B45309',
    description: 'Official CBSE 2026–27 Secondary curriculum for Class 10 Sanskrit.',
    chapters: [
      { num: 1, title: 'शुचिपर्यावरणम्', desc: 'हरिदत्त-शर्मणः लसल्लतिका-सङ्ग्रहात्: प्रदूषणनिवारणम्, प्रकृतेः शरणम्, शुद्धपर्यावरणस्य आवश्यकता।', key: /शुचिपर्यावरणम्|shuchiparyavaranam|पाठ\s*1\b|ch\s*1\b|book\s*overview/i },
      { num: 2, title: 'बुद्धिर्बलवती सदा', desc: 'शुकसप्ततिः कथाग्रन्थात्: बुद्धिमती-स्त्रियाः चातुर्येण व्याघ्रभयात् स्वपुत्रयोः रक्षणम्।', key: /बुद्धिर्बलवती\s*सदा|buddhirbalavati|पाठ\s*2\b|ch\s*2\b/i },
      { num: 3, title: 'शिशुलालनम्', desc: 'दिङ्नागस्य कुन्दमाला-नाटकात्: राम-सभायां लव-कुशयोः वात्सल्यपूर्वकं स्वागताभिनन्दनम्।', key: /शिशुलालनम्|shishulalanam|कुन्दमाला|पाठ\s*3\b|ch\s*3\b/i },
      { num: 4, title: 'जननी तुल्यवत्सला', desc: 'महाभारतस्य वनपर्वात्: सुरभि-इन्द्र-संवादः, सर्वसन्ततिषु मातुः समस्नेहः, दुर्बलपुत्रे विशेषा कृपा।', key: /जननी\s*तुल्यवत्सला|janani\s*tulyavatsala|सुरभि|पाठ\s*4\b|ch\s*4\b/i },
      { num: 5, title: 'सुभाषितानि', desc: 'विविध-संस्कृतग्रन्थेभ्यः नीतिश्लोकाः: उद्यमस्य महत्वं, क्रोधहानिः, बुद्धेः प्रभावः, सङ्गतिफलम्।', key: /सुभाषितानि|subhashitani|पाठ\s*5\b|ch\s*5\b/i },
      { num: 6, title: 'सौहार्दं प्रकृतेः शोभा', desc: 'पशुपक्षिणां संवादेन आत्मप्रशंसायाः खण्डनम्, परस्परं सौहार्दभावेन जीवनयापनस्य सन्देशः।', key: /सौहार्दं\s*प्रकृतेः\s*शोभा|sauhardam|पाठ\s*6\b|ch\s*6\b/i },
      { num: 7, title: 'विचित्रः साक्षी', desc: 'ओमप्रकाश-ठाकुरस्य कथा: न्यायाधीश-बङ्किमचन्द्रस्य चातुर्येण निर्दोषस्य न्यायप्राप्तिः, शवसाक्ष्यम्।', key: /विचित्रः\s*साक्षी|vichitrah\s*sakshi|बङ्किमचन्द्र|पाठ\s*7\b|ch\s*7\b/i },
      { num: 8, title: 'सूक्तयः', desc: 'तिरुक्कुरल् ग्रन्थात् सङ्गृहीताः सूक्तयः: वाक्पटुता, धर्मनिष्ठता, विद्वत्ता, सत्यवादिता।', key: /सूक्तयः|suktayah|तिरुक्कुरल्|पाठ\s*8\b|ch\s*8\b/i },
      { num: 9, title: 'भूकम्पविभीषिका', desc: 'गुजरातस्य कच्छभूकम्पस्य विभीषिका, प्राकृतिकआपदासु सावधानता, वैज्ञानिक-दृष्टिकोणः।', key: /भूकम्पविभीषिका|bhukampavibhishika|भूकम्प|पाठ\s*9\b|ch\s*9\b/i },
      { num: 10, title: 'अन्योक्तयः', desc: 'पण्डितराज-जगन्नाथस्य भामिनीविलासात्: राजहंस-सरोवर-मेघ-चातक-माध्यमेन अप्रत्यक्ष-प्रबोधः।', key: /अन्योक्तयः|anyoktayah|भामिनीविलास|पाठ\s*10\b|ch\s*10\b/i },
    ]
  }
];

export {
  class7CurriculumDef,
  class8CurriculumDef,
  class9CurriculumDef,
  class10CurriculumDef,
  detectLectureType,
  rawVideos
};

