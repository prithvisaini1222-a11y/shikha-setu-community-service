import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SANSKRIT_DATA = {
  7: {
    bookName: 'NCERT रुचिरा (द्वितीयो भागः)',
    chapters: [
      'सुभाषितानि',
      'दुर्बुद्धिः विनश्यति',
      'स्वावलम्बनम्',
      'पण्डिता रमाबाई',
      'सदाचारः',
      'सङ्कल्पः सिद्धिदायकः',
      'त्रिवर्णः ध्वजः',
      'अहह आः च',
      'विश्वबन्धुत्वम्',
      'समवायो हि दुर्जयः'
    ]
  },
  8: {
    bookName: 'NCERT रुचिरा (तृतीयो भागः)',
    chapters: [
      'सुभाषितानि',
      'बिलस्य वाणी न कदापि मे श्रुता',
      'डिजीभारतम्',
      'सदैव पुरतो निधेहि चरणम्',
      'कण्टकेनैव कण्टकम्',
      'गृहं शून्यं सुतां विना',
      'भारतजनताऽहम्',
      'संसारसागरस्य नायकाः',
      'सप्तभगिन्यः',
      'नीतिनवनीतम्'
    ]
  },
  9: {
    bookName: 'NCERT शेमुषी (प्रथमो भागः)',
    chapters: [
      'भारतीवसन्तगीतिः',
      'स्वर्णकाकः',
      'गोदोहनम्',
      'कल्पतरुः',
      'सूक्तिमौक्तिकम्',
      'भ्रान्तो बालः',
      'प्रत्यभिज्ञानम्',
      'सिकतासेतुः',
      'जटायोः शौर्यम्',
      'पर्यावरणम्'
    ]
  },
  10: {
    bookName: 'NCERT शेमुषी (द्वितीयो भागः)',
    chapters: [
      'शुचिपर्यावरणम्',
      'बुद्धिर्बलवती सदा',
      'शिशुलालनम्',
      'जननी तुल्यवत्सला',
      'सुभाषितानि',
      'सौहार्दं प्रकृतेः शोभा',
      'विचित्रः साक्षी',
      'सूक्तयः',
      'भूकम्पविभीषिका',
      'अन्योक्तयः'
    ]
  }
};

async function main() {
  for (const [classNumStr, data] of Object.entries(SANSKRIT_DATA)) {
    const classNum = parseInt(classNumStr, 10);
    const cls = await prisma.class.findUnique({ where: { classNumber: classNum } });
    if (!cls) continue;

    const code = `SKT-${classNum}`;
    let subject = await prisma.subject.findFirst({
      where: { classId: cls.id, code }
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          classId: cls.id,
          name: 'Sanskrit',
          code,
          bookName: data.bookName,
          order: 6,
          color: '#B45309',
          description: 'संस्कृत भाषा, व्याकरण, श्लोक वाचन एवं नैतिक शिक्षा।'
        }
      });
      console.log(`Created Sanskrit for Class ${classNum}`);
    }

    for (let i = 0; i < data.chapters.length; i++) {
      const chNum = i + 1;
      const chTitle = data.chapters[i];
      let chapter = await prisma.chapter.findFirst({
        where: { subjectId: subject.id, chapterNumber: chNum }
      });

      if (!chapter) {
        chapter = await prisma.chapter.create({
          data: {
            subjectId: subject.id,
            chapterNumber: chNum,
            title: chTitle,
            order: chNum,
            description: `NCERT Class ${classNum} Sanskrit Chapter ${chNum}: ${chTitle}`
          }
        });
      }

      // Check lessons
      const lessonCount = await prisma.lesson.count({ where: { chapterId: chapter.id } });
      if (lessonCount === 0) {
        await prisma.lesson.create({
          data: {
            chapterId: chapter.id,
            lessonNumber: 1,
            title: `${chTitle} — पाठ परिचय एवं श्लोक गायन (Magnet Brains)`,
            durationMinutes: 20,
            videoUrl: 'https://www.youtube-nocookie.com/embed/n9E35nlfVKs',
            videoSource: 'Magnet Brains'
          }
        });
      }
    }
  }
  console.log('Sanskrit verified for all classes!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
