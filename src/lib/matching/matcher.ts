export interface MatchCandidate {
  volunteerSkills: string;
  volunteerSubjects: string;
  volunteerClasses: string;
  volunteerAvailability: string;
  volunteerMode: string;
  volunteerExperienceYears: number;
  needSubject?: string | null;
  needClassLevel?: number | null;
  needMode?: string | null;
  needUrgency?: string | null;
}

export interface MatchResult {
  score: number;
  reasons: { label: string; passed: boolean; weight: number }[];
  percentage: number;
}

export function calculateVolunteerNeedMatch(candidate: MatchCandidate): MatchResult {
  const reasons: { label: string; passed: boolean; weight: number }[] = [];
  let totalScore = 0;

  // 1. Subject Match (30%)
  const volSubjects = (candidate.volunteerSubjects || '').toLowerCase();
  const needSubject = (candidate.needSubject || '').toLowerCase();
  const subjectMatched =
    needSubject && (volSubjects.includes(needSubject) || candidate.volunteerSkills.toLowerCase().includes(needSubject));

  if (subjectMatched) {
    totalScore += 30;
    reasons.push({ label: `Direct Subject Match (${candidate.needSubject})`, passed: true, weight: 30 });
  } else {
    reasons.push({ label: `Subject mismatch (${candidate.needSubject || 'General'})`, passed: false, weight: 30 });
  }

  // 2. Class Level Match (20%)
  const volClasses = (candidate.volunteerClasses || '').split(',').map((s) => s.trim());
  const classMatched = candidate.needClassLevel ? volClasses.includes(String(candidate.needClassLevel)) : true;

  if (classMatched) {
    totalScore += 20;
    reasons.push({ label: `Grade / Class Alignment (Class ${candidate.needClassLevel || 'All'})`, passed: true, weight: 20 });
  } else {
    reasons.push({ label: `Grade level difference (Target: Class ${candidate.needClassLevel})`, passed: false, weight: 20 });
  }

  // 3. Availability Match (20%)
  const availability = (candidate.volunteerAvailability || '').toLowerCase();
  const hasWeekendOrFlexible = availability.includes('sunday') || availability.includes('weekend') || availability.includes('flexible');
  if (hasWeekendOrFlexible) {
    totalScore += 20;
    reasons.push({ label: 'Preferred Timing Match (Weekend / Flexible Schedule)', passed: true, weight: 20 });
  } else {
    totalScore += 12;
    reasons.push({ label: 'Partial availability match', passed: true, weight: 12 });
  }

  // 4. Mode / Location Match (10%)
  const volMode = (candidate.volunteerMode || 'online').toLowerCase();
  const needMode = (candidate.needMode || 'online').toLowerCase();
  const modeMatched = volMode === 'both' || volMode === needMode || needMode === 'online';

  if (modeMatched) {
    totalScore += 10;
    reasons.push({ label: `Delivery Mode Alignment (${volMode.toUpperCase()})`, passed: true, weight: 10 });
  } else {
    reasons.push({ label: `Different mode requested (${needMode})`, passed: false, weight: 10 });
  }

  // 5. Experience (10%)
  if (candidate.volunteerExperienceYears >= 3) {
    totalScore += 10;
    reasons.push({ label: `High Teaching Experience (${candidate.volunteerExperienceYears}+ years)`, passed: true, weight: 10 });
  } else if (candidate.volunteerExperienceYears >= 1) {
    totalScore += 7;
    reasons.push({ label: `Prior Tutoring Experience (${candidate.volunteerExperienceYears} year)`, passed: true, weight: 7 });
  } else {
    totalScore += 4;
    reasons.push({ label: 'First-time motivated volunteer', passed: true, weight: 4 });
  }

  // 6. Institution Need Urgency (10%)
  if (candidate.needUrgency === 'URGENT') {
    totalScore += 10;
    reasons.push({ label: 'Priority Urgency Alignment (High Need)', passed: true, weight: 10 });
  } else if (candidate.needUrgency === 'NEEDED') {
    totalScore += 8;
    reasons.push({ label: 'Standard priority need match', passed: true, weight: 8 });
  } else {
    totalScore += 5;
    reasons.push({ label: 'Ongoing educational need', passed: true, weight: 5 });
  }

  const percentage = Math.min(100, Math.max(0, Math.round(totalScore)));

  return {
    score: totalScore,
    percentage,
    reasons,
  };
}
