import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bloodTypePersonalities = {
  A: 'calm, detail-oriented, and responsible',
  B: 'creative, energetic, and curious',
  O: 'confident, outgoing, and strong-willed',
  AB: 'rational, cool-headed, and unique',
};

const birthMonthPersonalities = {
  '1': 'ambitious and disciplined',
  '2': 'compassionate and intuitive',
  '3': 'cheerful and artistic',
  '4': 'practical and loyal',
  '5': 'curious and adaptable',
  '6': 'caring and protective',
  '7': 'thoughtful and analytical',
  '8': 'bold and strong-minded',
  '9': 'kind and idealistic',
  '10': 'determined and charismatic',
  '11': 'intense and visionary',
  '12': 'joyful and imaginative',
};

export async function POST(req) {
  const { input_data_1, input_data_2, language } = await req.json();

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
