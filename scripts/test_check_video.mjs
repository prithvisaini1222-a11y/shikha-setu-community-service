const pls = [
  { name: 'Class 10 English First Flight', id: 'PLVLoWQFkZbhXv7Sj5rlnDgy2V-sV8E6Vc' },
  { name: 'Class 10 Hindi Kshitij', id: 'PLVLoWQFkZbhW4sWRUHXJPSM8Nv14aA-O_' },
  { name: 'Class 10 Sanskrit Shemushi', id: 'PLVLoWQFkZbhV1jVvDT_7au0TX5l1jqBXo' },
];

async function run() {
  for (const p of pls) {
    const res = await fetch(`https://www.youtube.com/playlist?list=${p.id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const text = await res.text();
    const regex = /"contentId":"([a-zA-Z0-9_-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO".*?"accessibilityContext":\{"label":"([^"]+)"\}/gs;
    let m;
    let count = 0;
    let sample = '';
    while ((m = regex.exec(text)) !== null) {
      count++;
      if (count === 1) sample = m[2].substring(0, 80);
    }
    console.log(p.name, count, 'videos. Sample:', sample);
  }
}

run();
