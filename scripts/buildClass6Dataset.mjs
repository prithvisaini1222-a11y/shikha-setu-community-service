import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/parsed_raw_videos.json', 'utf8'));

function cleanTitle(title) {
  return title
    .replace(/\s*\|\s*Class\s*6.*$/i, '')
    .replace(/\s*\|\s*CBSE.*$/i, '')
    .replace(/\s*\|\s*Session.*$/i, '')
    .trim();
}

function classifyTopic(title) {
  if (/overview|introduction|strategy/i.test(title)) return 'Overview & Introduction';
  if (/ncert\s+solutions|solutions|exercise/i.test(title)) return 'NCERT Solutions & Exercises';
  if (/figure\s+it\s+out|activity|matha\s+pachchi/i.test(title)) return 'Practice & Solved Activities';
  if (/one\s+shot|revision|summary/i.test(title)) return 'One-Shot Revision & Key Concepts';
  if (/mcqs|multiple\s+choice|important\s+questions|miqs/i.test(title)) return 'MCQs & Board Questions';
  return 'Core Concept Walkthrough';
}

// 1. MATH
const mathChapters = [
  { num: 1, title: 'Patterns in Mathematics', desc: 'Patterns in shapes, numbers, visualising sequences, relations among number sequences and mathematical thinking.', key: /patterns\s+in\s+mathematics|ch\s*1\b|chapter\s*1\b|Book Overview/i },
  { num: 2, title: 'Lines and Angles', desc: 'Points, lines, rays, segments, parallel and intersecting lines, angles and basic geometric constructions.', key: /lines\s+and\s+angles|ch\s*2\b|chapter\s*2\b/i },
  { num: 3, title: 'Number Play', desc: 'Clock and calendar numbers, mental math, Collatz conjecture, number patterns, estimation and winning games.', key: /number\s+play|ch\s*3\b|chapter\s*3\b/i },
  { num: 4, title: 'Data Handling and Presentation', desc: 'Collecting, organising data, pictographs, drawing bar graphs, aesthetic considerations and infographics.', key: /data\s+handling|ch\s*4\b|chapter\s*4\b/i },
  { num: 5, title: 'Prime Time', desc: 'Common multiples and factors, prime and composite numbers, co-prime numbers, prime factorisation and divisibility rules.', key: /prime\s+time|ch\s*5\b|chapter\s*5\b/i },
  { num: 6, title: 'Perimeter and Area', desc: 'Perimeter of rectangle, square, triangle; area concepts, area of triangles, making it more or less, and area maze puzzles.', key: /perimeter\s+and\s+area|ch\s*6\b|chapter\s*6\b/i },
  { num: 7, title: 'Fractions', desc: 'Fractional units, equal shares, parts of a whole, representation on number line, equivalent fractions and comparisons.', key: /fractions|ch\s*7\b|chapter\s*7\b/i },
  { num: 8, title: 'Playing with Constructions', desc: 'Compass and ruler constructions, perpendicular bisectors, angle bisectors and polygon drafting.', key: /constructions|ch\s*8\b|chapter\s*8\b/i },
  { num: 9, title: 'Symmetry', desc: 'Line symmetry, rotational symmetry, reflection, kaleidoscope patterns and practical applications.', key: /symmetry|ch\s*9\b|chapter\s*9\b/i },
  { num: 10, title: 'The Other Side of Zero', desc: 'Negative numbers, integers on number line, order relations, addition and subtraction of integers.', key: /other\s+side\s+of\s+zero|integers|ch\s*10\b|chapter\s*10\b/i },
];

