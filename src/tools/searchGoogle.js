import * as serp from "serpapi";
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

const LOCATION_DEFAULT="Philadelphia, PA"

export async function searchGoogle({query, location=LOCATION_DEFAULT}) {
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

// Define a Zod schema
const searchGoogleSchema = z.object({
    query: z.string().describe("The search query to send to gogole."),
    location: z.string().optional().describe("What city to send the query from. This will effect the localization and provide better information for location specific queries.")
});

export const searchGoogleToolConfig = zodFunction({
    name: "searchGoogle",
    description: "Run a search query against google for information from the web.",
    parameters: searchGoogleSchema
})