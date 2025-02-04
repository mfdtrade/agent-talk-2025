// From OpenAI docs:
// https://platform.openai.com/docs/api-reference/chat/create
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = "What is the average wing speed of a swallow?"

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: prompt }],
    model: "gpt-4o",
  });

  console.log(completion.choices[0].message);

  const check = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "developer",
      content: `Given the following question, determine if the answer is sufficent.\n\nQuestion: ${prompt}\n\nAnswer: ${completion.choices[0].message.content}`,
    }],
    response_format: {
      "type": "json_schema",
      "json_schema": {
        name: "conditionalCheck",
        schema: {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "done": {
              "type": "boolean"
            }
          },
          "required": ["done"],
          "additionalProperties": false
        }
      }
    }
  })
  console.log(check.choices[0].message)
}

main();