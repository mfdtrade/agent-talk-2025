import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod';
import { zodFunction } from "openai/helpers/zod";
import { completeWithTools } from '../utils/ai.js'


// ####################################################################################
// CREATE - Add New Todos
export async function checkGoalDone(goal, answer) {
  const resp = await completeWithTools({
    model: "gpt-4o-mini",
    messages: [{
      role: "developer",
      content: `You are a strict critic. Given the following question, determine if the answer a full anwser to the question.\n\nQuestion: ${goal}\n\nAnswer: ${answer}`,
    }],
    response_format: zodResponseFormat(z.object({done: z.boolean()}), "doneResponseSchema")
  })
  const check = JSON.parse(resp.choices[0].message.content)
  console.log("\n\n"+"#".repeat(40));
  console.log(`LLM as judge: ${ check.done ? "👍":"👎"}`)
  return JSON.stringify(check)
}

export const checkGoalDoneToolConfig = zodFunction({
    name: "checkGoalDone",
    description: "Check if the answer successfully meets the requested goal.",
    parameters: z.object({
        goal: z.string().describe("The requested goal to be completed."),
        answer: z.string().describe("The answer that will be provided to the requesting party to complete that goal.")
    })
})
