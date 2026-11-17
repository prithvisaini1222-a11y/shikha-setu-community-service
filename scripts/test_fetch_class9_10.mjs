const class9_10_playlists = [
  // Class 9
  { classNum: 9, subject: 'Mathematics', book: 'NCERT Mathematics', id: 'PLVLoWQFkZbhUuXWTf8-ZhlxapOrJgeyFC' },
  { classNum: 9, subject: 'Science', book: 'NCERT Science (Physics)', id: 'PLVLoWQFkZbhWeKBQvWFzbzjWVeorA7N92' },
  { classNum: 9, subject: 'Science', book: 'NCERT Science (Chemistry)', id: 'PLVLoWQFkZbhWxwHzOSuMB9LUigxLVLfVE' },
  { classNum: 9, subject: 'English', book: 'Beehive & Moments', id: 'PLVLoWQFkZbhVInmJUUcYTyDPY4DDKeaCR' },
  { classNum: 9, subject: 'Hindi', book: 'Kshitij & Kritika', id: 'PLVLoWQFkZbhWn9FpDXBA9Z8rl9KFkanBm' },
  { classNum: 9, subject: 'Hindi', book: 'Kshitij Full Course', id: 'PLVLoWQFkZbhXTnv5KOt8u7SkQLazUtOFy' },

  // Class 10
  { classNum: 10, subject: 'Mathematics', book: 'NCERT Mathematics', id: 'PLVLoWQFkZbhWKEdwnxAMWbVWE16zqNWAv' },
  { classNum: 10, subject: 'Social Science', book: 'History (India & Contemporary World II)', id: 'PLVLoWQFkZbhXJMA8ncxvxljn3dcyVLc4H' },
  { classNum: 10, subject: 'Social Science', book: 'Geography (Contemporary India II)', id: 'PLVLoWQFkZbhXzqLiby4Khwqyvf_yBb3bc' },
  { classNum: 10, subject: 'Social Science', book: 'Civics (Democratic Politics II)', id: 'PLVLoWQFkZbhVgB0R37yUZ9BqxFEl7tOK1' },
];

async function fetchPlaylist(pl) {
  const url = `https://www.youtube.com/playlist?list=${pl.id}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.log(`[Class ${pl.classNum} ${pl.subject}] HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    const regex = /"contentId":"([a-zA-Z0-9_-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO".*?"accessibilityContext":\{"label":"([^"]+)"\}/gs;
    let m;
    const list = [];
    const seen = new Set();
    while ((m = regex.exec(text)) !== null) {
      const vid = m[1];
      const label = m[2];
      if (!seen.has(vid)) {
        seen.add(vid);
        list.push({ vid, label });
      }
    }
    console.log(`[Class ${pl.classNum} ${pl.subject} - ${pl.book}] Found ${list.length} videos`);
    if (list.length > 0) {
      console.log(`   Sample: ${list[0].label.substring(0, 75)}...`);
    }
    return list;
  } catch (err) {
    console.error(`[Class ${pl.classNum} ${pl.subject}] Error:`, err.message);
    return [];
  }
}

async function runAll() {
  for (const pl of class9_10_playlists) {
    await fetchPlaylist(pl);
  }
}

runAll();

