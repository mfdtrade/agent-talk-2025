import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod';
import tools from '../tools/index.js';
import { completeWithTools, openai } from '../utils/ai.js';
const prompt = "I want to buy a hoodie with a fur lined hood. It needs a full zipper. Near Times Square in NYC. Where can I buy one today at lunch time?"

const doneResponseSchema = z.object({
  done: z.boolean(),
});

async function main() {
  const completion = await completeWithTools({
    messages: [{ role: "developer", content: prompt }],
    model: "gpt-4o-mini",
    tool_choice: "auto",
    tools: [tools.searchGoogleToolConfig],
    store: false
  });

  const answer = completion.choices[0].message.content
  console.log("\n\n"+"#".repeat(40));
  console.log(`Answer: ${answer}`);

  const check = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "developer",
      content: `You are a strict critic. Given the following question, determine if the answer a full anwser to the question.\n\nQuestion: ${prompt}\n\nAnswer: ${answer}`,
    }],
    response_format: zodResponseFormat(doneResponseSchema, "doneResponseSchema")
  })
  console.log("\n\n"+"#".repeat(40));
  console.log(`LLM as judge: ${JSON.parse(check.choices[0].message.content).done ? "👍":"👎"}`)
}

main();