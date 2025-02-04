import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod';
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = "What is the average wing speed of a swallow?"

const doneResponseSchema = z.object({
  done: z.boolean(),
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: prompt }],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0].message);

  const check = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "developer",
      content: `Given the following question, determine if the answer is sufficent.\n\nQuestion: ${prompt}\n\nAnswer: ${completion.choices[0].message.content}`,
    }],
    response_format: zodResponseFormat(doneResponseSchema, "doneResponseSchema")
  })
  console.log(check.choices[0].message)
}

main();