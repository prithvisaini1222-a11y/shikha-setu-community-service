const playlists = [
  { classNum: 7, subject: 'Mathematics', book: 'Ganita Prakash', id: 'PLVLoWQFkZbhV2kPbhWwSbAXR5jLzFd9tW' },
  { classNum: 7, subject: 'Science', book: 'Curiosity', id: 'PLVLoWQFkZbhUONdEiUdHSE-jXnwdDd1Gh' },
  { classNum: 7, subject: 'Social Science', book: 'Exploring Society', id: 'PLVLoWQFkZbhVa0fULu_32vdXXf_7ZGhHz' },
  { classNum: 7, subject: 'English', book: 'Poorvi', id: 'PLVLoWQFkZbhWRhe-qQo9FFV6rYDxFj5eh' },
  { classNum: 7, subject: 'Hindi', book: 'Malhar', id: 'PLVLoWQFkZbhWQtJEMEHtW9NtpvK9Tyx8r' },
  { classNum: 7, subject: 'Sanskrit', book: 'Deepakam', id: 'PLVLoWQFkZbhUvnyvtrj2jKvat-Zn_oGyu' },

  { classNum: 8, subject: 'Mathematics', book: 'Ganita Prakash', id: 'PLVLoWQFkZbhVylYe3R4C-Rawvy9kqeAgr' },
  { classNum: 8, subject: 'Science', book: 'Curiosity', id: 'PLVLoWQFkZbhVe8qLXRTrE6P4lF52LSNzY' },
  { classNum: 8, subject: 'Social Science', book: 'Exploring Society', id: 'PLVLoWQFkZbhX1yVObiu0oBLu6u3Q7Ueo-' },
  { classNum: 8, subject: 'English', book: 'Poorvi', id: 'PLVLoWQFkZbhWkWcYQLbRj2g21jEspRLA3' },
  { classNum: 8, subject: 'Hindi', book: 'Malhar', id: 'PLVLoWQFkZbhVextVKYng4lFk7skWeYubC' },
  { classNum: 8, subject: 'Sanskrit', book: 'Deepakam', id: 'PLVLoWQFkZbhWtH8WYzfktnsFe3Nw559gB' },
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
  for (const pl of playlists) {
    await fetchPlaylist(pl);
  }
}

runAll();

