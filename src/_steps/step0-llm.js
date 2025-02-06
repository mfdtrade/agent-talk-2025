// From OpenAI docs:
// https://platform.openai.com/docs/api-reference/chat/create
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: "This is a hello world example. Can you tell me your name?" }],
    model: "gpt-4o",
  });

  console.log(completion.choices[0]);
}

main();