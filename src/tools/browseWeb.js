import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

export async function browseWeb({url}) {
    console.log("\n\n"+"#".repeat(40))
    console.log(`Browsing web: ${url}`)

    // Use the built-in fetch (Node.js 18+)
    const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                        'Chrome/114.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    });
    if (!response.ok) {
        console.log(response)
        return 'Error retrieving website.'
        //throw new Error(`Network error: ${response.statusText}`);
    }

    // Get the HTML content as text
    const html = await response.text();

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);
    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });

    // Clean up HTML by removing unnecessary elements
    $("script, style, nav, footer, iframe, .ads").remove();

    // Extract title and main content
    const title = $("title").text().trim() || $("h1").first().text().trim();
    const mainContent = $("article, main, .content, #content, .post").first().html() || $("body").html();
    const content = turndown.turndown(mainContent || "");
    const result = `---\ntitle: '${title}'\n---\n\n${content}`
    console.log(result.substring(0,500))        
    return result;
}

export const browseWebToolConfig = zodFunction({
    name: "browseWeb",
    description: "Visit a URL and return a markdown version of the browsed page content.",
    parameters: z.object({
        url: z.string().describe("The url of the web page to go get and return as markdown.")
    })
})