import fs from 'fs';

const ALL_PLAYLISTS = [
  // CLASS 7
  { classNum: 7, subject: 'Mathematics', book: 'Ganita Prakash', playlistId: 'PLVLoWQFkZbhV2kPbhWwSbAXR5jLzFd9tW' },
  { classNum: 7, subject: 'Science', book: 'Curiosity', playlistId: 'PLVLoWQFkZbhUONdEiUdHSE-jXnwdDd1Gh' },
  { classNum: 7, subject: 'Social Science', book: 'Exploring Society: India and Beyond', playlistId: 'PLVLoWQFkZbhVa0fULu_32vdXXf_7ZGhHz' },
  { classNum: 7, subject: 'English', book: 'Poorvi', playlistId: 'PLVLoWQFkZbhWRhe-qQo9FFV6rYDxFj5eh' },
  { classNum: 7, subject: 'Hindi', book: 'Malhar', playlistId: 'PLVLoWQFkZbhWQtJEMEHtW9NtpvK9Tyx8r' },
  { classNum: 7, subject: 'Sanskrit', book: 'Deepakam', playlistId: 'PLVLoWQFkZbhUvnyvtrj2jKvat-Zn_oGyu' },

  // CLASS 8
  { classNum: 8, subject: 'Mathematics', book: 'Ganita Prakash', playlistId: 'PLVLoWQFkZbhVylYe3R4C-Rawvy9kqeAgr' },
  { classNum: 8, subject: 'Science', book: 'Curiosity', playlistId: 'PLVLoWQFkZbhVe8qLXRTrE6P4lF52LSNzY' },
  { classNum: 8, subject: 'Social Science', book: 'Exploring Society: India and Beyond', playlistId: 'PLVLoWQFkZbhX1yVObiu0oBLu6u3Q7Ueo-' },
  { classNum: 8, subject: 'English', book: 'Poorvi', playlistId: 'PLVLoWQFkZbhWkWcYQLbRj2g21jEspRLA3' },
  { classNum: 8, subject: 'Hindi', book: 'Malhar', playlistId: 'PLVLoWQFkZbhVextVKYng4lFk7skWeYubC' },
  { classNum: 8, subject: 'Sanskrit', book: 'Deepakam', playlistId: 'PLVLoWQFkZbhWtH8WYzfktnsFe3Nw559gB' },

  // CLASS 9
  { classNum: 9, subject: 'Mathematics', book: 'NCERT Mathematics', playlistId: 'PLVLoWQFkZbhUuXWTf8-ZhlxapOrJgeyFC' },
  { classNum: 9, subject: 'Mathematics', book: 'NCERT Mathematics (Chapters)', playlistId: 'PLVLoWQFkZbhWcuTEpX04Be5CmPqGwrjxR' },
  { classNum: 9, subject: 'Science', book: 'NCERT Science', playlistId: 'PLVLoWQFkZbhUgNkSyuuyuE1ex8CiDhffJ' },
  { classNum: 9, subject: 'Science', book: 'NCERT Science (Chemistry)', playlistId: 'PLVLoWQFkZbhX23S8Q7qYCwad4Z0UGxeoq' },
  { classNum: 9, subject: 'Science', book: 'NCERT Science (Physics)', playlistId: 'PLVLoWQFkZbhWeKBQvWFzbzjWVeorA7N92' },
  { classNum: 9, subject: 'Social Science', book: 'NCERT Social Science', playlistId: 'PLVLoWQFkZbhVxEF-tkn0xnqmy0FY2ybqg' },
  { classNum: 9, subject: 'English', book: 'Beehive & Moments', playlistId: 'PLVLoWQFkZbhWvnzQBSVOj14dJlH6YeoQc' },
  { classNum: 9, subject: 'English', book: 'Beehive & Moments (Part 2)', playlistId: 'PLVLoWQFkZbhVInmJUUcYTyDPY4DDKeaCR' },
  { classNum: 9, subject: 'Hindi', book: 'Kshitij & Kritika', playlistId: 'PLVLoWQFkZbhVLceqKPhJYBfhsArkxiRO8' },
  { classNum: 9, subject: 'Hindi', book: 'Kshitij & Kritika (Part 2)', playlistId: 'PLVLoWQFkZbhWn9FpDXBA9Z8rl9KFkanBm' },

  // CLASS 10
  { classNum: 10, subject: 'Mathematics', book: 'NCERT Mathematics', playlistId: 'PLVLoWQFkZbhWKEdwnxAMWbVWE16zqNWAv' },
  { classNum: 10, subject: 'Science', book: 'NCERT Science (Complete)', playlistId: 'PLVLoWQFkZbhUsgGOhJ4d0x5Ya9dT_W-7A' },
  { classNum: 10, subject: 'Science', book: 'NCERT Science (Physics - Light & Electricity)', playlistId: 'PLVLoWQFkZbhXAipqg8dmzLQOED1uxgUTx' },
  { classNum: 10, subject: 'Science', book: 'NCERT Science (Chemistry - Chemical Reactions)', playlistId: 'PLVLoWQFkZbhV8gdBQOVjUpLW_3jwak-uA' },
  { classNum: 10, subject: 'Science', book: 'NCERT Science (Biology - Life Processes)', playlistId: 'PLVLoWQFkZbhXuBRmnH3CwHsk3ZzNHbXmG' },
  { classNum: 10, subject: 'Science', book: 'NCERT Science (Chemistry - Acids & Bases)', playlistId: 'PLVLoWQFkZbhWaXBY__hSb4UjRRlMNHQEg' },
  { classNum: 10, subject: 'Social Science', book: 'Geography (Contemporary India II)', playlistId: 'PLVLoWQFkZbhUF6s3tx21e_-Dhhn486_2l' },
  { classNum: 10, subject: 'Social Science', book: 'History (India & Contemporary World II)', playlistId: 'PLVLoWQFkZbhXJMA8ncxvxljn3dcyVLc4H' },
  { classNum: 10, subject: 'Social Science', book: 'Geography Part 2', playlistId: 'PLVLoWQFkZbhXzqLiby4Khwqyvf_yBb3bc' },
  { classNum: 10, subject: 'Social Science', book: 'Civics (Democratic Politics II)', playlistId: 'PLVLoWQFkZbhVgB0R37yUZ9BqxFEl7tOK1' },
  { classNum: 10, subject: 'English', book: 'First Flight & Footprints', playlistId: 'PLVLoWQFkZbhXv7Sj5rlnDgy2V-sV8E6Vc' },
  { classNum: 10, subject: 'Hindi', book: 'Kshitij & Kritika Part 2', playlistId: 'PLVLoWQFkZbhW4sWRUHXJPSM8Nv14aA-O_' },
  { classNum: 10, subject: 'Sanskrit', book: 'Shemushi Part 2', playlistId: 'PLVLoWQFkZbhV1jVvDT_7au0TX5l1jqBXo' },
];

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
  return label
    .replace(/\s*\d+\s*(?:hours?|minutes?|seconds?)(?:,\s*\d+\s*(?:minutes?|seconds?))*\s*$/i, '')
    .trim();
}

