async function test() {
  const url = 'https://www.youtube.com/playlist?list=PLVLoWQFkZbhVylYe3R4C-Rawvy9kqeAgr';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  const regex = /"contentId":"([a-zA-Z0-9_-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO".*?"accessibilityContext":\{"label":"([^"]+)"\}/gs;
  let m;
  let count = 0;
  while ((m = regex.exec(text)) !== null) {
    count++;
    if (count <= 10) {
      console.log(count, m[1], m[2].substring(0, 80));
    }
  }
  console.log('Total matches found:', count);
}
test();

