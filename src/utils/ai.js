import OpenAI from "openai";
import tools from '../tools/index.js';

export const openai = new OpenAI();

export async function completeWithTools(args) {
  const completion = await openai.chat.completions.create(args)

  if (completion.choices[0].message.tool_calls) {
    const toolCall = completion.choices[0].message.tool_calls[0];
    const toolArgs = JSON.parse(toolCall.function.arguments);

    console.log("\n\n"+"#".repeat(40));
    console.log(`tool_calling: ${toolCall.function.name}(${JSON.stringify(toolArgs)})`)
    const result = await tools.functions[toolCall.function.name](toolArgs);

    args.messages.push(completion.choices[0].message); // append model's function call message
    args.messages.push({                               // append result message
        role: "tool",
        tool_call_id: toolCall.id,
        content: result
    });
    return completeWithTools(args)
  }
  console.log("\n\n"+"#".repeat(40));
  console.log(completion.choices[0].message.content)
  return completion
}