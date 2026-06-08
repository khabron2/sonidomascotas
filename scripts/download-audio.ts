import fs from 'fs';
import path from 'path';

const AUDIOS = {
  dog: '1HMXQPZYKNOldLdylB2h3NEkGTLJ8Qh9d',
  cat: '19bdtjpE9XHk74B10i52JHSjUHWKIH3Dr',
  canary: '1KU875gyACvMCpmTTIRuyefm6W-zcYRMx',
  rabbit: '1y1c4UELaCGfPQ1AgRgsE4fY3_PR4zaRs',
  turtle: '1eI3qtct2_eq6ZVWHOyMaUlG9nb2li2Js'
};

async function downloadFile(id: string, outputPath: string) {
  const url = `https://docs.google.com/uc?export=download&id=${id}`;
  console.log(`Downloading sound from Google Drive ID: ${id}...`);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved successfully to ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading ID ${id}:`, error);
  }
}

async function run() {
  const publicDir = path.join(process.cwd(), 'public');
  const audioDir = path.join(publicDir, 'audio');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
  }

  for (const [name, id] of Object.entries(AUDIOS)) {
    const dest = path.join(audioDir, `${name}.mp3`);
    await downloadFile(id, dest);
  }
  console.log('All audio processing completed! ✨');
}

run();
