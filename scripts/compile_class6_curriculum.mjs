import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scripts/parsed_raw_videos.json', 'utf8'));

// Helper to classify lesson type
function detectLessonType(title) {
  if (/overview|introduction|strategy/i.test(title)) return 'Introduction & Overview';
  if (/ncert\s+solutions|solutions|exercise/i.test(title)) return 'NCERT Solutions & Exercises';
  if (/figure\s+it\s+out|activity/i.test(title)) return 'Activity & Solved Examples';
  if (/one\s+shot|revision/i.test(title)) return 'Revision & Summary';
  if (/mcqs|multiple\s+choice|important\s+questions/i.test(title)) return 'MCQs & Practice';
  return 'Concept Explanation';
}

// 1. MATHEMATICS (Ganita Prakash)
const mathChaptersDef = [
  { num: 1, title: 'Patterns in Mathematics', desc: 'Patterns in shapes, numbers, visualising sequences, relations among number sequences and mathematical thinking.' },
  { num: 2, title: 'Lines and Angles', desc: 'Points, lines, rays, segments, parallel and intersecting lines, angles and basic geometric constructions.' },
  { num: 3, title: 'Number Play', desc: 'Clock and calendar numbers, mental math, Collatz conjecture, number patterns, estimation and winning games.' },
  { num: 4, title: 'Data Handling and Presentation', desc: 'Collecting, organising data, pictographs, drawing bar graphs, aesthetic considerations and infographics.' },
  { num: 5, title: 'Prime Time', desc: 'Common multiples and factors, prime and composite numbers, co-prime numbers, prime factorisation and divisibility rules.' },
  { num: 6, title: 'Perimeter and Area', desc: 'Perimeter of rectangle, square, triangle; area concepts, area of triangles, making it more or less, and area maze puzzles.' },
  { num: 7, title: 'Fractions', desc: 'Fractional units, equal shares, parts of a whole, representation on number line, equivalent fractions and comparisons.' },
  { num: 8, title: 'Playing with Constructions', desc: 'Compass and ruler constructions, perpendicular bisectors, angle bisectors and polygon drafting.' },
  { num: 9, title: 'Symmetry', desc: 'Line symmetry, rotational symmetry, reflection, kaleidoscope patterns and practical applications.' },
  { num: 10, title: 'The Other Side of Zero', desc: 'Negative numbers, integers on number line, order relations, addition and subtraction of integers.' },
];

// 2. SCIENCE (Curiosity)
const scienceChaptersDef = [
  { num: 1, title: 'The Wonderful World of Science', desc: 'Introduction to scientific inquiry, observation, experimentation, curiosity and natural wonders.' },
  { num: 2, title: 'Diversity in the Living World', desc: 'Plant and animal classification, regional biodiversity, habitats, adaptations and ecosystem interactions.' },
  { num: 3, title: 'Mindful Eating: A Path to a Healthy Body', desc: 'Components of food, nutrients, carbohydrates, proteins, fats, vitamins, minerals, balanced diet and testing nutrients.' },
  { num: 4, title: 'Exploring Magnets', desc: 'Discovery of magnets, magnetic and non-magnetic materials, poles of magnet, magnetic field and compass navigation.' },
  { num: 5, title: 'Measurement of Length and Motion', desc: 'Standard units of measurement, SI units, measuring length accurately, types of motion: rectilinear, circular and periodic.' },
  { num: 6, title: 'Materials Around Us', desc: 'Grouping materials based on appearance, hardness, solubility, transparency, density and conduction.' },
  { num: 7, title: 'Temperature and its Measurement', desc: 'Heat vs temperature, clinical and laboratory thermometers, temperature scales and thermal equilibrium.' },
  { num: 8, title: 'A Journey through States of Water', desc: 'Evaporation, condensation, precipitation, water cycle, groundwater recharge and water conservation.' },
  { num: 9, title: 'Methods of Separation in Everyday Life', desc: 'Handpicking, threshing, winnowing, sieving, sedimentation, decantation, filtration and evaporation.' },
  { num: 10, title: 'Living Creatures: Exploring their Characteristics', desc: 'Cellular organization, nutrition, respiration, response to stimuli, excretion, reproduction and life cycle.' },
  { num: 11, title: "Nature's Treasures", desc: 'Renewable and non-renewable natural resources, soil, forests, minerals, air, conservation and sustainability.' },
  { num: 12, title: 'Beyond Earth', desc: 'The solar system, planets, moon phases, constellations, comets, asteroids and modern space exploration.' },
];

