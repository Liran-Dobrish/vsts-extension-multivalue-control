/**
 * Wiki Client for fetching list values from Azure DevOps Wiki
 */
import * as SDK from "azure-devops-extension-sdk";
import { WikiRestClient } from "azure-devops-extension-api/Wiki";
import { getClient } from "azure-devops-extension-api";

interface WikiConfig {
    projectName: string;
    wikiName?: string;
    wikiPagePath: string;
}

/**
 * Fetch values from an Azure DevOps Wiki page
 * The wiki page can contain either:
 * 1. A JSON array: ["Name 1", "Name 2", "Name 3"]
 * 2. One name per line (plain text or markdown list)
 */
export async function fetchValuesFromWiki(config: WikiConfig): Promise<string[]> {
    try {
        console.log("Step 1: Initializing SDK...");
        await SDK.ready();
        
        console.log("Step 2: SDK ready");
        console.log("=== Wiki Extension (using azure-devops-extension-sdk) ===");
        
        // If wikiName is not provided, use the project wiki (projectName.wiki)
        const wikiIdentifier = config.wikiName || `${config.projectName}.wiki`;
        
        console.log("Step 3: Getting Wiki REST client...");
        console.log("Wiki Project Name:", config.projectName);
        console.log("Wiki Identifier:", wikiIdentifier);
        console.log("Wiki Page Path:", config.wikiPagePath);
        
        // Get the Wiki REST client from the SDK
        const wikiClient = getClient(WikiRestClient);
        
        console.log("Step 4: Fetching page text from wiki...");
        
        // Fetch the wiki page content
        const pageText = await wikiClient.getPageText(
            config.projectName,
            wikiIdentifier,
            config.wikiPagePath,
            undefined, // recursionLevel
            undefined, // versionDescriptor
            true       // includeContent
        );
        
        console.log("Step 5: Wiki page content received");
        console.log("Page text length:", pageText?.length || 0);
        
        if (!pageText) {
            console.warn("Wiki page has no content");
            return [];
        }
        
        console.log("Step 6: Parsing wiki content");
        console.log("Content preview:", pageText.substring(0, 200));
        
        // Parse the content
        const values = parseWikiContent(pageText);
        
        console.log("Step 7: Successfully parsed values:", values);
        return values;
    } catch (error) {
        console.error("=== ERROR in fetchValuesFromWiki ===");
        console.error("Error message:", error?.message || error);
        console.error("Full error:", error);
        throw error;
    }
}

/**
 * Parse wiki content to extract list of values
 * Supports multiple formats:
 * 1. JSON array: ["Name 1", "Name 2"]
 * 2. Markdown list: - Name 1\n- Name 2
 * 3. Plain text list: Name 1\nName 2
 */
function parseWikiContent(content: string): string[] {
    // Try to parse as JSON first
    try {
        const trimmed = content.trim();
        
        // Check if it looks like JSON
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map(item => String(item)).filter(v => !!v);
            }
        }
        
        // Check if it's a JSON object with a "values" or "names" property
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            const parsed = JSON.parse(trimmed);
            if (parsed.values && Array.isArray(parsed.values)) {
                return parsed.values.map(item => String(item)).filter(v => !!v);
            }
            if (parsed.names && Array.isArray(parsed.names)) {
                return parsed.names.map(item => String(item)).filter(v => !!v);
            }
        }
    } catch (e) {
        // Not JSON, continue to text parsing
    }
    
    // Parse as text/markdown list
    const lines = content.split(/\r?\n/);
    const values: string[] = [];
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip empty lines
        if (!line) {
            continue;
        }
        
        // Skip markdown headings
        if (line.startsWith("#")) {
            continue;
        }
        
        // Skip HTML comments
        if (line.startsWith("<!--") || line.endsWith("-->")) {
            continue;
        }
        
        // Remove markdown list markers (-, *, +, or numbered)
        line = line.replace(/^[-*+]\s+/, "");
        line = line.replace(/^\d+\.\s+/, "");
        
        // Remove markdown formatting (bold, italic, code)
        line = line.replace(/\*\*(.*?)\*\*/g, "$1"); // Bold
        line = line.replace(/\*(.*?)\*/g, "$1"); // Italic
        line = line.replace(/`(.*?)`/g, "$1"); // Code
        
        line = line.trim();
        
        if (line) {
            values.push(line);
        }
    }
    
    return values;
}
