// From OpenAI docs:
// https://platform.openai.com/docs/api-reference/chat/create
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: "You are a helpful assistant. Who made you and how?" }],
    model: "gpt-4o",
    store: true,
  });

  console.log(completion.choices[0]);
}

main();