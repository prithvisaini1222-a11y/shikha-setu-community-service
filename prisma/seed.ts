import { PrismaClient, UserRole, VerificationStatus, UrgencyLevel, NeedCategory, NeedStatus, DonationStatus, SessionStatus, RequestStatus, QuestionType, DoubtStatus, CertificateStatus } from '@prisma/client';
import { importClass6Curriculum } from '../scripts/import-class6.mjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ShikshaSetu production-style demo data...');

  // Clean existing tables
  await prisma.videoReport.deleteMany();
  await prisma.savedVideo.deleteMany();
  await prisma.learnerVideoProgress.deleteMany();
  await prisma.learningVideo.deleteMany();
  await prisma.trustedChannel.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.volunteerRequest.deleteMany();
  await prisma.institutionNeed.deleteMany();
  await prisma.doubt.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.question.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.careerResource.deleteMany();
  await prisma.lifeSkill.deleteMany();
  await prisma.learner.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  console.log('Creating users...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@shikshasetu.org',
      name: 'Dr. Anita Roy (Admin Directorate)',
      passwordHash: 'admin123', // In demo password is plain or checked directly
      role: UserRole.ADMIN,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const instUser1 = await prisma.user.create({
    data: {
      email: 'ashakiran@shikshasetu.org',
      name: 'Asha Kiran Children Home',
      passwordHash: 'inst123',
      role: UserRole.INSTITUTION,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    },
  });

  const instUser2 = await prisma.user.create({
    data: {
      email: 'prerna@shikshasetu.org',
      name: 'Prerna Bal Sadan (Jaipur)',
      passwordHash: 'inst123',
      role: UserRole.INSTITUTION,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    },
  });

  const instUser3 = await prisma.user.create({
    data: {
      email: 'snehalaya@shikshasetu.org',
      name: 'Snehalaya Care Society (Pune)',
      passwordHash: 'inst123',
      role: UserRole.INSTITUTION,
      isVerified: true,
    },
  });

  const instUser4 = await prisma.user.create({
    data: {
      email: 'navjyoti@shikshasetu.org',
      name: 'Navjyoti Child Foundation (Lucknow)',
      passwordHash: 'inst123',
      role: UserRole.INSTITUTION,
      isVerified: false,
    },
  });

  const volUser1 = await prisma.user.create({
    data: {
      email: 'priya.volunteer@shikshasetu.org',
      name: 'Priya Sharma',
      passwordHash: 'volunteer123',
      role: UserRole.VOLUNTEER,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const volUser2 = await prisma.user.create({
    data: {
      email: 'rahul.volunteer@shikshasetu.org',
      name: 'Rahul Verma',
      passwordHash: 'volunteer123',
      role: UserRole.VOLUNTEER,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const volUser3 = await prisma.user.create({
    data: {
      email: 'ananya.volunteer@shikshasetu.org',
      name: 'Ananya Iyer',
      passwordHash: 'volunteer123',
      role: UserRole.VOLUNTEER,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  });

  const volUser4 = await prisma.user.create({
    data: {
      email: 'vikram.volunteer@shikshasetu.org',
      name: 'Dr. Vikram Seth',
      passwordHash: 'volunteer123',
      role: UserRole.VOLUNTEER,
      isVerified: true,
    },
  });

  const volUserPending = await prisma.user.create({
    data: {
      email: 'pooja.pending@shikshasetu.org',
      name: 'Pooja Patel',
      passwordHash: 'volunteer123',
      role: UserRole.VOLUNTEER,
      isVerified: false,
    },
  });

  const donorUser1 = await prisma.user.create({
    data: {
      email: 'rajesh.donor@shikshasetu.org',
      name: 'Rajesh Patel',
      passwordHash: 'donor123',
      role: UserRole.DONOR,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const donorUser2 = await prisma.user.create({
    data: {
      email: 'sunita.donor@shikshasetu.org',
      name: 'Sunita Sen',
      passwordHash: 'donor123',
      role: UserRole.DONOR,
      isVerified: true,
    },
  });

  const learnerUser1 = await prisma.user.create({
    data: {
      email: 'aarav.learner@shikshasetu.org',
      name: 'Aarav - Class 8',
      passwordHash: 'learner123',
      role: UserRole.LEARNER,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    },
  });

  const learnerUser2 = await prisma.user.create({
    data: {
      email: 'diya.learner@shikshasetu.org',
      name: 'Diya - Class 8',
      passwordHash: 'learner123',
      role: UserRole.LEARNER,
      isVerified: true,
    },
  });

  // 2. Institutions
  console.log('Creating institutions...');
  const inst1 = await prisma.institution.create({
    data: {
      userId: instUser1.id,
      orgName: 'Asha Kiran Children Home',
      registrationNumber: 'DL-CCI-2018-9412',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'Sector 14, Dwarka, New Delhi 110078',
      contactPerson: 'Smt. Gayatri Devi (Superintendent)',
      phone: '+91 11 2808 1942',
      email: 'contact@ashakiranhome.org',
      childCount: 65,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationDocUrl: 'https://documents.shikshasetu.org/cci/dl-9412-license.pdf',
    },
  });

  const inst2 = await prisma.institution.create({
    data: {
      userId: instUser2.id,
      orgName: 'Prerna Bal Sadan',
      registrationNumber: 'RJ-CCI-2020-4102',
      state: 'Rajasthan',
      city: 'Jaipur',
      address: 'Malviya Nagar, Jaipur, Rajasthan 302017',
      contactPerson: 'Shri Manoj Sharma',
      phone: '+91 141 252 8933',
      email: 'admin@prernasadan.org',
      childCount: 48,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationDocUrl: 'https://documents.shikshasetu.org/cci/rj-4102-license.pdf',
    },
  });

  const inst3 = await prisma.institution.create({
    data: {
      userId: instUser3.id,
      orgName: 'Snehalaya Care Society',
      registrationNumber: 'MH-CCI-2016-7782',
      state: 'Maharashtra',
      city: 'Pune',
      address: 'Near Deccan Gymkhana, Pune 411004',
      contactPerson: 'Dr. Girish Kulkarni',
      phone: '+91 20 2567 4419',
      email: 'info@snehalayapune.org',
      childCount: 82,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const inst4 = await prisma.institution.create({
    data: {
      userId: instUser4.id,
      orgName: 'Navjyoti Child Foundation',
      registrationNumber: 'UP-CCI-2022-1144',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      address: 'Gomti Nagar, Lucknow 226010',
      contactPerson: 'Rameshwar Singh',
      phone: '+91 522 239 8812',
      email: 'navjyotifoundation@gmail.com',
      childCount: 35,
      verificationStatus: VerificationStatus.PENDING,
      verificationDocUrl: 'https://documents.shikshasetu.org/cci/up-1144-cert.pdf',
    },
  });

  // 3. Volunteers
  console.log('Creating volunteers...');
  const vol1 = await prisma.volunteer.create({
    data: {
      userId: volUser1.id,
      fullName: 'Priya Sharma',
      bio: 'Software Engineer & Math Educator. Passionate about empowering underprivileged students with conceptual clarity in STEM.',
      skills: 'Mathematics, Science, Vedic Maths, Problem Solving',
      subjects: 'Mathematics, Science',
      classes: '6,7,8,9,10',
      availability: 'Weekends, Sundays (10:00 AM - 1:00 PM)',
      mode: 'online',
      experienceYears: 4,
      verificationStatus: VerificationStatus.VERIFIED,
      contributionScore: 98,
      totalHours: 42.5,
      totalSessions: 21,
    },
  });

  const vol2 = await prisma.volunteer.create({
    data: {
      userId: volUser2.id,
      fullName: 'Rahul Verma',
      bio: 'English Language Trainer and certified communications coach with 5 years experience in youth development.',
      skills: 'Spoken English, Grammar, Creative Writing, Public Speaking',
      subjects: 'English, Computer / Digital Skills',
      classes: '7,8,9',
      availability: 'Saturdays (3:00 PM - 6:00 PM)',
      mode: 'online',
      experienceYears: 5,
      verificationStatus: VerificationStatus.VERIFIED,
      contributionScore: 92,
      totalHours: 28.0,
      totalSessions: 14,
    },
  });

  const vol3 = await prisma.volunteer.create({
    data: {
      userId: volUser3.id,
      fullName: 'Ananya Iyer',
      bio: 'History & Civics educator passionate about story-based learning and youth career mentorship.',
      skills: 'Social Science, History, Career Guidance, Debate',
      subjects: 'Social Science, Hindi',
      classes: '8,9,10',
      availability: 'Sundays (2:00 PM - 5:00 PM)',
      mode: 'both',
      experienceYears: 3,
      verificationStatus: VerificationStatus.VERIFIED,
      contributionScore: 95,
      totalHours: 36.0,
      totalSessions: 18,
    },
  });

  const vol4 = await prisma.volunteer.create({
    data: {
      userId: volUser4.id,
      fullName: 'Dr. Vikram Seth',
      bio: 'Retired Physics Professor volunteering to mentor Class 9-10 board students.',
      skills: 'Physics, Chemistry, Board Exam Prep',
      subjects: 'Science',
      classes: '9,10',
      availability: 'Tuesdays & Thursdays (4:00 PM - 6:00 PM)',
      mode: 'online',
      experienceYears: 20,
      verificationStatus: VerificationStatus.VERIFIED,
      contributionScore: 100,
      totalHours: 54.0,
      totalSessions: 27,
    },
  });

  await prisma.volunteer.create({
    data: {
      userId: volUserPending.id,
      fullName: 'Pooja Patel',
      bio: 'Graduate student in education seeking to volunteer in primary and middle school English.',
      skills: 'English, Reading Comprehension',
      subjects: 'English',
      classes: '6,7,8',
      availability: 'Flexible weekends',
      mode: 'online',
      experienceYears: 1,
      verificationStatus: VerificationStatus.PENDING,
      contributionScore: 80,
      totalHours: 0,
      totalSessions: 0,
    },
  });

  // 4. Learners (Privacy-safe: no private phone/address)
  console.log('Creating learners...');
  const learner1 = await prisma.learner.create({
    data: {
      userId: learnerUser1.id,
      displayName: 'Aarav - Class 8',
      classLevel: 8,
      institutionId: inst1.id,
      rollAlias: 'LRN-AK-801',
      streakDays: 5,
    },
  });

  const learner2 = await prisma.learner.create({
    data: {
      userId: learnerUser2.id,
      displayName: 'Diya - Class 8',
      classLevel: 8,
      institutionId: inst1.id,
      rollAlias: 'LRN-AK-802',
      streakDays: 3,
    },
  });

  // 5. Classes & Curriculum
  console.log('Creating academic classes 6 to 10...');
  const classesData = [
    { classNumber: 6, title: 'Class 6 - Middle School Foundation' },
    { classNumber: 7, title: 'Class 7 - Conceptual Development' },
    { classNumber: 8, title: 'Class 8 - Pre-Secondary Mastery' },
    { classNumber: 9, title: 'Class 9 - Secondary Core Curriculum' },
    { classNumber: 10, title: 'Class 10 - Board Preparation & Foundation' },
  ];

  const createdClasses: Record<number, any> = {};
  for (const c of classesData) {
    createdClasses[c.classNumber] = await prisma.class.create({ data: c });
  }

  // Seed Class 6 Subjects, Chapters & Magnet Brains Videos (2026-27 NCERT Curriculum)
  await importClass6Curriculum(prisma);

  // Class 8 Subjects
  const class8 = createdClasses[8];
  const math8 = await prisma.subject.create({
    data: {
      classId: class8.id,
      name: 'Mathematics',
      code: 'MATH-8',
      icon: 'calculator',
      color: '#3B82F6',
      description: 'Linear equations, rational numbers, geometry, mensuration, and algebraic expressions.',
    },
  });

  const science8 = await prisma.subject.create({
    data: {
      classId: class8.id,
      name: 'Science',
      code: 'SCI-8',
      icon: 'microscope',
      color: '#10B981',
      description: 'Microorganisms, force & pressure, cell structure, sound, light, and chemical effects of current.',
    },
  });

  const english8 = await prisma.subject.create({
    data: {
      classId: class8.id,
      name: 'English',
      code: 'ENG-8',
      icon: 'book-open',
      color: '#8B5CF6',
      description: 'Grammar mastery, comprehension, vocabulary, essay writing, and verbal expression.',
    },
  });

  const comp8 = await prisma.subject.create({
    data: {
      classId: class8.id,
      name: 'Computer & Digital Skills',
      code: 'COMP-8',
      icon: 'laptop',
      color: '#F59E0B',
      description: 'Computer fundamentals, internet safety, coding basics with Python, and safe browsing habits.',
    },
  });

  // Also create structured curriculum subjects for Class 9 & 10
  const math9 = await prisma.subject.create({
    data: {
      classId: createdClasses[9].id,
      name: 'Mathematics',
      code: 'MATH-9',
      icon: 'calculator',
      color: '#3B82F6',
      description: 'Number systems, polynomials, coordinate geometry, linear equations in two variables, triangles, and circles.',
    },
  });

  const math10 = await prisma.subject.create({
    data: {
      classId: createdClasses[10].id,
      name: 'Mathematics',
      code: 'MATH-10',
      icon: 'calculator',
      color: '#3B82F6',
      description: 'Real numbers, polynomials, pair of linear equations in two variables, quadratic equations, and trigonometry.',
    },
  });

  await prisma.subject.create({
    data: {
      classId: createdClasses[10].id,
      name: 'Science (Physics & Chemistry)',
      code: 'SCI-10',
      icon: 'atom',
      color: '#EC4899',
      description: 'Chemical reactions, acids & bases, electricity, magnetic effects, and life processes.',
    },
  });

  // Seed Trusted Educational Channels (Requirements 16 & 33)
  console.log('Seeding trusted educational channels...');
  const trustedChannelsData = [
    { channelName: 'Khan Academy India', channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', priority: 10, subjects: ['Mathematics', 'Science'], classes: [6, 7, 8, 9, 10] },
    { channelName: 'NCERT Official', channelId: 'UC6fF3_eBqC2s0b4xK4m2W1w', priority: 9, subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'], classes: [6, 7, 8, 9, 10] },
    { channelName: 'Magnet Brains', channelId: 'UC7f6k_m3n9P1q7L2n5W8w1v', priority: 10, subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'], classes: [6, 7, 8, 9, 10] },
    { channelName: 'Vedantu 6-8', channelId: 'UC5b4eK2L1m9w8k3v5n7P9q2', priority: 8, subjects: ['Mathematics', 'Science'], classes: [6, 7, 8] },
    { channelName: 'Physics Wallah - Foundation', channelId: 'UC8v2k4n7w9m1l3p5q6x8v2', priority: 9, subjects: ['Mathematics', 'Science'], classes: [8, 9, 10] },
    { channelName: 'Dear Sir', channelId: 'UC9p3k1m7n5v8w2q4l6x9v1', priority: 7, subjects: ['Mathematics', 'English'], classes: [6, 7, 8, 9, 10] },
  ];

  for (const tc of trustedChannelsData) {
    await prisma.trustedChannel.upsert({
      where: { channelId: tc.channelId },
      update: {
        channelName: tc.channelName,
        priority: tc.priority,
        subjectsJson: JSON.stringify(tc.subjects),
        classesJson: JSON.stringify(tc.classes),
        status: 'ACTIVE',
      },
      create: {
        channelName: tc.channelName,
        channelId: tc.channelId,
        priority: tc.priority,
        subjectsJson: JSON.stringify(tc.subjects),
        classesJson: JSON.stringify(tc.classes),
        status: 'ACTIVE',
      },
    });
  }

  // --- CLASS 8 MATHEMATICS CHAPTERS & TOPICS (Requirement 51) ---
  console.log('Creating Class 8 Mathematics chapters, topics, and curated YouTube videos...');

  // Chapter 1: Linear Equations in One Variable
  const chLinearEq = await prisma.chapter.create({
    data: {
      subjectId: math8.id,
      chapterNumber: 1,
      title: 'Linear Equations in One Variable',
      description: 'Solving linear equations with variables on one side and both sides, practical word problems, and real-world applications.',
    },
  });

  const topicLin1 = await prisma.topic.create({
    data: {
      chapterId: chLinearEq.id,
      name: 'Introduction & Algebraic Expressions',
      order: 1,
      description: 'Differentiating expressions from equations and understanding linear degree.',
    },
  });

  const topicLin2 = await prisma.topic.create({
    data: {
      chapterId: chLinearEq.id,
      name: 'Solving Equations with Variables on Both Sides',
      order: 2,
      description: 'Transposition method and balancing equations.',
    },
  });

  const topicLin3 = await prisma.topic.create({
    data: {
      chapterId: chLinearEq.id,
      name: 'Practical Word Problems & Applications',
      order: 3,
      description: 'Translating age, perimeter, and number word problems into equations.',
    },
  });

  // Chapter 2: Rational Numbers
  const chRationalNum = await prisma.chapter.create({
    data: {
      subjectId: math8.id,
      chapterNumber: 2,
      title: 'Rational Numbers',
      description: 'Properties of rational numbers, operations on the number line, and finding rational numbers between two given numbers.',
    },
  });

  const topicRat1 = await prisma.topic.create({
    data: {
      chapterId: chRationalNum.id,
      name: 'Properties of Rational Numbers',
      order: 1,
      description: 'Closure, commutativity, and associativity under addition and multiplication.',
    },
  });

  const topicRat2 = await prisma.topic.create({
    data: {
      chapterId: chRationalNum.id,
      name: 'Representation on Number Line',
      order: 2,
      description: 'Plotting positive and negative rational fractions on the real line.',
    },
  });

  // Chapter 3: Understanding Quadrilaterals
  const chQuadrilaterals = await prisma.chapter.create({
    data: {
      subjectId: math8.id,
      chapterNumber: 3,
      title: 'Understanding Quadrilaterals',
      description: 'Polygons, convex and concave polygons, angle sum property, and properties of special parallelograms.',
    },
  });

  const topicQuad1 = await prisma.topic.create({
    data: {
      chapterId: chQuadrilaterals.id,
      name: 'Polygons & Angle Sum Property',
      order: 1,
      description: 'Classification of polygons and interior/exterior angle properties.',
    },
  });

  const topicQuad2 = await prisma.topic.create({
    data: {
      chapterId: chQuadrilaterals.id,
      name: 'Parallelograms & Special Quadrilaterals',
      order: 2,
      description: 'Rhombus, rectangle, square, and trapezium characteristics.',
    },
  });

  // Chapter 4: Data Handling
  const chDataHandling = await prisma.chapter.create({
    data: {
      subjectId: math8.id,
      chapterNumber: 4,
      title: 'Data Handling',
      description: 'Organizing data, frequency distribution tables, histograms, pie charts, and basic experimental probability.',
    },
  });

  const topicData1 = await prisma.topic.create({
    data: {
      chapterId: chDataHandling.id,
      name: 'Histograms & Frequency Distribution',
      order: 1,
      description: 'Grouped frequency distribution and interpreting histograms.',
    },
  });

  const topicData2 = await prisma.topic.create({
    data: {
      chapterId: chDataHandling.id,
      name: 'Pie Charts & Probability Basics',
      order: 2,
      description: 'Central angle calculation for circle graphs and equally likely outcomes.',
    },
  });

  // --- CLASS 9 MATHEMATICS CHAPTERS (Requirement 51) ---
  console.log('Creating Class 9 Mathematics curriculum & videos...');
  const chNumSystems9 = await prisma.chapter.create({
    data: {
      subjectId: math9.id,
      chapterNumber: 1,
      title: 'Number Systems',
      description: 'Irrational numbers, real numbers and decimal expansions, operations on real numbers, and laws of exponents.',
    },
  });

  const chPolynomials9 = await prisma.chapter.create({
    data: {
      subjectId: math9.id,
      chapterNumber: 2,
      title: 'Polynomials',
      description: 'Polynomials in one variable, zeroes of a polynomial, remainder theorem, factorisation, and algebraic identities.',
    },
  });

  const chCoordGeom9 = await prisma.chapter.create({
    data: {
      subjectId: math9.id,
      chapterNumber: 3,
      title: 'Coordinate Geometry',
      description: 'Cartesian system, origin, x-axis and y-axis coordinates, and plotting points on the Cartesian plane.',
    },
  });

  // --- CLASS 10 MATHEMATICS CHAPTERS (Requirement 51) ---
  console.log('Creating Class 10 Mathematics curriculum & videos...');
  const chRealNum10 = await prisma.chapter.create({
    data: {
      subjectId: math10.id,
      chapterNumber: 1,
      title: 'Real Numbers',
      description: 'Fundamental Theorem of Arithmetic, prime factorisation, revisiting irrational numbers, and proofs of irrationality.',
    },
  });

  const chPolynomials10 = await prisma.chapter.create({
    data: {
      subjectId: math10.id,
      chapterNumber: 2,
      title: 'Polynomials',
      description: 'Geometrical meaning of zeroes, relationship between zeroes and coefficients of quadratic polynomials.',
    },
  });

  const chPairLinear10 = await prisma.chapter.create({
    data: {
      subjectId: math10.id,
      chapterNumber: 3,
      title: 'Pair of Linear Equations in Two Variables',
      description: 'Graphical method of solution, consistency of equations, substitution method, and elimination method.',
    },
  });

  // --- SEED CURATED & APPROVED YOUTUBE VIDEOS (Requirement 10, 11, 51) ---
  console.log('Seeding approved educational YouTube videos...');

  const learningVideosSeedData = [
    // Linear Equations (Class 8)
    {
      topicId: topicLin1.id,
      chapterId: chLinearEq.id,
      youtubeVideoId: 's2v3Nl0rLpE',
      title: 'Introduction to Linear Equations in One Variable | Class 8 Maths',
      channelName: 'Khan Academy India',
      thumbnailUrl: 'https://img.youtube.com/vi/s2v3Nl0rLpE/hqdefault.jpg',
      description: 'Learn the fundamentals of algebraic expressions vs equations, degree of variables, and balancing method.',
      duration: '18m 12s',
      durationSeconds: 1092,
      language: 'Hindi/English',
      relevanceScore: 96.0,
      qualityScore: 98.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 385000,
    },
    {
      topicId: topicLin2.id,
      chapterId: chLinearEq.id,
      youtubeVideoId: 'bAerID24QJg',
      title: 'Solving Equations Having Variables on Both Sides | NCERT Class 8',
      channelName: 'NCERT Official',
      thumbnailUrl: 'https://img.youtube.com/vi/bAerID24QJg/hqdefault.jpg',
      description: 'Official NCERT pedagogical lesson on transposing variable terms and verifying solutions.',
      duration: '22m 35s',
      durationSeconds: 1355,
      language: 'Hindi/English',
      relevanceScore: 94.0,
      qualityScore: 95.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 240000,
    },
    {
      topicId: topicLin3.id,
      chapterId: chLinearEq.id,
      youtubeVideoId: 'P3bY5qT6v0k',
      title: 'Linear Equations Word Problems & Step-by-Step Solutions',
      channelName: 'Magnet Brains',
      thumbnailUrl: 'https://img.youtube.com/vi/P3bY5qT6v0k/hqdefault.jpg',
      description: 'Comprehensive walkthrough of perimeter, consecutive integer, and ratio word problems.',
      duration: '25m 40s',
      durationSeconds: 1540,
      language: 'Hindi',
      relevanceScore: 90.0,
      qualityScore: 92.0,
      isRecommended: false,
      isApproved: true,
      isCurated: true,
      viewCount: 180000,
    },
    // Rational Numbers (Class 8)
    {
      topicId: topicRat1.id,
      chapterId: chRationalNum.id,
      youtubeVideoId: 'X3jO7vK9f2s',
      title: 'Rational Numbers Class 8 Maths - Properties & Operations',
      channelName: 'Khan Academy India',
      thumbnailUrl: 'https://img.youtube.com/vi/X3jO7vK9f2s/hqdefault.jpg',
      description: 'Closure, commutative, and associative properties explained with intuitive number line examples.',
      duration: '20m 15s',
      durationSeconds: 1215,
      language: 'Hindi/English',
      relevanceScore: 95.0,
      qualityScore: 97.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 310000,
    },
    {
      topicId: topicRat2.id,
      chapterId: chRationalNum.id,
      youtubeVideoId: 'dK8pQ0wY4nE',
      title: 'Representation of Rational Numbers on Number Line | Class 8',
      channelName: 'Vedantu 6-8',
      thumbnailUrl: 'https://img.youtube.com/vi/dK8pQ0wY4nE/hqdefault.jpg',
      description: 'Step-by-step method to find and plot rational numbers between any two integers or fractions.',
      duration: '16m 45s',
      durationSeconds: 1005,
      language: 'English',
      relevanceScore: 91.0,
      qualityScore: 90.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 195000,
    },
    // Understanding Quadrilaterals (Class 8)
    {
      topicId: topicQuad1.id,
      chapterId: chQuadrilaterals.id,
      youtubeVideoId: 'm5R7v2L8k1w',
      title: 'Understanding Quadrilaterals - Polygons & Angle Sum Property',
      channelName: 'NCERT Official',
      thumbnailUrl: 'https://img.youtube.com/vi/m5R7v2L8k1w/hqdefault.jpg',
      description: 'Visual geometry demonstration of sum of exterior and interior angles in convex polygons.',
      duration: '24m 10s',
      durationSeconds: 1450,
      language: 'Hindi/English',
      relevanceScore: 93.0,
      qualityScore: 94.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 220000,
    },
    // Data Handling (Class 8)
    {
      topicId: topicData1.id,
      chapterId: chDataHandling.id,
      youtubeVideoId: 'j4N6p9w8k3v',
      title: 'Data Handling Class 8 - Frequency Tables, Histograms & Pie Charts',
      channelName: 'Dear Sir',
      thumbnailUrl: 'https://img.youtube.com/vi/j4N6p9w8k3v/hqdefault.jpg',
      description: 'Short tricks and complete concept for constructing histograms and solving pie chart questions.',
      duration: '28m 05s',
      durationSeconds: 1685,
      language: 'Hindi',
      relevanceScore: 94.0,
      qualityScore: 92.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 540000,
    },
    // Number Systems (Class 9)
    {
      topicId: null,
      chapterId: chNumSystems9.id,
      youtubeVideoId: 'k8L1v7n3m9w',
      title: 'Class 9 Number Systems Full Chapter Concept & Irrational Numbers',
      channelName: 'Physics Wallah - Foundation',
      thumbnailUrl: 'https://img.youtube.com/vi/k8L1v7n3m9w/hqdefault.jpg',
      description: 'Complete concept of rationalising the denominator and laws of exponents.',
      duration: '32m 20s',
      durationSeconds: 1940,
      language: 'Hindi/English',
      relevanceScore: 95.0,
      qualityScore: 96.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 420000,
    },
    // Real Numbers (Class 10)
    {
      topicId: null,
      chapterId: chRealNum10.id,
      youtubeVideoId: 'w2v8k3m1n5p',
      title: 'Class 10 Real Numbers - Fundamental Theorem of Arithmetic & HCF/LCM',
      channelName: 'Khan Academy India',
      thumbnailUrl: 'https://img.youtube.com/vi/w2v8k3m1n5p/hqdefault.jpg',
      description: 'Master prime factorisation, relationship between HCF and LCM, and proofs of irrationality.',
      duration: '26m 50s',
      durationSeconds: 1610,
      language: 'Hindi/English',
      relevanceScore: 97.0,
      qualityScore: 98.0,
      isRecommended: true,
      isApproved: true,
      isCurated: true,
      viewCount: 610000,
    },
  ];

  for (const lv of learningVideosSeedData) {
    await prisma.learningVideo.create({
      data: {
        topicId: lv.topicId,
        chapterId: lv.chapterId,
        youtubeVideoId: lv.youtubeVideoId,
        title: lv.title,
        channelName: lv.channelName,
        thumbnailUrl: lv.thumbnailUrl,
        description: lv.description,
        duration: lv.duration,
        durationSeconds: lv.durationSeconds,
        language: lv.language,
        relevanceScore: lv.relevanceScore,
        qualityScore: lv.qualityScore,
        isRecommended: lv.isRecommended,
        isApproved: lv.isApproved,
        isCurated: lv.isCurated,
        viewCount: lv.viewCount,
      },
    });
  }

  // Lessons for Linear Equations (linked to topicLin1 and topicLin2)
  const lesson1 = await prisma.lesson.create({
    data: {
      chapterId: chLinearEq.id,
      topicId: topicLin1.id,
      lessonNumber: 1,
      title: 'Concept of Algebraic Expressions and Equations',
      durationMinutes: 18,
      videoUrl: 'https://www.youtube-nocookie.com/embed/s2v3Nl0rLpE',
      videoSource: 'Khan Academy India',
      objectivesJson: JSON.stringify([
        'Differentiate between an expression (e.g., 2x + 3) and an equation (2x + 3 = 7)',
        'Identify terms, variables, coefficients, and degree of linear equations',
        'Solve simple one-step linear equations using balance and transposition methods',
      ]),
      isPublished: true,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      chapterId: chLinearEq.id,
      topicId: topicLin2.id,
      lessonNumber: 2,
      title: 'Solving Equations Having Variables on Both Sides',
      durationMinutes: 22,
      videoUrl: 'https://www.youtube-nocookie.com/embed/bAerID24QJg',
      videoSource: 'NCERT Official Educational Portal',
      objectivesJson: JSON.stringify([
        'Group variable terms to LHS and numerical constants to RHS',
        'Handle brackets and cross-multiplication with rational coefficients',
        'Verify solutions by substituting back into original equations',
      ]),
      isPublished: true,
    },
  });

  // Notes for Linear Equations
  await prisma.note.create({
    data: {
      chapterId: chLinearEq.id,
      title: 'Comprehensive Revision Notes: Linear Equations in One Variable',
      summary: 'Essential formulas, transposing rules, and step-by-step solving algorithms for Class 8 exams.',
      keyFormulas: 'ax + b = c => x = (c - b) / a\nTransposition: + changes to -, - to +, * to /, and / to * across =.',
      contentMarkdown: `# Chapter Notes: Linear Equations in One Variable

## 1. What is an Equation?
An equation is a statement of equality involving one or more variables. For example:
**3x + 5 = 20**
- Variable: x
- Left Hand Side (LHS): 3x + 5
- Right Hand Side (RHS): 20
- Equality sign (=) indicates that LHS has the same value as RHS.

## 2. Linear Equation Characteristics
- The highest power (degree) of the variable in a linear equation is always **1**.
- Example: 2x - 3 = 7 is linear; 2x² + 5 = 9 is NOT linear.

## 3. Golden Rules of Transposition
When shifting a term from one side of the '=' sign to the other:
1. Addition becomes Subtraction: x + 4 = 10 => x = 10 - 4 = 6
2. Subtraction becomes Addition: x - 5 = 12 => x = 12 + 5 = 17
3. Multiplication becomes Division: 4x = 24 => x = 24 / 4 = 6
4. Division becomes Multiplication: x / 3 = 8 => x = 8 * 3 = 24

## 4. Practical Word Problems Strategy
1. Read the problem carefully and identify the unknown quantity.
2. Let the unknown be 'x'.
3. Formulate the equation according to given conditions.
4. Solve for x.
5. Check your solution against the problem context!`,
    },
  });

  // Practice Questions for Chapter 1
  await prisma.question.create({
    data: {
      chapterId: chLinearEq.id,
      type: QuestionType.MCQ,
      questionText: 'Solve for x: 3x - 5 = 16',
      optionsJson: JSON.stringify(['x = 5', 'x = 7', 'x = 6', 'x = 8']),
      correctAnswer: 'x = 7',
      explanation: 'Add 5 to both sides: 3x = 16 + 5 = 21. Then divide by 3: x = 21 / 3 = 7.',
      difficulty: 'Easy',
    },
  });

  await prisma.question.create({
    data: {
      chapterId: chLinearEq.id,
      type: QuestionType.MCQ,
      questionText: 'If 2x + 7 = x + 15, what is the value of x?',
      optionsJson: JSON.stringify(['x = 8', 'x = 6', 'x = 10', 'x = 22']),
      correctAnswer: 'x = 8',
      explanation: 'Transpose x to LHS and 7 to RHS: 2x - x = 15 - 7 => x = 8.',
      difficulty: 'Medium',
    },
  });

  await prisma.question.create({
    data: {
      chapterId: chLinearEq.id,
      type: QuestionType.TRUE_FALSE,
      questionText: 'In a linear equation, the maximum exponent of the variable can be 2.',
      optionsJson: JSON.stringify(['True', 'False']),
      correctAnswer: 'False',
      explanation: 'False. The maximum power of a variable in a linear equation is always 1.',
      difficulty: 'Easy',
    },
  });

  await prisma.question.create({
    data: {
      chapterId: chLinearEq.id,
      type: QuestionType.NUMERICAL,
      questionText: 'The perimeter of a rectangle is 26 cm. If its length is 8 cm, what is its breadth in cm?',
      optionsJson: JSON.stringify(['5']),
      correctAnswer: '5',
      explanation: 'Perimeter = 2(l + b) => 2(8 + b) = 26 => 8 + b = 13 => b = 5 cm.',
      difficulty: 'Medium',
    },
  });

  // 10-Question Comprehensive Quiz for Linear Equations
  const quiz1 = await prisma.quiz.create({
    data: {
      chapterId: chLinearEq.id,
      title: 'Class 8 Mathematics: Linear Equations Mastery Quiz (10 Marks)',
      passScore: 7,
      timeLimitMinutes: 15,
    },
  });

  // Add 10 questions to the chapter/quiz
  const quizQuestionsData = [
    { q: '1. What is the degree of the equation 5x + 9 = 24?', opts: ['0', '1', '2', '3'], ans: '1', exp: 'Linear equations have highest variable degree = 1.' },
    { q: '2. Solve: 4x = 36', opts: ['x = 8', 'x = 9', 'x = 10', 'x = 12'], ans: 'x = 9', exp: 'x = 36 / 4 = 9.' },
    { q: '3. Solve: y / 5 = 7', opts: ['y = 12', 'y = 35', 'y = 25', 'y = 40'], ans: 'y = 35', exp: 'y = 7 * 5 = 35.' },
    { q: '4. If 5x - 3 = 2x + 12, find x:', opts: ['x = 3', 'x = 5', 'x = 4', 'x = 6'], ans: 'x = 5', exp: '5x - 2x = 12 + 3 => 3x = 15 => x = 5.' },
    { q: '5. The sum of two consecutive numbers is 29. Find the smaller number:', opts: ['13', '14', '15', '16'], ans: '14', exp: 'x + (x + 1) = 29 => 2x = 28 => x = 14.' },
    { q: '6. Which of the following is a linear equation in one variable?', opts: ['x² + 2x = 5', '2x + 3y = 7', '3x - 4 = 11', 'x³ = 8'], ans: '3x - 4 = 11', exp: 'Only one variable (x) with degree 1.' },
    { q: '7. Solve: 2(x + 3) = 14', opts: ['x = 4', 'x = 5', 'x = 6', 'x = 7'], ans: 'x = 4', exp: 'x + 3 = 7 => x = 4.' },
    { q: '8. If x/3 + 1 = 7/15, then x/3 equals:', opts: ['-8/15', '8/15', '22/15', '-7/15'], ans: '-8/15', exp: '7/15 - 1 = (7 - 15)/15 = -8/15.' },
    { q: '9. Solve: 7x - 9 = 16', opts: ['x = 25/7', 'x = 7/25', 'x = 3', 'x = 4'], ans: 'x = 25/7', exp: '7x = 16 + 9 = 25 => x = 25/7.' },
    { q: '10. True or False: 0 is a solution to 5x = 0.', opts: ['True', 'False'], ans: 'True', exp: '5 * 0 = 0. LHS = RHS = 0.' },
  ];

  for (const qq of quizQuestionsData) {
    await prisma.question.create({
      data: {
        chapterId: chLinearEq.id,
        type: QuestionType.MCQ,
        questionText: qq.q,
        optionsJson: JSON.stringify(qq.opts),
        correctAnswer: qq.ans,
        explanation: qq.exp,
        difficulty: 'Medium',
      },
    });
  }

  // Learner initial quiz attempt
  await prisma.quizAttempt.create({
    data: {
      learnerId: learner1.id,
      quizId: quiz1.id,
      score: 8,
      maxScore: 10,
      accuracyPercentage: 80.0,
      weakAreasJson: JSON.stringify(['Fractions with Rational Coefficients', 'Equation 8 transposition']),
      recommendationsJson: JSON.stringify([
        'Watch revision lesson: Solving Equations with Fractions',
        'Review Notes: Rules of Transposition',
        'Practice 3 targeted questions on fractional terms',
        'Retake quiz to achieve 100% accuracy',
      ]),
    },
  });

  // Learning progress
  await prisma.learningProgress.create({
    data: {
      learnerId: learner1.id,
      lessonId: lesson1.id,
      isCompleted: true,
      watchTimeSeconds: 1080,
    },
  });

  // Learner Doubts
  await prisma.doubt.create({
    data: {
      learnerId: learner1.id,
      subjectId: math8.id,
      chapterId: chLinearEq.id,
      question: 'Sir, when transposing -x to the other side, does the sign change to +x or does it stay negative?',
      status: DoubtStatus.ANSWERED,
      answer: 'Hello Aarav! Yes, when any term moves across the equals (=) sign, its operation inverts. Therefore, -x becomes +x on the opposite side. Keep practicing!',
      answeredByUserId: volUser1.id,
      answeredAt: new Date(Date.now() - 3600 * 1000 * 4),
    },
  });

  await prisma.doubt.create({
    data: {
      learnerId: learner2.id,
      subjectId: math8.id,
      chapterId: chLinearEq.id,
      question: 'Can a linear equation have no solution? How do we know?',
      status: DoubtStatus.OPEN,
    },
  });

  // 6. Institution Needs (Live Needs Board)
  console.log('Creating live Needs Board requirements...');
  const need1 = await prisma.institutionNeed.create({
    data: {
      institutionId: inst1.id,
      title: 'Class 8 NCERT Mathematics Books (Latest Edition)',
      category: NeedCategory.BOOKS,
      classLevel: 8,
      subject: 'Mathematics',
      urgency: UrgencyLevel.URGENT,
      requiredQuantity: 15,
      fulfilledQuantity: 10,
      verifiedQuantity: 8,
      distributedQuantity: 8,
      mode: 'offline',
      location: 'Dwarka, New Delhi',
      description: '15 copies of Class 8 NCERT Mathematics textbooks needed for children preparing for term-end assessments.',
      status: NeedStatus.PARTIALLY_FULFILLED,
    },
  });

  const need2 = await prisma.institutionNeed.create({
    data: {
      institutionId: inst1.id,
      title: 'Volunteer Math Teacher for Weekend Live Sessions',
      category: NeedCategory.TEACHING,
      classLevel: 8,
      subject: 'Mathematics',
      urgency: UrgencyLevel.URGENT,
      requiredQuantity: 4,
      fulfilledQuantity: 2,
      verifiedQuantity: 2,
      distributedQuantity: 2,
      mode: 'online',
      location: 'Online via ShikshaSetu Live',
      description: 'Experienced volunteer required to teach Class 8 Linear Equations and Geometry on Sunday mornings for 2 hours.',
      status: NeedStatus.PARTIALLY_FULFILLED,
    },
  });

  const need3 = await prisma.institutionNeed.create({
    data: {
      institutionId: inst1.id,
      title: 'Science Practical Experiment Kits',
      category: NeedCategory.EDUCATIONAL_KITS,
      classLevel: 8,
      subject: 'Science',
      urgency: UrgencyLevel.NEEDED,
      requiredQuantity: 10,
      fulfilledQuantity: 4,
      verifiedQuantity: 4,
      distributedQuantity: 4,
      mode: 'offline',
      location: 'Dwarka, New Delhi',
      description: 'Hands-on basic physics & biology kits (magnets, lens, prism, slides) for 65 children to perform practicals.',
      status: NeedStatus.OPEN,
    },
  });

  const need4 = await prisma.institutionNeed.create({
    data: {
      institutionId: inst2.id,
      title: 'Sturdy School Bags with Water Bottles',
      category: NeedCategory.SCHOOL_BAGS,
      classLevel: 7,
      urgency: UrgencyLevel.ALMOST_COMPLETE,
      requiredQuantity: 30,
      fulfilledQuantity: 28,
      verifiedQuantity: 25,
      distributedQuantity: 25,
      mode: 'offline',
      location: 'Malviya Nagar, Jaipur',
      description: 'Waterproof school bags for newly enrolled children starting the new academic semester.',
      status: NeedStatus.PARTIALLY_FULFILLED,
    },
  });

  const need5 = await prisma.institutionNeed.create({
    data: {
      institutionId: inst3.id,
      title: 'Refurbished Android Tablets / Laptops for Digital Learning',
      category: NeedCategory.TABLETS,
      classLevel: 9,
      urgency: UrgencyLevel.URGENT,
      requiredQuantity: 8,
      fulfilledQuantity: 5,
      verifiedQuantity: 5,
      distributedQuantity: 5,
      mode: 'offline',
      location: 'Deccan Gymkhana, Pune',
      description: 'Tablets enabled with educational apps for secondary students taking competitive exams and computer literacy.',
      status: NeedStatus.PARTIALLY_FULFILLED,
    },
  });

  const need6 = await prisma.institutionNeed.create({
    data: {
      institutionId: inst2.id,
      title: 'Spoken English & Communication Mentor',
      category: NeedCategory.TEACHING,
      classLevel: 9,
      subject: 'English',
      urgency: UrgencyLevel.NEEDED,
      requiredQuantity: 8,
      fulfilledQuantity: 4,
      verifiedQuantity: 4,
      distributedQuantity: 4,
      mode: 'online',
      location: 'Online',
      description: 'Interactive conversational sessions for Class 9-10 children to build interview readiness and confidence.',
      status: NeedStatus.PARTIALLY_FULFILLED,
    },
  });

  // 7. Volunteer Requests & Scheduled Sessions
  console.log('Creating volunteer requests and sessions...');
  const vReq1 = await prisma.volunteerRequest.create({
    data: {
      volunteerId: vol1.id,
      needId: need2.id,
      subject: 'Mathematics',
      classLevel: 8,
      topic: 'Linear Equations & Word Problem Mastery',
      preferredDate: new Date(Date.now() + 86400 * 1000 * 3), // 3 days ahead
      preferredTime: '10:00 AM - 12:00 PM',
      durationHours: 2.0,
      mode: 'online',
      status: RequestStatus.APPROVED,
      matchScore: 92,
      matchReasonsJson: JSON.stringify([
        'Exact Subject Match: Mathematics (30/30 pts)',
        'Class Match: Class 8 (20/20 pts)',
        'Availability: Sunday morning (20/20 pts)',
        'Mode: Online delivery supported (10/10 pts)',
        'Experience: 4 years verified tutoring (10/10 pts)',
        'Urgency: Institution priority requirement (10/10 pts)',
      ]),
      recurringType: 'weekly',
    },
  });

  // Active scheduled session
  await prisma.session.create({
    data: {
      institutionId: inst1.id,
      volunteerId: vol1.id,
      requestId: vReq1.id,
      needId: need2.id,
      title: 'Class 8 Mathematics: Linear Equations Interactive Masterclass',
      subject: 'Mathematics',
      classLevel: 8,
      scheduledStart: new Date(Date.now() + 86400 * 1000 * 3),
      durationMinutes: 120,
      mode: 'online',
      meetingLinkOrRoom: 'https://meet.shikshasetu.org/room-math8-ak',
      status: SessionStatus.SCHEDULED,
      attendanceCount: 18,
    },
  });

  // A completed session for certificate demonstration
  const completedSession = await prisma.session.create({
    data: {
      institutionId: inst1.id,
      volunteerId: vol1.id,
      title: 'Class 8 Mathematics: Algebraic Expressions Foundation',
      subject: 'Mathematics',
      classLevel: 8,
      scheduledStart: new Date(Date.now() - 86400 * 1000 * 7),
      durationMinutes: 120,
      mode: 'online',
      meetingLinkOrRoom: 'https://meet.shikshasetu.org/room-math8-ak',
      status: SessionStatus.COMPLETED,
      attendanceCount: 22,
      institutionFeedback: 'Exceptional teaching! Priya engaged all children and ensured every student solved at least 3 equations independently.',
      volunteerFeedback: 'The children at Asha Kiran are very enthusiastic and quick learners. Looking forward to our next class.',
      verifiedByInstitution: true,
    },
  });

  // 8. Verified Digital Certificate
  console.log('Creating verified digital certificates...');
  await prisma.certificate.create({
    data: {
      certificateNumber: 'CERT-SS-2026-8942',
      volunteerId: vol1.id,
      institutionId: inst1.id,
      sessionId: completedSession.id,
      contributionType: 'Mathematics Educational Tutoring - Class 8',
      hoursContributed: 24.0,
      sessionsCount: 12,
      issueDate: new Date(Date.now() - 86400 * 1000 * 5),
      verificationCode: 'SS-VRF-8942-PX',
      qrCodeData: 'https://shikshasetu.org/certificates/verify/CERT-SS-2026-8942',
      status: CertificateStatus.VALID,
    },
  });

  // 9. Donations & Sponsorships
  console.log('Creating sample donations with status progression...');
  await prisma.donation.create({
    data: {
      donorId: donorUser1.id,
      needId: need1.id,
      quantity: 5,
      category: NeedCategory.BOOKS,
      itemDescription: '5 sets of Class 8 NCERT Mathematics books',
      trackingNumber: 'TRK-INDPOST-2026-9182',
      status: DonationStatus.INSTITUTION_VERIFIED,
      initiatedAt: new Date(Date.now() - 86400 * 1000 * 6),
      confirmedAt: new Date(Date.now() - 86400 * 1000 * 5),
      receivedAt: new Date(Date.now() - 86400 * 1000 * 3),
      verifiedAt: new Date(Date.now() - 86400 * 1000 * 1),
      notes: 'Delivered directly to Asha Kiran Home office. Received in pristine condition.',
    },
  });

  await prisma.donation.create({
    data: {
      donorId: donorUser1.id,
      needId: need5.id,
      quantity: 2,
      category: NeedCategory.TABLETS,
      itemDescription: '2 Lenovo M10 HD Tablets with preloaded learning apps',
      trackingNumber: 'BLUEDART-8829-4100',
      status: DonationStatus.CONFIRMED,
      initiatedAt: new Date(Date.now() - 86400 * 1000 * 2),
      confirmedAt: new Date(Date.now() - 86400 * 1000 * 1),
      notes: 'Dispatched via courier, expected delivery in 48 hours.',
    },
  });

  // 10. Career Resources (10 distinct pathways)
  console.log('Creating career paths for Class 9-10 learners...');
  const careerPaths = [
    {
      title: 'Software Engineering & Artificial Intelligence',
      category: 'Computer Science',
      summary: 'Build computer software, web platforms, and mobile apps that solve human challenges at scale.',
      coreSkills: ['Logic & Problem Solving', 'Mathematics', 'Python / Javascript', 'Critical Thinking'],
      subjects: ['Class 9-10 Mathematics', 'Science', 'Computer Science'],
      educationPath: ['Class 10 CBSE/State Board', 'Class 11-12 PCM (Physics, Chemistry, Maths)', 'B.Tech / B.Sc in Computer Science / BCA', 'Software Developer / AI Specialist'],
      roadmap: ['Master school algebra and logical puzzles', 'Learn basic Python and HTML/CSS', 'Build small projects like calculators and games', 'Explore open-source technology and scholarships'],
    },
    {
      title: 'Medicine & Healthcare (Doctor, Nurse, Paramedic)',
      category: 'Medicine',
      summary: 'Diagnose illnesses, heal patients, and advance public healthcare in hospitals and clinics.',
      coreSkills: ['Biology', 'Empathy & Patient Care', 'Chemistry', 'Attention to Detail'],
      subjects: ['Science (Biology, Chemistry)', 'English'],
      educationPath: ['Class 10 Board', 'Class 11-12 PCB (Physics, Chemistry, Biology)', 'NEET Exam / Nursing Entrance', 'MBBS / BDS / B.Sc Nursing'],
      roadmap: ['Understand plant & animal cell structures in Class 8-9', 'Master human organ systems and nutrition', 'Participate in first-aid training', 'Prepare for medical entrance with structured biology revision'],
    },
    {
      title: 'Chartered Accountancy, Finance & Banking',
      category: 'Commerce',
      summary: 'Manage corporate finances, audit accounting records, and guide tax and financial planning.',
      coreSkills: ['Arithmetic & Percentages', 'Business Ethics', 'Analytical Mindset', 'Spreadsheets'],
      subjects: ['Mathematics', 'Social Science (Economics)', 'English'],
      educationPath: ['Class 10 Board', 'Class 11-12 Commerce with Maths', 'CA Foundation / B.Com Honours', 'Chartered Accountant / Financial Analyst'],
      roadmap: ['Master profit-loss, simple interest, and algebra in Class 8', 'Read business news summaries', 'Learn Microsoft Excel basics', 'Understand how banking and UPI works'],
    },
    {
      title: 'Civil Services & Public Administration (IAS / IPS)',
      category: 'Government Services',
      summary: 'Lead public policy execution, district administration, and governance across India.',
      coreSkills: ['General Knowledge', 'Ethics & Leadership', 'Indian Polity & History', 'Public Communication'],
      subjects: ['Social Science (History, Civics, Geography)', 'Hindi', 'English'],
      educationPath: ['Class 10 Board', 'Class 11-12 Any Stream', 'Graduation in Any Subject (BA / B.Sc / B.Tech)', 'UPSC Civil Services Examination'],
      roadmap: ['Read daily newspaper editorial summaries', 'Master Indian Constitution basics in Class 8 Civics', 'Participate in school debates and speech competitions', 'Build strong ethical reasoning and essay writing skills'],
    },
    {
      title: 'Graphic Design, UI/UX & Digital Animation',
      category: 'Design',
      summary: 'Design visual identities, smartphone interfaces, and creative digital media.',
      coreSkills: ['Visual Creativity', 'Color Theory', 'Figma / Canva / Photoshop', 'Empathy with Users'],
      subjects: ['Art', 'Computer Skills', 'English'],
      educationPath: ['Class 10 Board', 'Class 11-12 Any Stream', 'B.Des / NID / NIFT Entrance', 'Product Designer / UI/UX Specialist'],
      roadmap: ['Sketch daily objects and study geometric symmetry', 'Experiment with digital drawing tools on tablets', 'Learn typography and layout rules', 'Create a simple portfolio of posters and digital artwork'],
    },
  ];

  for (const cp of careerPaths) {
    await prisma.careerResource.create({
      data: {
        title: cp.title,
        category: cp.category,
        summary: cp.summary,
        coreSkillsJson: JSON.stringify(cp.coreSkills),
        subjectsRecommendedJson: JSON.stringify(cp.subjects),
        educationPathJson: JSON.stringify(cp.educationPath),
        roadmapJson: JSON.stringify(cp.roadmap),
      },
    });
  }

  // 11. Life Skills & Digital Literacy Modules
  console.log('Creating digital and life skills modules...');
  await prisma.lifeSkill.create({
    data: {
      title: 'Internet Safety & Cyber Security Essentials',
      category: 'cyber_safety',
      description: 'How to browse safely, protect personal passwords, recognize phishing attempts, and avoid online scams.',
      videoUrl: 'https://www.youtube-nocookie.com/embed/aO858HyFbKI',
      contentMarkdown: `# Internet Safety & Cyber Hygiene Guide

## 1. Protecting Your Digital Identity
- Never share your passwords, OTPs, or home address with strangers online.
- Use strong passphrases containing letters, numbers, and symbols.
- Log out of shared public computers in libraries and learning centers.

## 2. Recognizing Phishing & Scams
- If an email or message offers free smartphones, money, or threats to block your account, it is likely a fake scam.
- Never click on unverified suspicious links sent via SMS or messaging apps.

## 3. Cyberbullying and Reporting
- If anyone makes you feel uncomfortable or threatens you online, inform institution staff immediately.
- National Cyber Crime Helpline: 1930.`,
    },
  });

  await prisma.lifeSkill.create({
    data: {
      title: 'Financial Literacy 101: Saving, Budgeting & Smart Money Habits',
      category: 'financial_literacy',
      description: 'Understanding currency, budgeting personal expenses, bank accounts, and saving for future education.',
      videoUrl: 'https://www.youtube-nocookie.com/embed/HQzoZfc3GwQ',
      contentMarkdown: `# Financial Literacy: Budgeting Basics

## 1. Needs vs. Wants
- **Needs**: Essential for survival and education (books, food, healthcare, clothing).
- **Wants**: Desires that can wait (toys, video games, fancy snacks).

## 2. The 50-30-20 Rule Simplified
- 50% for necessities
- 30% for personal growth and small goals
- 20% dedicated to savings in a bank account

## 3. Power of Compound Interest
Even saving 10 rupees daily builds financial discipline and compounds over time!`,
    },
  });

  // 12. Notifications
  console.log('Creating in-app notifications...');
  await prisma.notification.create({
    data: {
      userId: volUser1.id,
      title: 'Teaching Request Approved',
      message: 'Asha Kiran Children Home has approved your Class 8 Mathematics session for Sunday at 10:00 AM.',
      link: '/teach/sessions',
    },
  });

  await prisma.notification.create({
    data: {
      userId: instUser1.id,
      title: 'Donation Received & Awaiting Verification',
      message: 'Donor Rajesh Patel dispatched 5 sets of Mathematics textbooks. Please verify upon unboxing.',
      link: '/dashboard/institution',
    },
  });

  await prisma.notification.create({
    data: {
      userId: learnerUser1.id,
      title: 'Mathematics Quiz Result Ready',
      message: 'You scored 8/10 on Linear Equations! Check out your recommended revision topic.',
      link: '/dashboard/learner',
    },
  });

  // 13. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'INSTITUTION_VERIFIED',
      entityType: 'Institution',
      entityId: inst1.id,
      detailsJson: JSON.stringify({ verifiedBy: 'Dr. Anita Roy', docChecked: 'DL-CCI-2018-9412' }),
    },
  });

  console.log('Seed completed successfully with realistic social impact data.');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
