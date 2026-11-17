import fs from 'fs';

const sources = [
  { subject: 'Mathematics', book: 'Ganita Prakash', file: 'C:\\Users\\saini\\.gemini\\antigravity-ide\\brain\\72b65639-6984-446b-8bee-581d18ee16a6\\.system_generated\\steps\\171\\content.md' },
  { subject: 'Science', book: 'Curiosity', file: 'C:\\Users\\saini\\.gemini\\antigravity-ide\\brain\\72b65639-6984-446b-8bee-581d18ee16a6\\.system_generated\\steps\\223\\content.md' },
  { subject: 'Social Science', book: 'Exploring Society: India and Beyond', file: 'C:\\Users\\saini\\.gemini\\antigravity-ide\\brain\\72b65639-6984-446b-8bee-581d18ee16a6\\.system_generated\\steps\\225\\content.md' },
  { subject: 'English', book: 'Poorvi', file: 'C:\\Users\\saini\\.gemini\\antigravity-ide\\brain\\72b65639-6984-446b-8bee-581d18ee16a6\\.system_generated\\steps\\227\\content.md' },
  { subject: 'Hindi', book: 'Malhar', file: 'C:\\Users\\saini\\.gemini\\antigravity-ide\\brain\\72b65639-6984-446b-8bee-581d18ee16a6\\.system_generated\\steps\\229\\content.md' },
  { subject: 'Sanskrit', book: 'Deepakam', file: 'C:\\Users\\saini\\.gemini\\antigravity-ide\\brain\\72b65639-6984-446b-8bee-581d18ee16a6\\.system_generated\\steps\\231\\content.md' },
];

const regex = /"contentId":"([a-zA-Z0-9_-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO".*?"accessibilityContext":\{"label":"([^"]+)"\}/gs;

function parseDuration(label) {
  const match = label.match(/(\d+)\s*hours?(?:,\s*(\d+)\s*minutes?)?(?:,\s*(\d+)\s*seconds?)?|(\d+)\s*minutes?(?:,\s*(\d+)\s*seconds?)?|(\d+)\s*seconds?/i);
  if (!match) return { duration: '15m', durationSeconds: 900 };
  let hours = parseInt(match[1] || '0', 10);
  let minutes = parseInt(match[2] || match[4] || '0', 10);
  let seconds = parseInt(match[3] || match[5] || match[6] || '0', 10);
  let durationSeconds = hours * 3600 + minutes * 60 + seconds;
  let durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
  return { duration: durationStr, durationSeconds: Math.max(durationSeconds, 60) };
}

function cleanTitle(label) {
  // strip duration at the end
  let title = label.replace(/\s*\d+\s*(?:hours?|minutes?|seconds?)(?:,\s*\d+\s*(?:minutes?|seconds?))*\s*$/i, '').trim();
  return title;
}

const parsedBySubject = {};

for (const s of sources) {
  const content = fs.readFileSync(s.file, 'utf8');
  let m;
  const list = [];
  const seen = new Set();
  while ((m = regex.exec(content)) !== null) {
    const [, id, rawLabel] = m;
    if (!seen.has(id)) {
      seen.add(id);
      const { duration, durationSeconds } = parseDuration(rawLabel);
      const title = cleanTitle(rawLabel);
      list.push({
        youtubeVideoId: id,
        youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
        title,
        rawLabel,
        duration,
        durationSeconds,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      });
    }
  }
  parsedBySubject[s.subject] = list;
  console.log(`${s.subject}: parsed ${list.length} videos`);
}

fs.writeFileSync('scripts/parsed_raw_videos.json', JSON.stringify(parsedBySubject, null, 2));
console.log('Saved to scripts/parsed_raw_videos.json');
