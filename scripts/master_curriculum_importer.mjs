import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import {
  curriculumDefinitions,
  detectLectureType,
  rawVideos,
  class6CurriculumData
} from './generate_all_curriculum.mjs';

const prisma = new PrismaClient();

async function main() {
  console.log('================================================================');
  console.log('  SHIKSHASETU — MASTER CURRICULUM & VIDEO DATABASE IMPORTER');
  console.log('  Curriculum Baseline: CBSE / NCERT 2026–27 (Classes 6–10)');
  console.log('================================================================\n');

  // Step 1: Ensure all classes 6 to 10 exist
  const classTitles = {
    6: 'Class 6 - Middle School Foundation',
    7: 'Class 7 - Middle School Development',
    8: 'Class 8 - Middle School Capstone',
    9: 'Class 9 - Secondary School Foundation',
    10: 'Class 10 - Secondary School Board Preparation'
  };

  const classDescriptions = {
    6: 'NCERT 2026–27 NEP aligned middle school curriculum: Ganita Prakash, Curiosity, Exploring Society, Poorvi, Malhar, Deepakam.',
    7: 'NCERT 2026–27 NEP aligned middle school curriculum: Ganita Prakash, Curiosity, Exploring Society, Poorvi, Malhar, Deepakam.',
    8: 'NCERT 2026–27 NEP aligned middle school curriculum: Ganita Prakash (Parts 1 & 2), Curiosity, Exploring Society, Poorvi, Malhar, Deepakam.',
    9: 'CBSE 2026–27 Secondary curriculum: NCERT Mathematics, Science, Social Science, Beehive & Moments, Kshitij & Kritika, Sparsh & Sanchayan, Shemushi.',
    10: 'CBSE 2026–27 Secondary Board curriculum: NCERT Mathematics (Standard & Basic), Science, Social Science, First Flight, Kshitij 2, Shemushi 2.'
  };

  const classMap = {};
  for (let c = 6; c <= 10; c++) {
    const rec = await prisma.class.upsert({
      where: { classNumber: c },
      update: {
        title: classTitles[c],
        description: classDescriptions[c],
      },
      create: {
        classNumber: c,
        title: classTitles[c],
        description: classDescriptions[c],
      },
    });
    classMap[c] = rec;
    console.log(`✓ Verified Class ${c} (ID: ${rec.id})`);
  }

  // Step 2: Import / Update Class 6 from class6CurriculumData
  console.log('\n--- Processing Class 6 Curriculum & Videos ---');
  let class6VideoCount = 0;
  for (let sIdx = 0; sIdx < class6CurriculumData.length; sIdx++) {
    const subData = class6CurriculumData[sIdx];
    const subject = await prisma.subject.upsert({
      where: {
        classId_code: {
          classId: classMap[6].id,
          code: subData.code,
        },
      },
      update: {
        name: subData.name,
        bookName: subData.bookName,
        order: sIdx + 1,
        icon: subData.icon,
        color: subData.color,
        description: subData.description,
        academicSession: '2026-27',
        board: 'CBSE / NCERT',
        medium: 'English / Hindi',
        textbookEdition: '2026-27',
      },
      create: {
        classId: classMap[6].id,
        name: subData.name,
        code: subData.code,
        bookName: subData.bookName,
        order: sIdx + 1,
        icon: subData.icon,
        color: subData.color,
        description: subData.description,
        academicSession: '2026-27',
        board: 'CBSE / NCERT',
        medium: 'English / Hindi',
        textbookEdition: '2026-27',
      },
    });

    for (const chData of subData.chapters) {
      let chapter = await prisma.chapter.findFirst({
        where: { subjectId: subject.id, chapterNumber: chData.chapterNumber },
      });
      if (chapter) {
        chapter = await prisma.chapter.update({
          where: { id: chapter.id },
          data: {
            title: chData.title,
            theme: chData.theme || null,
            order: chData.order,
            description: chData.description,
            academicSession: '2026-27',
            board: 'CBSE / NCERT',
            medium: 'English / Hindi',
            textbookName: subData.bookName,
            textbookEdition: '2026-27',
            officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            syllabusStatus: 'CURRENT_2026_27',
          },
        });
      } else {
        chapter = await prisma.chapter.create({
          data: {
            subjectId: subject.id,
            chapterNumber: chData.chapterNumber,
            title: chData.title,
            theme: chData.theme || null,
            order: chData.order,
            description: chData.description,
            academicSession: '2026-27',
            board: 'CBSE / NCERT',
            medium: 'English / Hindi',
            textbookName: subData.bookName,
            textbookEdition: '2026-27',
            officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            syllabusStatus: 'CURRENT_2026_27',
          },
        });
      }

      let lessonSeq = 1;
      for (const topData of chData.topics || []) {
        let topic = await prisma.topic.findFirst({
          where: { chapterId: chapter.id, name: topData.name },
        });
        if (topic) {
          topic = await prisma.topic.update({
            where: { id: topic.id },
            data: {
              order: topData.order,
              syllabusStatus: 'CURRENT_2026_27',
              officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            },
          });
        } else {
          topic = await prisma.topic.create({
            data: {
              chapterId: chapter.id,
              name: topData.name,
              order: topData.order,
              description: `${subData.name} - ${chapter.title} - ${topData.name}`,
              syllabusStatus: 'CURRENT_2026_27',
              officialSourceUrl: 'https://ncert.nic.in/textbook.php',
            },
          });
        }

        for (const vidData of topData.videos || []) {
          if (!vidData.youtubeVideoId) continue;
          class6VideoCount++;
          const lType = detectLectureType(vidData.title);

          await prisma.learningVideo.upsert({
            where: { youtubeVideoId: vidData.youtubeVideoId },
            update: {
              topicId: topic.id,
              chapterId: chapter.id,
              youtubeUrl: vidData.youtubeUrl,
              title: vidData.cleanTitle || vidData.title,
              channelName: 'Magnet Brains',
              thumbnailUrl: vidData.thumbnailUrl,
              description: vidData.title,
              source: 'Magnet Brains',
              sourceCourse: vidData.sourceCourse,
              academicYear: '2026-27',
              lectureType: lType,
              mappingStatus: 'VERIFIED',
              mappingConfidence: 100.0,
              textbookName: subData.bookName,
              textbookEdition: '2026-27',
              officialSourceUrl: 'https://ncert.nic.in/textbook.php',
              syllabusStatus: 'CURRENT_2026_27',
              order: vidData.order || 1,
              videoStatus: 'AVAILABLE',
              duration: vidData.duration,
              durationSeconds: vidData.durationSeconds,
              isRecommended: vidData.isRecommended || false,
              isApproved: true,
            },
            create: {
              youtubeVideoId: vidData.youtubeVideoId,
              topicId: topic.id,
              chapterId: chapter.id,
              youtubeUrl: vidData.youtubeUrl,
              title: vidData.cleanTitle || vidData.title,
              channelName: 'Magnet Brains',
              thumbnailUrl: vidData.thumbnailUrl,
              description: vidData.title,
              source: 'Magnet Brains',
              sourceCourse: vidData.sourceCourse,
              academicYear: '2026-27',
              lectureType: lType,
              mappingStatus: 'VERIFIED',
              mappingConfidence: 100.0,
              textbookName: subData.bookName,
              textbookEdition: '2026-27',
              officialSourceUrl: 'https://ncert.nic.in/textbook.php',
              syllabusStatus: 'CURRENT_2026_27',
              order: vidData.order || 1,
              videoStatus: 'AVAILABLE',
              duration: vidData.duration,
              durationSeconds: vidData.durationSeconds,
              isRecommended: vidData.isRecommended || false,
              isApproved: true,
            },
          });

          // Ensure Lesson record
          const existingLesson = await prisma.lesson.findFirst({
            where: { chapterId: chapter.id, videoUrl: vidData.youtubeUrl },
          });
          const durMin = Math.max(1, Math.round(vidData.durationSeconds / 60));
          if (existingLesson) {
            await prisma.lesson.update({
              where: { id: existingLesson.id },
              data: {
                topicId: topic.id,
                title: vidData.cleanTitle || vidData.title,
                durationMinutes: durMin,
                lectureType: lType,
                mappingStatus: 'VERIFIED',
                isPublished: true,
              },
            });
          } else {
            await prisma.lesson.create({
              data: {
                chapterId: chapter.id,
                topicId: topic.id,
                title: vidData.cleanTitle || vidData.title,
                lessonNumber: lessonSeq++,
                durationMinutes: durMin,
                videoUrl: vidData.youtubeUrl,
                videoSource: 'Magnet Brains',
                lectureType: lType,
                mappingStatus: 'VERIFIED',
                isPublished: true,
              },
            });
          }
        }
      }
    }
  }
  console.log(`✓ Processed Class 6 (${class6VideoCount} videos synced)`);

  // Step 3: Create / Upsert Subjects & Chapters for Classes 7, 8, 9, 10
  console.log('\n--- Upserting Subjects & Chapters for Classes 7, 8, 9, 10 ---');
  const subjectRecords = {}; // key: `${classNum}-${subDef.code}`
  const chapterRecords = {}; // key: `${classNum}-${subDef.code}-${chDef.num}`

  for (const cNum of [7, 8, 9, 10]) {
    const subDefs = curriculumDefinitions[cNum];
    for (let sIdx = 0; sIdx < subDefs.length; sIdx++) {
      const sDef = subDefs[sIdx];
      const subRec = await prisma.subject.upsert({
        where: {
          classId_code: {
            classId: classMap[cNum].id,
            code: sDef.code,
          },
        },
        update: {
          name: sDef.name,
          bookName: sDef.bookName,
          order: sIdx + 1,
          icon: sDef.icon,
          color: sDef.color,
          description: sDef.description,
          academicSession: '2026-27',
          board: 'CBSE / NCERT',
          medium: 'English / Hindi',
          textbookEdition: '2026-27',
        },
        create: {
          classId: classMap[cNum].id,
          name: sDef.name,
          code: sDef.code,
          bookName: sDef.bookName,
          order: sIdx + 1,
          icon: sDef.icon,
          color: sDef.color,
          description: sDef.description,
          academicSession: '2026-27',
          board: 'CBSE / NCERT',
          medium: 'English / Hindi',
          textbookEdition: '2026-27',
        },
      });
      subjectRecords[`${cNum}-${sDef.code}`] = subRec;

      for (let chIdx = 0; chIdx < sDef.chapters.length; chIdx++) {
        const chDef = sDef.chapters[chIdx];
        let chRec = await prisma.chapter.findFirst({
          where: { subjectId: subRec.id, chapterNumber: chDef.num },
        });

        const sylStatus = chDef.isRationalized ? 'PREVIOUS_EDITION' : 'CURRENT_2026_27';

        if (chRec) {
          chRec = await prisma.chapter.update({
            where: { id: chRec.id },
            data: {
              title: chDef.title,
              theme: chDef.theme || null,
              order: chIdx + 1,
              description: chDef.desc,
              academicSession: '2026-27',
              board: 'CBSE / NCERT',
              medium: 'English / Hindi',
              textbookName: sDef.bookName,
              textbookEdition: '2026-27',
              officialSourceUrl: 'https://ncert.nic.in/textbook.php',
              syllabusStatus: sylStatus,
            },
          });
        } else {
          chRec = await prisma.chapter.create({
            data: {
              subjectId: subRec.id,
              chapterNumber: chDef.num,
              title: chDef.title,
              theme: chDef.theme || null,
              order: chIdx + 1,
              description: chDef.desc,
              academicSession: '2026-27',
              board: 'CBSE / NCERT',
              medium: 'English / Hindi',
              textbookName: sDef.bookName,
              textbookEdition: '2026-27',
              officialSourceUrl: 'https://ncert.nic.in/textbook.php',
              syllabusStatus: sylStatus,
            },
          });
        }
        chapterRecords[`${cNum}-${sDef.code}-${chDef.num}`] = chRec;
      }
    }
  }
  console.log(`✓ Upserted all subjects & chapters across Classes 7–10.`);

  // Step 4: Map and Import all 2,171 raw videos for Classes 7, 8, 9, 10
  console.log('\n--- Mapping and Upserting 2,171 Videos for Classes 7–10 ---');
  let matchedVideoCount = 0;
  const topicCache = {}; // key: `${chapterId}-${topicName}`
  const allMappedRecords = [];
  const unmatchedList = [];

  for (let i = 0; i < rawVideos.length; i++) {
    const v = rawVideos[i];
    let targetClass = v.classNum;
    let targetSubjectName = v.subject;
    const fullText = (v.title + ' ' + (v.rawLabel || '')).replace(/\\\\u0026/g, '&').replace(/\\u0026/g, '&');

    // Cross-subject / Course variant detection
    if (/class\s*10\s*maths?/i.test(fullText)) {
      targetSubjectName = 'Mathematics';
      targetClass = 10;
    } else if (/class\s*8\s*social\s*science|electoral\s*system|parliamentary\s*system/i.test(fullText)) {
      targetSubjectName = 'Social Science';
      targetClass = 8;
    } else if (/class\s*10\s*history|age\s*of\s*industrialisation/i.test(fullText)) {
      targetSubjectName = 'Social Science';
      targetClass = 10;
    } else if (/class\s*10\s*(?:physics|chemistry|biology)/i.test(fullText)) {
      targetSubjectName = 'Science';
      targetClass = 10;
    } else if (/class\s*9\s*hindi\s*\(course\s*b\)|sparsh|sanchayan|dukh\s*ka\s*adhikar|everest.*shikhar|vaigyanik\s*chetna|shukr\s*taare|raidas|dohe.*bhavarth|aadmi\s*nama|geet\s*ageet|agnipath|naye\s*ilake|kullu\s*kumhar|chota\s*sa\s*niji/i.test(fullText)) {
      targetSubjectName = 'Hindi (Course B)';
      targetClass = 9;
    }

    const cDefs = curriculumDefinitions[targetClass];
    let subDef = cDefs?.find(s => s.name.toLowerCase() === targetSubjectName.toLowerCase());
    if (!subDef) {
      subDef = cDefs?.find(s => s.name.toLowerCase().includes(targetSubjectName.toLowerCase()) || targetSubjectName.toLowerCase().includes(s.name.toLowerCase()));
    }

    if (!subDef) {
      unmatchedList.push({ v, reason: 'No subject match: ' + targetSubjectName });
      continue;
    }

    let matchedChapter = null;

    // 1. Try regex key match
    for (const c of subDef.chapters) {
      if (c.key && c.key.test(fullText)) {
        matchedChapter = c;
        break;
      }
    }

    // 2. Try explicit chapter number
    if (!matchedChapter) {
      const chNumMatch = fullText.match(/(?:chapter|ch|chaapter|cha|पाठ)\s*([0-9]{1,2})\b/i);
      if (chNumMatch) {
        const chNum = parseInt(chNumMatch[1], 10);
        matchedChapter = subDef.chapters.find(c => c.num === chNum);
      }
    }

    // 3. Try title keyword match
    if (!matchedChapter) {
      for (const c of subDef.chapters) {
        const cleanTitleWords = c.title.toLowerCase().split(/[\s,–—:\-()]+/).filter(w => w.length > 3);
        const hits = cleanTitleWords.filter(w => fullText.toLowerCase().includes(w));
        if (hits.length >= 2 || (cleanTitleWords.length === 1 && hits.length === 1)) {
          matchedChapter = c;
          break;
        }
      }
    }

    // 4. Fallback for book overview / strategy
    if (!matchedChapter && /book\s*overview|complete\s*strategy|session\s*20/i.test(fullText)) {
      matchedChapter = subDef.chapters[0];
    }

    // 5. Special fallback for Light/Acids terms in Class 10 Physics/Chemistry
    if (!matchedChapter && targetClass === 10 && subDef.name === 'Science') {
      if (/light|mirror|lens|refract/i.test(fullText)) {
        matchedChapter = subDef.chapters.find(c => c.num === 9);
      } else if (/acid|base|salt/i.test(fullText)) {
        matchedChapter = subDef.chapters.find(c => c.num === 2);
      }
    }

    if (!matchedChapter) {
      unmatchedList.push({ v, reason: 'No chapter match in ' + subDef.name });
      continue;
    }

    const chapterRecord = chapterRecords[`${targetClass}-${subDef.code}-${matchedChapter.num}`];
    if (!chapterRecord) {
      unmatchedList.push({ v, reason: 'Chapter DB record not found' });
      continue;
    }

    matchedVideoCount++;
    const lType = detectLectureType(v.title);

    // Determine Topic Name
    let topicName = 'Concept Lectures & Topic Explanations';
    let topicOrder = 2;
    if (lType === 'Chapter Introduction' || /overview|introduction/i.test(v.title)) {
      topicName = 'Chapter Overview & Introduction';
      topicOrder = 1;
    } else if (lType === 'NCERT Solutions' || lType === 'Example Solving') {
      topicName = 'NCERT Solutions & Exercises';
      topicOrder = 3;
    } else if (lType === 'MCQ' || lType === 'Practice Questions' || lType === 'Previous Year Questions') {
      topicName = 'Practice Questions, MCQs & Important Questions';
      topicOrder = 4;
    } else if (lType === 'Revision' || lType === 'One-Shot Revision') {
      topicName = 'Revision & One-Shot Summary';
      topicOrder = 5;
    } else if (matchedChapter.isRationalized) {
      topicName = 'Supplementary & Previous Edition Content';
      topicOrder = 6;
    }

    const topicCacheKey = `${chapterRecord.id}-${topicName}`;
    let topicRecord = topicCache[topicCacheKey];
    if (!topicRecord) {
      topicRecord = await prisma.topic.findFirst({
        where: { chapterId: chapterRecord.id, name: topicName },
      });
      if (!topicRecord) {
        topicRecord = await prisma.topic.create({
          data: {
            chapterId: chapterRecord.id,
            name: topicName,
            order: topicOrder,
            description: `${subDef.name} - ${matchedChapter.title} - ${topicName}`,
            syllabusStatus: matchedChapter.isRationalized ? 'PREVIOUS_EDITION' : 'CURRENT_2026_27',
            officialSourceUrl: 'https://ncert.nic.in/textbook.php',
          },
        });
      }
      topicCache[topicCacheKey] = topicRecord;
    }

    // Mapping Status & Confidence
    let mappingStatus = 'VERIFIED';
    let mappingConfidence = 100.0;
    let syllabusStatus = 'CURRENT_2026_27';

    if (matchedChapter.isRationalized) {
      mappingStatus = 'OUTDATED';
      mappingConfidence = 85.0;
      syllabusStatus = 'PREVIOUS_EDITION';
    } else if (/sample\s*paper|strategy|live/i.test(v.title)) {
      mappingStatus = 'SUPPLEMENTARY';
      mappingConfidence = 90.0;
      syllabusStatus = 'CURRENT_2026_27';
    }

    // Clean title for display
    let cleanTitle = v.title
      .replace(/\\u0026/g, '&')
      .replace(/\s*\|\s*CBSE\s*202[0-9]-[0-9]{2}/gi, '')
      .replace(/\s*\|\s*NCERT\/CBSE\s*202[0-9]-[0-9]{2}/gi, '')
      .replace(/\s*\|\s*Class\s*[0-9]{1,2}(?:th)?\s*[A-Za-z\s()]+/gi, '')
      .trim();

    // Upsert LearningVideo
    await prisma.learningVideo.upsert({
      where: { youtubeVideoId: v.youtubeVideoId },
      update: {
        topicId: topicRecord.id,
        chapterId: chapterRecord.id,
        youtubeUrl: v.youtubeUrl,
        title: cleanTitle || v.title,
        channelName: 'Magnet Brains',
        thumbnailUrl: v.thumbnailUrl,
        description: v.title,
        source: 'Magnet Brains',
        sourceCourse: v.book,
        academicYear: '2026-27',
        lectureType: lType,
        mappingStatus: mappingStatus,
        mappingConfidence: mappingConfidence,
        textbookName: subDef.bookName,
        textbookEdition: '2026-27',
        officialSourceUrl: 'https://ncert.nic.in/textbook.php',
        syllabusStatus: syllabusStatus,
        playlistId: v.playlistId,
        playlistPosition: v.playlistPosition,
        order: v.playlistPosition || i + 1,
        videoStatus: 'AVAILABLE',
        duration: v.duration,
        durationSeconds: v.durationSeconds,
        isRecommended: lType === 'One-Shot Revision' || topicOrder === 1,
        isApproved: true,
      },
      create: {
        youtubeVideoId: v.youtubeVideoId,
        topicId: topicRecord.id,
        chapterId: chapterRecord.id,
        youtubeUrl: v.youtubeUrl,
        title: cleanTitle || v.title,
        channelName: 'Magnet Brains',
        thumbnailUrl: v.thumbnailUrl,
        description: v.title,
        source: 'Magnet Brains',
        sourceCourse: v.book,
        academicYear: '2026-27',
        lectureType: lType,
        mappingStatus: mappingStatus,
        mappingConfidence: mappingConfidence,
        textbookName: subDef.bookName,
        textbookEdition: '2026-27',
        officialSourceUrl: 'https://ncert.nic.in/textbook.php',
        syllabusStatus: syllabusStatus,
        playlistId: v.playlistId,
        playlistPosition: v.playlistPosition,
        order: v.playlistPosition || i + 1,
        videoStatus: 'AVAILABLE',
        duration: v.duration,
        durationSeconds: v.durationSeconds,
        isRecommended: lType === 'One-Shot Revision' || topicOrder === 1,
        isApproved: true,
      },
    });

    // Upsert Lesson
    const existingLesson = await prisma.lesson.findFirst({
      where: { chapterId: chapterRecord.id, videoUrl: v.youtubeUrl },
    });
    const durMin = Math.max(1, Math.round(v.durationSeconds / 60));
    if (existingLesson) {
      await prisma.lesson.update({
        where: { id: existingLesson.id },
        data: {
          topicId: topicRecord.id,
          title: cleanTitle || v.title,
          durationMinutes: durMin,
          lectureType: lType,
          mappingStatus: mappingStatus,
          isPublished: true,
        },
      });
    } else {
      await prisma.lesson.create({
        data: {
          chapterId: chapterRecord.id,
          topicId: topicRecord.id,
          title: cleanTitle || v.title,
          lessonNumber: v.playlistPosition || i + 1,
          durationMinutes: durMin,
          videoUrl: v.youtubeUrl,
          videoSource: 'Magnet Brains',
          lectureType: lType,
          mappingStatus: mappingStatus,
          isPublished: true,
        },
      });
    }

    allMappedRecords.push({
      class: targetClass,
      subject: subDef.name,
      book: subDef.bookName,
      chapterNumber: matchedChapter.num,
      chapterTitle: matchedChapter.title,
      topic: topicName,
      videoTitle: v.title,
      cleanTitle: cleanTitle,
      youtubeVideoId: v.youtubeVideoId,
      youtubeUrl: v.youtubeUrl,
      duration: v.duration,
      durationSeconds: v.durationSeconds,
      lectureType: lType,
      mappingStatus: mappingStatus,
      mappingConfidence: mappingConfidence,
      syllabusStatus: syllabusStatus,
      playlistId: v.playlistId,
      playlistPosition: v.playlistPosition
    });

    if ((i + 1) % 200 === 0 || i === rawVideos.length - 1) {
      console.log(`  Processed ${i + 1}/${rawVideos.length} videos...`);
    }
  }

  console.log(`\n✓ Mapping & Database Import Finished.`);
  console.log(`  Total Class 6 Videos: ${class6VideoCount}`);
  console.log(`  Total Classes 7–10 Videos Matched: ${matchedVideoCount} / ${rawVideos.length}`);
  console.log(`  Total Combined Videos: ${class6VideoCount + matchedVideoCount}`);
  console.log(`  Unmatched Videos: ${unmatchedList.length}`);

  // Step 5: Generate Machine-Readable JSON Export
  console.log('\n--- Generating Export & Audit Reports ---');
  fs.writeFileSync(
    'curriculum-video-mapping-export.json',
    JSON.stringify(allMappedRecords, null, 2),
    'utf8'
  );
  console.log('✓ Exported curriculum-video-mapping-export.json');

  return {
    class6VideoCount,
    matchedVideoCount,
    totalCount: class6VideoCount + matchedVideoCount,
    unmatchedList,
    allMappedRecords
  };
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