async function fetchPlaylist(pl) {
  const url = `https://www.youtube.com/playlist?list=${pl.playlistId}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.warn(`[Class ${pl.classNum} ${pl.subject}] Status: ${res.status}`);
      return [];
    }
    const text = await res.text();
    const regex = /"contentId":"([a-zA-Z0-9_-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO".*?"accessibilityContext":\{"label":"([^"]+)"\}/gs;
    let m;
    const list = [];
    const seen = new Set();
    let pos = 1;
    while ((m = regex.exec(text)) !== null) {
      const vid = m[1];
      const rawLabel = m[2];
      if (!seen.has(vid)) {
        seen.add(vid);
        const { duration, durationSeconds } = parseDuration(rawLabel);
        const title = cleanTitle(rawLabel);
        list.push({
          youtubeVideoId: vid,
          youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
          title,
          rawLabel,
          duration,
          durationSeconds,
          thumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
          classNum: pl.classNum,
          subject: pl.subject,
          book: pl.book,
          playlistId: pl.playlistId,
          playlistPosition: pos++,
          source: 'Magnet Brains'
        });
      }
    }
    console.log(`✓ [Class ${pl.classNum} ${pl.subject} - ${pl.book}] ${list.length} videos`);
    return list;
  } catch (err) {
    console.error(`✗ [Class ${pl.classNum} ${pl.subject}] Error:`, err.message);
    return [];
  }
}

async function scrapeAll() {
  console.log('--- Scraping All Educational Videos (Classes 7 to 10) ---');
  const allResults = [];
  const globalSeenIds = new Set();

  for (const pl of ALL_PLAYLISTS) {
    const videos = await fetchPlaylist(pl);
    for (const v of videos) {
      if (!globalSeenIds.has(v.youtubeVideoId)) {
        globalSeenIds.add(v.youtubeVideoId);
        allResults.push(v);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`Total Unique Videos Discovered (Classes 7-10): ${allResults.length}`);
  console.log(`======================================================\n`);

  fs.writeFileSync('scripts/raw_all_classes_videos.json', JSON.stringify(allResults, null, 2));
  console.log('Saved to scripts/raw_all_classes_videos.json');
}

scrapeAll();

