import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { class6CurriculumData } from './class6Data.mjs';
import {
  class7CurriculumDef,
  class8CurriculumDef,
  class9CurriculumDef,
  class10CurriculumDef,
  detectLectureType,
  rawVideos
} from './compile_all_classes_dataset.mjs';

const prisma = new PrismaClient();

// Enhance Class 7 Sanskrit with Appendices
const s7Skt = class7CurriculumDef.find(s => s.code === 'SKT-7');
if (s7Skt) {
  if (!s7Skt.chapters.find(c => c.num === 13)) {
    s7Skt.chapters.push(
      { num: 13, title: 'अतिरिक्तम् अध्ययनम् (वर्णमात्रा परिचयः)', desc: 'वर्णमात्रा परिचयः, स्वराः व्यञ्जनानि च।', key: /अतिरिक्तम्|additional\s*study|वर्णमात्रा|ch\s*13\b/i },
      { num: 14, title: 'परिशिष्टम् १ - शब्दरूपाणि (व्याकरणम्)', desc: 'संस्कृतव्याकरणम्, अकारान्त-आकारान्त-पुंल्लिङ्ग-स्त्रीलिङ्ग-शब्दरूपाणि।', key: /शब्दरूपाणि|परिशिष्‍टम्\s*१|ch\s*14\b/i },
      { num: 15, title: 'परिशिष्टम् २ - धातुरूपाणि (व्याकरणम्)', desc: 'लट्लकारः, लृट्लकारः, लङ्लकारः, धातुरूपाणां परिचयः।', key: /धातुरूपाणि|परिशिष्‍टम्\s*२|ch\s*15\b/i }
    );
  }
}

// Enhance Class 8 Sanskrit with Deepakam chapters
const s8Skt = class8CurriculumDef.find(s => s.code === 'SKT-8');
if (s8Skt) {
  const ch4 = s8Skt.chapters.find(c => c.num === 4);
  if (ch4) {
    ch4.key = /गोपबन्धु|gopabandhu|revered\s*patriot|friend\s*of\s*the\s*cowherds/i;
  }

  if (!s8Skt.chapters.find(c => c.num === 11)) {
    s8Skt.chapters.push(
      { num: 11, title: 'सम्यग्वर्णप्रयोगेण ब्रह्मलोके महीयते', desc: 'पाणिनीयशिक्षा, वर्णोच्चारणमहत्वम्, संस्कृतध्वनिविज्ञानम्।', key: /सम्यग्वर्णप्रयोगेण|samyagvarna|ch\s*11\b|ch\s*12\b/i },
      { num: 12, title: 'वर्णोच्चारण-शिक्षा', desc: 'उच्चारणस्थानानि, कण्ठ्य, तालव्य, मूर्धन्य, दन्त्य, ओष्ठ्य वर्णविचाराः।', key: /वर्णोच्चारण|varnoccharan|ch\s*13\b/i },
      { num: 13, title: 'परिशिष्टम् (व्याकरणम्, शब्दरूपाणि, धातुरूपाणि)', desc: 'संस्कृत-व्याकरण-परिशिष्टम्, शब्दरूपाणि धातुरूपाणि च।', key: /परिशिष्‍टम्|व्याकरणम्|शब्दरूपाणि|धातुरूपाणि/i }
    );
  }
}

