import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod';
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = "What is the average wing speed of a swallow?"

const doneResponseSchema = z.object({
  done: z.boolean(),
});

async function main() {
  console.log("\n\n"+"#".repeat(40));
  console.log(`Question: ${prompt}`);

  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: prompt }],
    model: "gpt-4o-mini",
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