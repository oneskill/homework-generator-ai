import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

async function evaluateVoiceRecording(filePath: string, expectedText: string): Promise<number> {
  return Math.floor(Math.random() * 101);
}

export async function POST(request: Request) {
  const data = await request.formData();
  const audio = data.get('audio') as File;
  const questionId = data.get('questionId') as string;

  if (!audio || !questionId) {
    return NextResponse.json({ error: 'Missing audio file or question ID' }, { status: 400 });
  }

  const buffer = Buffer.from(await audio.arrayBuffer());
  const filePath = path.join(process.cwd(), 'tmp', `${questionId}.webm`);
  
  await promisify(fs.writeFile)(filePath, buffer);

  try {
    const expectedText = "Sample expected text";
    const score = await evaluateVoiceRecording(filePath, expectedText);

    await promisify(fs.unlink)(filePath);

    return NextResponse.json({ score });
  } catch (error) {
    console.error('Error evaluating voice recording:', error);
    return NextResponse.json({ error: 'Error evaluating voice recording' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};