// Class 9 Hindi Course B definition
const hindiCourseB9 = {
  name: 'Hindi (Course B)',
  code: 'HIN-9B',
  bookName: 'Sparsh & Sanchayan (Course B)',
  icon: 'languages',
  color: '#EF4444',
  description: 'Official CBSE 2026–27 Secondary curriculum for Class 9 Hindi Course B (Sparsh & Sanchayan).',
  chapters: [
    { num: 1, title: 'दुःख का अधिकार (यशपाल)', desc: 'यशपाल की प्रसिद्ध कहानी: समाज में गरीबों की बेबसी, शोक मनाने का अधिकार और संवेदनहीनता।', key: /dukh\s*ka\s*adhikar|दुःख\s*का\s*अधिकार|ch\s*1\b/i },
    { num: 2, title: 'एवरेस्ट: मेरी शिखर यात्रा (बछेंद्री पाल)', desc: 'बछेंद्री पाल का रोमांचक यात्रा-वृत्तांत: एवरेस्ट विजय की प्रथम भारतीय महिला की संघर्षगाथा।', key: /everest|meri\s*shikhar\s*yatra|बछेंद्री\s*पाल|ch\s*2\b/i },
    { num: 3, title: 'वैज्ञानिक चेतना के वाहक चंद्रशेखर वेंकट रामन', desc: 'धर्मवीर भारती द्वारा नोबेल पुरस्कार विजेता सी.वी. रामन के वैज्ञानिक अनुसंधानों का वर्णन।', key: /vaigyanik\s*chetna|chandrasekhara|venkata\s*raman|रामन|ch\s*3\b/i },
    { num: 4, title: 'शुक़्रतारे के समान (स्वामी आनंद)', desc: 'महादेव भाई देसाई की प्रतिभा, कर्मठता और गांधी जी के सहयोगी के रूप में समर्पण।', key: /shukr\s*taare|शुक़्रतारे|ch\s*4\b/i },
    { num: 5, title: 'रैदास के पद', desc: 'संत रैदास के प्रभु-भक्ति और समर्पण से ओत-प्रोत पद: अब कैसे छूटे राम नाम रट लागी।', key: /raidas|रैदास|ch\s*5\b/i },
    { num: 6, title: 'दोहे (रहीम)', desc: 'रहीम के नीतिपरक दोहे: प्रेम का धागा, विपत्ति की कसौटी और लोक-व्यवहार की शिक्षा।', key: /dohe|दोहे|rahim|रहीम|ch\s*6\b/i },
    { num: 7, title: 'गीत-अगीत (रामधारी सिंह ‘दिनकर’)', desc: 'प्रकृति के मुखर और मौन प्रेम की तुलना: क्या गाकर प्रेम प्रकट करने वाला गीत सुंदर है या मौन अगीत।', key: /geet\s*ageet|गीत[- ]अगीत|दिनकर|ch\s*7\b/i },
    { num: 8, title: 'अग्नि पथ (हरिवंश राय बच्चन)', desc: 'संघर्षशील जीवन का प्रेरणादायक आह्वान: तू न थकेगा कभी, तू न थमेगा कभी।', key: /agnipath|अग्नि\s*पथ|बच्चन|ch\s*8\b/i },
    { num: 9, title: 'नए इलाके में / खुशबू रचते हैं हाथ (अरुण कमल)', desc: 'बदलते शहर की भूलभुलैया और गंदगी में रहकर सुगंध फैलाने वाले अगरबत्ती कारीगरों की व्यथा।', key: /naye\s*ilake|khushboo\s*rachte|अरुण\s*कमल|ch\s*9\b/i },
    { num: 10, title: 'आदमी नामा (नज़ीर अकबराबादी)', desc: 'मानव जीवन के विविध रूपों, अच्छाइयों और बुराइयों का दार्शनिक और यथार्थवादी चित्रण।', key: /aadmi\s*nama|आदमी\s*नामा|नज़ीर|ch\s*10\b/i },
    { num: 11, title: 'कल्लू कुम्हार की उनाकोटी (के. विक्रम सिंह)', desc: 'त्रिपुरा की प्राकृतिक छटा, लोक-संस्कृति, उनाकोटी की रहस्यमयी मूर्तियों का यात्रा-वृत्तांत।', key: /kullu\s*kumhar|उनाकोटी|ch\s*11\b/i },
    { num: 12, title: 'मेरा छोटा-सा निजी पुस्तकालय (धर्मवीर भारती)', desc: 'पुस्तकों के प्रति अगाध प्रेम, ज्ञान-पिपासा और पुस्तकों से मिले नए जीवन का संस्मरण।', key: /chota\s*sa\s*niji|pustak[a]?lay|पुस्तकालय|ch\s*12\b/i },
    { num: 13, title: 'CBSE Sample Question Papers & Exam Practice', desc: 'बोर्ड परीक्षा अभ्यास प्रश्न पत्र, मॉडल उत्तर और संपूर्ण पाठ्यक्रम पुनरावृत्ति।', key: /sample\s*paper|exam\s*practice|board\s*questions/i }
  ]
};

