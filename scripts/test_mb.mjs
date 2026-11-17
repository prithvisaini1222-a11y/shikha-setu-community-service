async function getCourseList(classNum) {
  const url = `https://www.magnetbrains.com/courses/cbse-class-${classNum}th-full-video-course/`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const text = await res.text();
  const regex = /<a\s+href="(https:\/\/www\.magnetbrains\.com\/course\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  const map = new Map();
  while ((m = regex.exec(text)) !== null) {
    const link = m[1];
    const title = m[2].replace(/<[^>]+>/g, '').trim();
    if (title && !map.has(link) && title.length > 3) {
      map.set(link, title);
    }
  }
  console.log(`\n=== CLASS ${classNum} COURSES (${map.size} found) ===`);
  for (const [link, title] of map.entries()) {
    console.log(`  ${title} -> ${link}`);
  }
}

async function run() {
  await getCourseList(9);
  await getCourseList(10);
}

run();
