import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod';
import OpenAI from "openai";
import * as serp from "serpapi";


const openai = new OpenAI();

const prompt = "I want to buy a hoodie with a fur lined hood. It needs a full zipper. Near Times Square in NYC. Where can I buy one today at lunch time?"

const doneResponseSchema = z.object({
  done: z.boolean(),
});

async function searchGoogle({query, location="Philadelphia, PA"}) {
  console.log("\n\n"+"#".repeat(40))
  console.log(`Searching Google[${location}]: ${query}\n\n`)
  const resp = await serp.getJson({
    engine: "google",
    api_key: process.env.SERP_API_KEY, // Get your API_KEY from https://serpapi.com/manage-api-key
    q: query,
    location
  })
  const stringResult = resp.organic_results.slice(0,5).map(el => `${el.title}: ${el.snippet}\n${el.link}`).join('\n\n')
  console.log(stringResult)
  return stringResult
}

const searchGoogleToolConfig = {
  "type": "function",
  "function": {
      "name": "searchGoogle",
      "description": "Run a search query against google for information from the web.",
      "strict": true,
      "parameters": {
          "type": "object",
          "properties": {
              "query": {
                  "type": "string",
                  "description": "The search query to send to gogole."
              },
              "location": {
                "type": ["string","null"],
                "description": "What city to send the query from. This will effect the localization and provide better information for location specific queries.",
              }
          },
          "required": [
              "query",
              "location"
          ],
          "additionalProperties": false
      },
      "strict": true
  }
};

const tools = {
  "searchGoogle": searchGoogle
}

async function completeWithTools(args) {
  const completion = await openai.chat.completions.create(args)

  if (completion.choices[0].message.tool_calls) {
    const toolCall = completion.choices[0].message.tool_calls[0];
    const toolArgs = JSON.parse(toolCall.function.arguments);

    console.log("\n\n"+"#".repeat(40));
    console.log(`tool_calling: ${toolCall.function.name}(${JSON.stringify(toolArgs)})`)
    const result = await tools[toolCall.function.name](toolArgs);

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


async function main() {
  const completion = await completeWithTools({
    messages: [{ role: "developer", content: prompt }],
    model: "gpt-4o-mini",
    tool_choice: "auto",
    tools: [searchGoogleToolConfig],
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