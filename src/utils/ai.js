import OpenAI from "openai";
import tools from '../tools/index.js';

export const openai = new OpenAI();

export async function completeWithTools(args) {
  // console.log("\n\n"+"#".repeat(40));
  console.log(`Calling llm with: ${JSON.stringify(args.messages[args.messages.length-1]).substring(0,500)}`)

  const completion = await openai.chat.completions.create(args)

  // console.log(`Got back: ${JSON.stringify(completion.choices[0].message)}`)

  if (completion.choices[0].message.tool_calls) {
    const toolCalls = completion.choices[0].message.tool_calls;

    args.messages.push(completion.choices[0].message);

    const toolResps = await Promise.all(toolCalls.map(async (toolCall) => {
      const toolArgs = JSON.parse(toolCall.function.arguments);

      console.log("\n\n"+"#".repeat(40));
      console.log(`tool_calling: ${toolCall.function.name}(${JSON.stringify(toolArgs)})`)
      const result = await tools.functions[toolCall.function.name](toolArgs);

      args.messages.push({                               // append result message
        role: "tool",
        tool_call_id: toolCall.id,
        content: result
      });
    }))


    return completeWithTools(args)
  }
  console.log("\n\n"+"#".repeat(40));
  console.log(completion.choices[0].message.content.substring(0,500))
  return completion
}