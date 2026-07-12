import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const localAI = createOpenAI({
  baseURL: 'http://127.0.0.1:11434/v1',
  apiKey: 'local'
});

async function main() {
  try {
    const result = await streamText({
      model: localAI.chat('phi3:latest'),
      system: 'Hello',
      messages: [{role: 'user', content: 'hi'}]
    });
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
