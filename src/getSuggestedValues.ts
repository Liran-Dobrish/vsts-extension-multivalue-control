import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { fetchValuesFromWiki } from "./wikiClient";

export async function getSuggestedValues(): Promise<string[]> {
    const inputs: { [key: string]: string } = SDK.getConfiguration().witInputs;
    
    // Check if Wiki configuration is provided
    const wikiProjectName = inputs.WikiProjectName;
    const wikiPagePath = inputs.WikiPagePath;
    
    // If wiki is configured, try to fetch from wiki first
    if (wikiProjectName && wikiPagePath) {
        try {
            const wikiName = inputs.WikiName;
            
            const wikiValues = await fetchValuesFromWiki({
                projectName: wikiProjectName,
                wikiName: wikiName || undefined,
                wikiPagePath: wikiPagePath,
            });
            
            if (wikiValues && wikiValues.length > 0) {
                console.log(`Successfully fetched ${wikiValues.length} values from wiki`);
                return wikiValues;
            }
            
            console.warn("Wiki returned no values, falling back to field allowed values");
        } catch (error) {
            console.error("Failed to fetch values from wiki, falling back to field allowed values:", error);
        }
    }
    
    // Fall back to field allowed values
    const service = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    const allowedValues = await service.getAllowedFieldValues(inputs.FieldName) as string[];
    return allowedValues.filter((value) => value.indexOf(";") === -1);
}