// 3. SOCIAL SCIENCE (Exploring Society: India and Beyond)
const sstChaptersDef = [
  { num: 1, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Locating Places on the Earth', desc: 'Globe, latitudes, longitudes, prime meridian, equator, time zones and coordinates.' },
  { num: 2, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Oceans and Continents', desc: 'Seven continents, major ocean basins, plate tectonics overview, and global geography.' },
  { num: 3, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Landforms and Life', desc: 'Mountains, plateaus, plains, river valleys, desert life and human adaptations to landforms.' },
  { num: 4, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'Timeline and Sources of History', desc: 'Historical dating (BCE/CE), archaeological excavations, inscriptions, coins, manuscripts and oral traditions.' },
  { num: 5, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'India, That Is Bharat', desc: 'Origin of names Bharat, India, and Hindustan; territorial extent, geographical identity and unity in antiquity.' },
  { num: 6, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Beginnings of Indian Civilisation', desc: 'Indus-Sarasvati Civilisation (Harappan), urban planning, trade, crafts, town layout, and decline.' },
  { num: 7, theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS', title: "India's Cultural Roots", desc: 'Vedic literature, Upanishads, epics Ramayana and Mahabharata, early philosophical and ethical traditions.' },
  { num: 8, theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS', title: "Unity in Diversity, or 'Many in the One'", desc: 'Linguistic diversity, festivals, folklore, traditional art, architecture, and unifying philosophical threads.' },
  { num: 9, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Family and Community', desc: 'Family structures, kinship, mutual care, village communities, and social cooperation.' },
  { num: 10, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Grassroots Democracy — Part 1: Governance', desc: 'Concept of rule of law, participatory governance, civic duties and public decision-making.' },
  { num: 11, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', desc: 'Panchayati Raj system, Gram Sabha, Gram Panchayat, Panchayat Samiti and Zilla Parishad.' },
  { num: 12, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Grassroots Democracy — Part 3: Local Government in Urban Areas', desc: 'Municipal corporations, municipalities, ward committees, urban civic infrastructure and administration.' },
  { num: 13, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'The Value of Work', desc: 'Dignity of labour, unpaid household work, essential workers, and appreciation of all trades.' },
  { num: 14, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'Economic Activities Around Us', desc: 'Primary, secondary, and tertiary sectors; farming, crafts, markets, transport and services.' },
];

// 4. ENGLISH (Poorvi)
const englishUnitsDef = [
  { num: 1, title: 'Unit 1: Fables and Folk Tales', desc: 'Traditional stories teaching timeless wisdom: A Bottle of Dew, The Raven and the Fox, Rama to the Rescue.' },
  { num: 2, title: 'Unit 2: Friendship', desc: 'Bonding, compassion and camaraderie: The Unlikely Best Friends, A Friend’s Prayer, The Chair.' },
  { num: 3, title: 'Unit 3: Nurturing Nature', desc: 'Ecological appreciation and balance: Neem Baba, What a Bird Thought, Spices That Heal Us.' },
  { num: 4, title: 'Unit 4: Sports and Wellness', desc: 'Physical fitness, resilience and sportsmanship: Change of Heart, The Winner, Yoga — A Way of Life.' },
  { num: 5, title: 'Unit 5: Culture and Tradition', desc: 'Indian heritage, craft and festivals: Hamara Bharat — Incredible India!, The Kites, Ila Sachani: Embroidering Dreams with her Feet.' },
];

// 5. HINDI (Malhar)
const hindiChaptersDef = [
  { num: 1, title: 'मातृभूमि', desc: 'सोहनलाल द्विवेदी द्वारा रचित देशप्रेम और मातृभूमि के प्रति श्रद्धा की प्रेरणादायी कविता।' },
  { num: 2, title: 'गोल', desc: 'मेजर ध्यानचंद के हॉकी जीवन के प्रेरक संस्मरण और अनुशासन का महत्व।' },
  { num: 3, title: 'पहली बूँद', desc: 'वर्षा ऋतु के आगमन, धरती की तृप्ति और प्राकृतिक सौंदर्य पर आधारित कविता।' },
  { num: 4, title: 'हार की जीत', desc: 'सुदर्शन जी की सुप्रसिद्ध कहानी: बाबा भारती और डाकू खड्गसिंह का हृदय परिवर्तन।' },
  { num: 5, title: 'रहीम के दोहे', desc: 'रहीम दास जी के नीतिपरक दोहे जो सदाचार, परोपकार और जीवन मूल्यों की शिक्षा देते हैं।' },
  { num: 6, title: 'मेरी माँ', desc: 'रामप्रसाद बिस्मिल द्वारा अपनी माँ के स्नेह, त्याग और देशभक्ति के प्रति कृतज्ञता।' },
  { num: 7, title: 'जलाते चलो', desc: 'द्वारिका प्रसाद माहेश्वरी की आशावादी कविता जो अज्ञानता और निराशा को दूर करने का संदेश देती है।' },
  { num: 8, title: 'सत्रिया और बिहू नृत्य', desc: 'असम की समृद्ध लोक एवं शास्त्रीय नृत्य परम्परा का सजीव सांस्कृतिक परिचय।' },
  { num: 9, title: 'मैया मैं नहिं माखन खायो', desc: 'सूरदास जी के वात्सल्य रस से परिपूर्ण बाल-कृष्ण और माता यशोदा के संवाद।' },
  { num: 10, title: 'परीक्षा', desc: 'प्रेमचंद जी की प्रसिद्ध कहानी: रियासत के दीवान पद के लिए सच्ची योग्यता और मानवीय परख।' },
  { num: 11, title: 'चेतक की वीरता', desc: 'श्याम नारायण पाण्डेय द्वारा रचित महाराणा प्रताप के स्वामिभक्त अश्व चेतक के शौर्य का वर्णन।' },
  { num: 12, title: 'हिंद महासागर में छोटा-सा हिंदुस्तान', desc: 'मॉरीशस की यात्रा का रोचक वृत्तांत, भारतीय संस्कृति और प्रवासियों का जीवंत चित्रण।' },
  { num: 13, title: 'पेड़ की बात', desc: 'जगदीश चंद्र बसु द्वारा पेड़-पौधों के जीवन, संवेदनशीलता और प्रकृति के साथ उनके जुड़ाव की वैज्ञानिक व्याख्या।' },
];

// 6. SANSKRIT (Deepakam)
const sanskritChaptersDef = [
  { num: 1, title: 'वयं वर्णमालां पठामः', desc: 'संस्कृत वर्णमाला: स्वराः व्यञ्जनानि च, उच्चारण स्थानानि परिचयः।' },
  { num: 2, title: 'संयुक्तव्यञ्जनानि', desc: 'संयुक्तव्यञ्जनानां प्रयोगः, वर्णसंयोगः वर्णवियोगः च। (Video status: Not available yet)' },
  { num: 3, title: 'एषः कः ? एषा का ? एतत् किम् ?', desc: 'सर्वनामशब्दानाम् अभ्यासः, पुंल्लिङ्ग-स्त्रीलिङ्ग-नपुंसकलिङ्ग-प्रयोगाः।' },
  { num: 4, title: 'अहं च त्वं च', desc: 'उत्तमपुरुष-मध्यमपुरुषयोः क्रियापदैः सह प्रयोगः, संवादाभ्यासः।' },
  { num: 5, title: 'सङ्ख्यागणना ननु सरला', desc: 'संस्कृते १ तः २० पर्यन्तं सङ्ख्यानां ज्ञानं, गणनाभ्यासः।' },
  { num: 6, title: 'अहं प्रातः उत्तिष्ठामि', desc: 'दिनचर्या, प्रभातवेलायाः महत्वं, प्रथमपुरुषस्य क्रियापदानि।' },
  { num: 7, title: 'शूराः वयं धीराः वयम्', desc: 'देशभक्तिपूर्णं बालगीतं, वयम् इति बहुवचनप्रयोगः।' },
  { num: 8, title: 'सः एव महान् चित्रकारः', desc: 'चित्रकला, पशुपक्षिणां वर्णना, कथामाध्यमेन शिक्षाम्।' },
  { num: 9, title: 'अतिथिदेवो भव', desc: 'भारतीयसंस्कृतेः अतिथि-सत्कार-परम्परा, आतिथ्यधर्मः।' },
  { num: 10, title: 'बुद्धिः सर्वार्थसाधिका', desc: 'चातुर्यकथा, बुद्धेः बलेन कठिनकार्याणां सिद्धिः।' },
  { num: 11, title: 'यो जानाति सः पण्डितः', desc: 'प्रहेलिकाः (पहेलियाँ), बौद्धिकव्यायामः, सूक्तयः।' },
  { num: 12, title: 'त्वम् आपणं गच्छ', desc: 'विपणि-संवादः (बाजार में बातचीत), वस्तुक्रयणविक्रयणम्।' },
  { num: 13, title: 'पृथिव्यां त्रीणि रत्नानि', desc: 'सुभाषितानि: जलम्, अन्नम्, सुभाषितम् इति त्रिरत्नमहत्वम्।' },
  { num: 14, title: 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः', desc: 'उद्यमस्य (परिश्रमस्य) प्रशंसा, आलस्यत्यागस्य प्रेरणा।' },
  { num: 15, title: 'माधवस्य प्रियम् अङ्गम्', desc: 'शरीरस्य अङ्गानां नामानि, तेषां कार्याणि सार्थकता च।' },
  { num: 16, title: 'वृक्षाः सत्पुरुषाः इव', desc: 'परोपकारस्य संदेशः, वृक्षाणां छाया-फल-काष्ठ-दानशीलता।' },
];

console.log('Curriculum definitions compiled successfully.');