// 2. SCIENCE
const scienceChapters = [
  { num: 1, title: 'The Wonderful World of Science', desc: 'Introduction to scientific inquiry, observation, experimentation, curiosity and natural wonders.', key: /wonderful\s+world|ch\s*1\b|chapter\s*1\b|Book Overview/i },
  { num: 2, title: 'Diversity in the Living World', desc: 'Plant and animal classification, regional biodiversity, habitats, adaptations and ecosystem interactions.', key: /diversity\s+in\s+the\s+living|living\s+world|plants\s+&?\s*animals\s+in\s+different|ch\s*2\b|chapter\s*2\b/i },
  { num: 3, title: 'Mindful Eating: A Path to a Healthy Body', desc: 'Components of food, nutrients, carbohydrates, proteins, fats, vitamins, minerals, balanced diet and testing nutrients.', key: /mindful\s+eating|components\s+of\s+food|ch\s*3\b|chapter\s*3\b/i },
  { num: 4, title: 'Exploring Magnets', desc: 'Discovery of magnets, magnetic and non-magnetic materials, poles of magnet, magnetic field and compass navigation.', key: /magnets|magnetism|ch\s*4\b|chapter\s*4\b/i },
  { num: 7, title: 'Temperature and its Measurement', desc: 'Heat vs temperature, clinical and laboratory thermometers, temperature scales and thermal equilibrium.', key: /temperature|ch\s*7\b|chapter\s*7\b/i },
  { num: 5, title: 'Measurement of Length and Motion', desc: 'Standard units of measurement, SI units, measuring length accurately, types of motion: rectilinear, circular and periodic.', key: /measurement\s+of\s+length|length\s+and\s+motion|rectilinear|circular\s+motion|ch\s*5\b|chapter\s*5\b/i },
  { num: 6, title: 'Materials Around Us', desc: 'Grouping materials based on appearance, hardness, solubility, transparency, density and conduction.', key: /materials\s+around\s+us|transparency|ch\s*6\b|chapter\s*6\b/i },
  { num: 8, title: 'A Journey through States of Water', desc: 'Evaporation, condensation, precipitation, water cycle, groundwater recharge and water conservation.', key: /states\s+of\s+water|water\s+cycle|ch\s*8\b|chapter\s*8\b/i },
  { num: 9, title: 'Methods of Separation in Everyday Life', desc: 'Handpicking, threshing, winnowing, sieving, sedimentation, decantation, filtration and evaporation.', key: /separation|ch\s*9\b|chapter\s*9\b/i },
  { num: 10, title: 'Living Creatures: Exploring their Characteristics', desc: 'Cellular organization, nutrition, respiration, response to stimuli, excretion, reproduction and life cycle.', key: /living\s+creatures|characteristics|ch\s*10\b|chapter\s*10\b/i },
  { num: 11, title: "Nature's Treasures", desc: 'Renewable and non-renewable natural resources, soil, forests, minerals, air, conservation and sustainability.', key: /nature'?s\s+treasures|treasures|ch\s*11\b|chapter\s*11\b/i },
  { num: 12, title: 'Beyond Earth', desc: 'The solar system, planets, moon phases, constellations, comets, asteroids and modern space exploration.', key: /beyond\s+earth|solar\s+system|space|ch\s*12\b|chapter\s*12\b/i },
].sort((a, b) => a.num - b.num);

// 3. SOCIAL SCIENCE
const sstChapters = [
  { num: 1, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Locating Places on the Earth', desc: 'Globe, latitudes, longitudes, prime meridian, equator, time zones and coordinates.', key: /locating\s+places|ch\s*1\b|chapter\s*1\b|Book Overview/i },
  { num: 2, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Oceans and Continents', desc: 'Seven continents, major ocean basins, plate tectonics overview, and global geography.', key: /oceans\s+and\s+continents|ch\s*2\b|chapter\s*2\b/i },
  { num: 3, theme: 'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE', title: 'Landforms and Life', desc: 'Mountains, plateaus, plains, river valleys, desert life and human adaptations to landforms.', key: /landforms\s+and\s+life|plateaus|ch\s*3\b|chapter\s*3\b/i },
  { num: 4, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'Timeline and Sources of History', desc: 'Historical dating (BCE/CE), archaeological excavations, inscriptions, coins, manuscripts and oral traditions.', key: /timeline\s+and\s+sources|sources\s+of\s+history|ch\s*4\b|chapter\s*4\b/i },
  { num: 5, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'India, That Is Bharat', desc: 'Origin of names Bharat, India, and Hindustan; territorial extent, geographical identity and unity in antiquity.', key: /india,?\s+that\s+is\s+bharat|bharat|ch\s*5\b|chapter\s*5\b/i },
  { num: 6, theme: 'THEME B — TAPESTRY OF THE PAST', title: 'The Beginnings of Indian Civilisation', desc: 'Indus-Sarasvati Civilisation (Harappan), urban planning, trade, crafts, town layout, and decline.', key: /beginnings\s+of\s+indian\s+civilisation|civilisation|ch\s*6\b|chapter\s*6\b/i },
  { num: 7, theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS', title: "India's Cultural Roots", desc: 'Vedic literature, Upanishads, epics Ramayana and Mahabharata, early philosophical and ethical traditions.', key: /cultural\s+roots|ch\s*7\b|chapter\s*7\b/i },
  { num: 8, theme: 'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS', title: "Unity in Diversity, or 'Many in the One'", desc: 'Linguistic diversity, festivals, folklore, traditional art, architecture, and unifying philosophical threads.', key: /unity\s+in\s+diversity|many\s+in\s+the\s+one|ch\s*8\b|chapter\s*8\b/i },
  { num: 9, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Family and Community', desc: 'Family structures, kinship, mutual care, village communities, and social cooperation.', key: /family\s+and\s+community|ch\s*9\b|chapter\s*9\b/i },
  { num: 10, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Grassroots Democracy — Part 1: Governance', desc: 'Concept of rule of law, participatory governance, civic duties and public decision-making.', key: /grassroots\s+democracy\s*[-—]?\s*part\s*1|governance|ch\s*10\b|chapter\s*10\b/i },
  { num: 11, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', desc: 'Panchayati Raj system, Gram Sabha, Gram Panchayat, Panchayat Samiti and Zilla Parishad.', key: /grassroots\s+democracy\s*[-—]?\s*part\s*2|rural\s+areas|panchayat|ch\s*11\b|chapter\s*11\b/i },
  { num: 12, theme: 'THEME D — GOVERNANCE AND DEMOCRACY', title: 'Grassroots Democracy — Part 3: Local Government in Urban Areas', desc: 'Municipal corporations, municipalities, ward committees, urban civic infrastructure and administration.', key: /grassroots\s+democracy\s*[-—]?\s*part\s*3|urban\s+areas|municipality|ch\s*12\b|chapter\s*12\b/i },
  { num: 14, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'Economic Activities Around Us', desc: 'Primary, secondary, and tertiary sectors; farming, crafts, markets, transport and services.', key: /economic\s+activities|ch\s*14\b|chapter\s*14\b/i },
  { num: 13, theme: 'THEME E — ECONOMIC LIFE AROUND US', title: 'The Value of Work', desc: 'Dignity of labour, unpaid household work, essential workers, and appreciation of all trades.', key: /value\s+of\s+work|ch\s*13\b|chapter\s*13\b/i },
].sort((a, b) => a.num - b.num);

// 4. ENGLISH
const englishUnits = [
  { num: 1, title: 'Unit 1: Fables and Folk Tales', desc: 'Traditional stories teaching timeless wisdom: A Bottle of Dew, The Raven and the Fox, Rama to the Rescue.', key: /fables\s+and\s+folk\s+tales|bottle\s+of\s+dew|raven\s+and\s+the\s+fox|rama\s+to\s+the\s+rescue|unit\s*1\b|Book Overview/i },
  { num: 2, title: 'Unit 2: Friendship', desc: 'Bonding, compassion and camaraderie: The Unlikely Best Friends, A Friend’s Prayer, The Chair.', key: /friendship|unlikely\s+best\s+friends|friend'?s\s+prayer|the\s+chair|unit\s*2\b/i },
  { num: 4, title: 'Unit 4: Sports and Wellness', desc: 'Physical fitness, resilience and sportsmanship: Change of Heart, The Winner, Yoga — A Way of Life.', key: /sports\s+and\s+wellness|change\s+of\s+heart|the\s+winner|yoga|unit\s*4\b/i },
  { num: 3, title: 'Unit 3: Nurturing Nature', desc: 'Ecological appreciation and balance: Neem Baba, What a Bird Thought, Spices That Heal Us.', key: /nurturing\s+nature|neem\s+baba|what\s+a\s+bird\s+thought|spices\s+that\s+heal|unit\s*3\b/i },
  { num: 5, title: 'Unit 5: Culture and Tradition', desc: 'Indian heritage, craft and festivals: Hamara Bharat — Incredible India!, The Kites, Ila Sachani: Embroidering Dreams with her Feet.', key: /culture\s+and\s+tradition|hamara\s+bharat|the\s+kites|ila\s+sachani|unit\s*5\b/i },
].sort((a, b) => a.num - b.num);

// 5. HINDI
const hindiChapters = [
  { num: 1, title: 'मातृभूमि', desc: 'सोहनलाल द्विवेदी द्वारा रचित देशप्रेम और मातृभूमि के प्रति श्रद्धा की प्रेरणादायी कविता।', key: /मातृभूमि|matrubhumi|ch\s*1\b|पाठ\s*1\b|Book Overview/i },
  { num: 2, title: 'गोल', desc: 'मेजर ध्यानचंद के हॉकी जीवन के प्रेरक संस्मरण और अनुशासन का महत्व।', key: /गोल|gol|ch\s*2\b|पाठ\s*2\b/i },
  { num: 3, title: 'पहली बूँद', desc: 'वर्षा ऋतु के आगमन, धरती की तृप्ति और प्राकृतिक सौंदर्य पर आधारित कविता।', key: /पहली\s*बूँद|pahli\s*boond|ch\s*3\b|पाठ\s*3\b/i },
  { num: 4, title: 'हार की जीत', desc: 'सुदर्शन जी की सुप्रसिद्ध कहानी: बाबा भारती और डाकू खड्गसिंह का हृदय परिवर्तन।', key: /हार\s*की\s*जीत|haar\s*ki\s*jeet|ch\s*4\b|पाठ\s*4\b/i },
  { num: 5, title: 'रहीम के दोहे', desc: 'रहीम दास जी के नीतिपरक दोहे जो सदाचार, परोपकार और जीवन मूल्यों की शिक्षा देते हैं।', key: /रहीम\s*के\s*दोहे|rahim\s*ke\s*dohe|ch\s*5\b|पाठ\s*5\b/i },
  { num: 6, title: 'मेरी माँ', desc: 'रामप्रसाद बिस्मिल द्वारा अपनी माँ के स्नेह, त्याग और देशभक्ति के प्रति कृतज्ञता।', key: /मेरी\s*माँ|meri\s*maa|ch\s*6\b|पाठ\s*6\b/i },
  { num: 7, title: 'जलाते चलो', desc: 'द्वारिका प्रसाद माहेश्वरी की आशावादी कविता जो अज्ञानता और निराशा को दूर करने का संदेश देती है।', key: /जलाते\s*चलो|jalate\s*chalo|ch\s*7\b|पाठ\s*7\b/i },
  { num: 8, title: 'सत्रिया और बिहू नृत्य', desc: 'असम की समृद्ध लोक एवं शास्त्रीय नृत्य परम्परा का सजीव सांस्कृतिक परिचय।', key: /सत्रिया|बिहू|sattriya|bihu|ch\s*8\b|पाठ\s*8\b/i },
  { num: 9, title: 'मैया मैं नहिं माखन खायो', desc: 'सूरदास जी के वात्सल्य रस से परिपूर्ण बाल-कृष्ण और माता यशोदा के संवाद।', key: /माखन\s*खायो|makhan|ch\s*9\b|पाठ\s*9\b/i },
  { num: 10, title: 'परीक्षा', desc: 'प्रेमचंद जी की प्रसिद्ध कहानी: रियासत के दीवान पद के लिए सच्ची योग्यता और मानवीय परख।', key: /परीक्षा|pariksha|ch\s*10\b|पाठ\s*10\b/i },
  { num: 11, title: 'चेतक की वीरता', desc: 'श्याम नारायण पाण्डेय द्वारा रचित महाराणा प्रताप के स्वामिभक्त अश्व चेतक के शौर्य का वर्णन।', key: /चेतक|chetak|ch\s*11\b|पाठ\s*11\b/i },
  { num: 12, title: 'हिंद महासागर में छोटा-सा हिंदुस्तान', desc: 'मॉरीशस की यात्रा का रोचक वृत्तांत, भारतीय संस्कृति और प्रवासियों का जीवंत चित्रण।', key: /हिंद\s*महासागर|छोटा-सा\s*हिंदुस्तान|hind\s*mahasagar|ch\s*12\b|पाठ\s*12\b/i },
  { num: 13, title: 'पेड़ की बात', desc: 'जगदीश चंद्र बसु द्वारा पेड़-पौधों के जीवन, संवेदनशीलता और प्रकृति के साथ उनके जुड़ाव की वैज्ञानिक व्याख्या।', key: /पेड़\s*की\s*बात|ped\s*ki\s*baat|झाँकी\s*हिंदुस्तान\s*की|ch\s*13\b|पाठ\s*13\b/i },
];

// 6. SANSKRIT
const sanskritChapters = [
  { num: 1, title: 'वयं वर्णमालां पठामः', desc: 'संस्कृत वर्णमाला: स्वराः व्यञ्जनानि च, उच्चारण स्थानानि परिचयः।', key: /वर्णमालां\s*पठामः|varnmalam|ch\s*1\b|पाठ\s*1\b|Book Overview/i },
  { num: 2, title: 'संयुक्तव्यञ्जनानि', desc: 'संयुक्तव्यञ्जनानां प्रयोगः, वर्णसंयोगः वर्णवियोगः च। (Video status: Not available yet)', key: /संयुक्तव्यञ्जनानि|sanyukt/i },
  { num: 3, title: 'एषः कः ? एषा का ? एतत् किम् ?', desc: 'सर्वनामशब्दानाम् अभ्यासः, पुंल्लिङ्ग-स्त्रीलिङ्ग-नपुंसकलिङ्ग-प्रयोगाः।', key: /एषः\s*कः|एषा\s*का|एतत्\s*किम्|esah\s*kah|ch\s*2\b/i },
  { num: 4, title: 'अहं च त्वं च', desc: 'उत्तमपुरुष-मध्यमपुरुषयोः क्रियापदैः सह प्रयोगः, संवादाभ्यासः।', key: /अहं\s*च\s*त्वं\s*च|aham\s*ch\s*tvam|ch\s*3\b/i },
  { num: 5, title: 'सङ्ख्यागणना ननु सरला', desc: 'संस्कृते १ तः २० पर्यन्तं सङ्ख्यानां ज्ञानं, गणनाभ्यासः।', key: /सङ्ख्यागणना|संख्यागणना|sankhyaganana|ch\s*13\b/i },
  { num: 6, title: 'अहं प्रातः उत्तिष्ठामि', desc: 'दिनचर्या, प्रभातवेलायाः महत्वं, प्रथमपुरुषस्य क्रियापदानि।', key: /प्रातः\s*उत्तिष्ठामि|pratah\s*uttishthami|ch\s*4\b/i },
  { num: 7, title: 'शूराः वयं धीराः वयम्', desc: 'देशभक्तिपूर्णं बालगीतं, वयम् इति बहुवचनप्रयोगः।', key: /शूराः\s*वयं|धीराः\s*वयम्|shoora|shurah|ch\s*5\b/i },
  { num: 8, title: 'सः एव महान् चित्रकारः', desc: 'चित्रकला, पशुपक्षिणां वर्णना, कथामाध्यमेन शिक्षाम्।', key: /चित्रकारः|chitrakarah|ch\s*6\b/i },
  { num: 9, title: 'अतिथिदेवो भव', desc: 'भारतीयसंस्कृतेः अतिथि-सत्कार-परम्परा, आतिथ्यधर्मः।', key: /अतिथिदेवो\s*भव|atithidevo|ch\s*7\b/i },
  { num: 10, title: 'बुद्धिः सर्वार्थसाधिका', desc: 'चातुर्यकथा, बुद्धेः बलेन कठिनकार्याणां सिद्धिः।', key: /बुद्धिः\s*सर्वार्थसाधिका|buddhih|ch\s*8\b/i },
  { num: 11, title: 'यो जानाति सः पण्डितः', desc: 'प्रहेलिकाः (पहेलियाँ), बौद्धिकव्यायामः, सूक्तयः।', key: /यो\s*जानाति|यः\s*जानाति|पण्डितः|panditah|ch\s*9\b/i },
  { num: 12, title: 'त्वम् आपणं गच्छ', desc: 'विपणि-संवादः (बाजार में बातचीत), वस्तुक्रयणविक्रयणम्।', key: /आपणं\s*गच्छ|aapanam|ch\s*10\b/i },
  { num: 13, title: 'पृथिव्यां त्रीणि रत्नानि', desc: 'सुभाषितानि: जलम्, अन्नम्, सुभाषितम् इति त्रिरत्नमहत्वम्।', key: /पृथिव्यां\s*त्रीणि\s*रत्नानि|pruthivyam|ch\s*11\b/i },
  { num: 14, title: 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः', desc: 'उद्यमस्य (परिश्रमस्य) प्रशंसा, आलस्यत्यागस्य प्रेरणा।', key: /आलस्यं\s*हि|aalasyam|ch\s*12\b/i },
  { num: 15, title: 'माधवस्य प्रियम् अङ्गम्', desc: 'शरीरस्य अङ्गानां नामानि, तेषां कार्याणि सार्थकता च।', key: /माधवस्य\s*प्रियम्|madhavasya|ch\s*14\b/i },
  { num: 16, title: 'वृक्षाः सत्पुरुषाः इव', desc: 'परोपकारस्य संदेशः, वृक्षाणां छाया-फल-काष्ठ-दानशीलता।', key: /वृक्षाः\s*सत्पुरुषाः|vrukshah|ch\s*15\b/i },
];

const globalSeenVideos = new Set();

function buildSubjectTree(subjectName, bookName, code, icon, color, chaptersDef, rawVideos, sourceCourse) {
  // Sort chapters by specific key matching order
  const chapters = chaptersDef.map((def) => {
    const matchedVideos = [];

    rawVideos.forEach((v) => {
      // Exclude contamination
      if (/Class 8|Diversity and Discrimination|Women, Caste/i.test(v.title)) return;
      if (globalSeenVideos.has(v.youtubeVideoId)) return;

      if (def.key.test(v.title)) {
        globalSeenVideos.add(v.youtubeVideoId);
        matchedVideos.push(v);
      }
    });

    const isAvailable = matchedVideos.length > 0;

    // Group into topics
    const topicMap = new Map();
    matchedVideos.forEach((v, vIdx) => {
      const topicName = classifyTopic(v.title);
      if (!topicMap.has(topicName)) {
        topicMap.set(topicName, []);
      }
      topicMap.get(topicName).push({
        ...v,
        cleanTitle: cleanTitle(v.title),
        order: vIdx + 1,
        isRecommended: vIdx === 0, // First video in topic recommended
        sourceCourse,
        academicYear: '2026-27',
      });
    });

    const topics = [];
    let tOrder = 1;
    for (const [tName, tVideos] of topicMap.entries()) {
      topics.push({
        name: tName,
        order: tOrder++,
        videos: tVideos,
      });
    }

    if (topics.length === 0) {
      topics.push({
        name: 'Curriculum Foundations',
        order: 1,
        videos: [],
      });
    }

    return {
      chapterNumber: def.num,
      title: def.title,
      theme: def.theme || null,
      description: def.desc,
      order: def.num,
      isAvailable,
      topics,
      allVideos: matchedVideos,
    };
  });

  return {
    name: subjectName,
    bookName,
    code,
    icon,
    color,
    description: `Current NCERT 2026–27 curriculum for Class 6 ${subjectName} (${bookName}). Video lessons by Magnet Brains Updated Course.`,
    chapters,
  };
}

const subjects = [
  buildSubjectTree('Mathematics', 'Ganita Prakash', 'MATH-6', 'calculator', '#2E7D4E', mathChapters, raw.Mathematics, 'Class 6th Maths NCERT (Ganita Prakash Book) CBSE – Updated Course'),
  buildSubjectTree('Science', 'Curiosity', 'SCI-6', 'microscope', '#1B4D2F', scienceChapters, raw.Science, 'Class 6th Science NCERT (Curiosity Book) CBSE – Updated Course'),
  buildSubjectTree('Social Science', 'Exploring Society: India and Beyond', 'SST-6', 'globe', '#2E7D4E', sstChapters, raw['Social Science'], 'Class 6th Social Science NCERT (Exploring Society India and Beyond) CBSE – Updated Course'),
  buildSubjectTree('English', 'Poorvi', 'ENG-6', 'languages', '#8C6013', englishUnits, raw.English, 'Class 6th English NCERT (Poorvi Book) CBSE – Updated Course'),
  buildSubjectTree('Hindi', 'Malhar', 'HIN-6', 'book-open', '#18261E', hindiChapters, raw.Hindi, 'Class 6th Hindi NCERT (Malhar Book) CBSE – Updated Course'),
  buildSubjectTree('Sanskrit', 'Deepakam', 'SKT-6', 'award', '#D97706', sanskritChapters, raw.Sanskrit, 'Class 6th Sanskrit NCERT (Deepakam Book) CBSE – Updated Course'),
];

// Write file
const outputCode = `// Generated Class 6 NCERT 2026-27 & Magnet Brains Curriculum Dataset
export const class6CurriculumData = ${JSON.stringify(subjects, null, 2)};
`;

fs.writeFileSync('scripts/class6Data.mjs', outputCode);
console.log('Successfully generated scripts/class6Data.mjs with ZERO duplicates!');

// Print summary
let totalVideos = 0;
let totalChapters = 0;
subjects.forEach((s) => {
  totalChapters += s.chapters.length;
  const vCount = s.chapters.reduce((acc, c) => acc + c.allVideos.length, 0);
  totalVideos += vCount;
  console.log(`${s.name} (${s.bookName}): ${s.chapters.length} chapters, ${vCount} unique videos`);
});
console.log(`TOTAL: 6 Subjects, ${totalChapters} Chapters, ${totalVideos} Videos (0 duplicates guaranteed)`);
