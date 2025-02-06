import MiniSearch from 'minisearch'
import fs from 'fs'
import path from 'path'

const docs =  JSON.parse(fs.readFileSync(path.resolve('./src/tools/knowledge.json')))

const miniSearch = new MiniSearch({
    idField: 'content',
    fields: ['type','content']
})

miniSearch.addAll(docs)
console.log(JSON.stringify(miniSearch.search('What should I call you?')[0].id,null,2))
process.exit(-1)

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
