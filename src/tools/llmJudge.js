import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod';
import { zodFunction } from "openai/helpers/zod";
import { completeWithTools } from '../utils/ai.js'

const prompt = `
You are research assistant who reads requests and answers.
You determine if the answer satisfies the request.
If it does you respond that the request is done.
If not you give specific feedback on what is missing in the form of actionable individual todos.
`

// ####################################################################################
// CREATE - Add New Todos
export async function checkGoalDone({goal, answer}) {
  const resp = await completeWithTools({
    model: "gpt-4o",
    messages: [{
      role: "developer",
      content: prompt
    },{
        role: "user",
        content: `## Request: ${goal}\n\n## Answer: ${answer}`,
    }],
    response_format: zodResponseFormat(
        z.object({
            done: z.boolean().describe('Does the answer satisfies the request?'),
            feedback: z.array(z.string()).describe('If not done, an array of specific actionable todos that are needed to be done to complete the request')
        }
    ), "doneResponseSchema")
  })
  const check = JSON.parse(resp.choices[0].message.content)
  console.log("\n\n"+"#".repeat(40));
//   console.log(check)
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
