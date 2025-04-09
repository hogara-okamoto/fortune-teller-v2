import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';

// 🔽 In case importing the personalities file from local directoty
// import personalities from './data/personalities.json';

// Lighthouse IPFS gateway base
const GATEWAY_BASE_URL = 'https://gateway.lighthouse.storage/ipfs/';

// Path to save JSON temporarily
const LOCAL_PATH = '/tmp/personalities.json'; // `/tmp/` is safe for temp files in serverless environments
const CID = process.env.LIGHTHOUSE_CID;

// Download JSON file from Lighthouse using its CID
async function downloadFromLighthouse(cid, outputPath) {
  const gatewayUrl = `${GATEWAY_BASE_URL}${cid}`;
  console.log('Fetching from:', gatewayUrl);

  try {
    const response = await axios.get(gatewayUrl, { responseType: 'stream' });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Download successful! Saved to ${outputPath}`);
        resolve(true);
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error('Download failed:', err.message);
    return false;
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { input_data_1, input_data_2, language } = await req.json();

  // Download the personalities JSON file
  const success = await downloadFromLighthouse(CID, LOCAL_PATH);
  if (!success) {
    return NextResponse.json({ error: 'Failed to download personality data.' }, { status: 500 });
  }

  // Read and parse the JSON file
  const data = JSON.parse(fs.readFileSync(LOCAL_PATH, 'utf-8'));

  const bloodTypePersonalities = data.bloodTypePersonalities;
  const birthMonthPersonalities = data.birthMonthPersonalities;

  const bloodDesc = bloodTypePersonalities[input_data_1];
  const birthDesc = birthMonthPersonalities[input_data_2];

  const prompt = `You're a fortune teller. Create a mystical and positive fortune based on these two traits:

- Blood Type (${input_data_1}): ${bloodDesc}
- Birth Month (${input_data_2}): ${birthDesc}

Make it poetic and inspiring in ${language}.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({ result: completion.choices[0].message.content });
}
