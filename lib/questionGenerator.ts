import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestions(topic: string, maxQuestions: number) {
  const prompt = `Generate ${maxQuestions} multiple-choice questions about ${topic}. Each question should have 4 options with one correct answer. Format the output as a JSON array of objects, where each object has the following structure:
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Correct option text"
  }`;

  try {
    console.log('Sending prompt to OpenAI:', prompt);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('Received response from OpenAI:', response.choices[0].message.content);

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response:', response.choices[0].message.content);
      throw new Error('Failed to parse generated questions');
    }

    if (!Array.isArray(generatedQuestions)) {
      throw new Error('Generated questions are not in the expected format');
    }

    return generatedQuestions.slice(0, maxQuestions);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
}