// Outdated/dropped chapters in Class 9 Hindi Course A
const h9A = class9CurriculumDef.find(s => s.code === 'HIN-9');
if (h9A) {
  if (!h9A.chapters.find(c => c.num === 14)) {
    h9A.chapters.push(
      { num: 14, title: 'चंद्र गहना से लौटती बेर (केदारनाथ अग्रवाल) [Rationalized/Supplementary]', desc: 'खेत की मेड़ पर बैठकर प्राकृतिक सौंदर्य का सूक्ष्म और सजीव अवलोकन। (NCERT पूर्व संस्करण)।', key: /chandra\s*gehna|चंद्र\s*गहना/i, isRationalized: true },
      { num: 15, title: 'यमराज की दिशा (चंद्रकांत देवताले) [Rationalized/Supplementary]', desc: 'मां की चेतावनी, चारों दिशाओं में फैलती विध्वंसक सभ्यता और भय का यथार्थ। (NCERT पूर्व संस्करण)।', key: /yamraj\s*ki\s*disha|यमराज\s*की\s*दिशा/i, isRationalized: true }
    );
  }
}

// Outdated/dropped chapters in Class 10 Hindi Course A
const h10A = class10CurriculumDef.find(s => s.code === 'HIN-10');
if (h10A) {
  if (!h10A.chapters.find(c => c.num === 12)) {
    h10A.chapters.push(
      { num: 12, title: 'मानवीय करुणा की दिव्य चमक (सर्वेश्वर दयाल सक्सेना) [Rationalized/Supplementary]', desc: 'फादर कामिल बुल्के के स्नेहिल व्यक्तित्व, हिंदी-प्रेम और करुणा का संस्मरण।', key: /manviya\s*karuna|मानवीय\s*करुणा/i, isRationalized: true },
      { num: 13, title: 'स्त्री शिक्षा के विरोधी कुतर्कों का खंडन (महावीर प्रसाद द्विवेदी) [Rationalized/Supplementary]', desc: 'प्राचीन विदुषियों के उदाहरणों द्वारा नारी शिक्षा के महत्व का अकाट्य प्रतिपादन।', key: /stri\s*shiksha|opposing\s*women'?s?\s*education|स्त्री\s*शिक्षा/i, isRationalized: true }
    );
  }
}

// Outdated/dropped chapter in Class 10 Sanskrit
const s10Skt = class10CurriculumDef.find(s => s.code === 'SKT-10');
if (s10Skt) {
  if (!s10Skt.chapters.find(c => c.num === 11)) {
    s10Skt.chapters.push(
      { num: 11, title: 'प्राणेभ्योऽपि प्रियः सुहृद् [Rationalized/Supplementary]', desc: 'मुद्राराक्षसम् नाटकात्: चाणक्य-चन्दनदासयोः संवादः, मित्ररक्षार्थं प्राणोत्सर्गः। (NCERT पूर्व संस्करण)।', key: /pranebhyoapi|प्राणेभ्योऽपि/i, isRationalized: true }
    );
  }
}

const curriculumDefinitions = {
  7: class7CurriculumDef,
  8: class8CurriculumDef,
  9: [...class9CurriculumDef, hindiCourseB9],
  10: class10CurriculumDef
};

export {
  curriculumDefinitions,
  detectLectureType,
  rawVideos,
  class6CurriculumData
};

