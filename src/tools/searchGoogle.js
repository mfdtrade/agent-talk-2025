import * as serp from "serpapi";
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

export async function searchGoogle({query}) {
    console.log("\n\n"+"#".repeat(40))
    console.log(`Searching Google: ${query}`)
    const resp = await serp.getJson({
        engine: "google",
        api_key: process.env.SERP_API_KEY, // Get your API_KEY from https://serpapi.com/manage-api-key
        q: query
    })
    const stringResult = resp.organic_results.slice(0,5).map(el => `${el.title}: ${el.snippet}\n${el.link}`).join('\n\n')
    console.log(stringResult)
    return stringResult
}

// Define a Zod schema
const searchGoogleSchema = z.object({
    query: z.string().describe("The search query to send to gogole.")
});

export const searchGoogleToolConfig = zodFunction({
    name: "searchGoogle",
    description: "Run a search query against google for information from the web.",
    parameters: searchGoogleSchema
})