import tools from '../tools/index.js';
import { completeWithTools } from '../utils/ai.js';

const goal = process.argv[2] || "I want to learn about building agents without a framework."


const prompt = `
You are a helpful assistant working for a busy executive.
Your tone is friendly but direct, they prefer short clear and direct writing.
You try to accomplish the specific task you are given.
You can use any of the tools available to you.
Before you do any work you always make a plan using your Todo list.
You can mark todos off on your todo list after they are complete.

You summarize the actions you took by checking the done list then create a report.
You always ask your assistant to checkGoalDone. If they say you are done you send the report to the user.
If your assistant has feedback you add it to your todo list.

Today is ${new Date()}
`

async function main() {
  const completion = await completeWithTools({
    messages: [
      { role: "developer", content: prompt },
      { role: "user", content: goal}
    ],
    model: "gpt-4o",
    tool_choice: "auto",
    tools: tools.configsArray,
    store: false
  });

  const answer = completion.choices[0].message.content
  console.log("\n\n"+"#".repeat(40));
  console.log(`Answer: ${answer}`);
}

main();