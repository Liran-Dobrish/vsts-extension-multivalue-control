# Wiki Page Format for Multivalue Control

This document describes how to format your wiki page to provide values for the Multivalue Control extension.

## Configuration

In your work item form control configuration, set:
- **Wiki Project Name**: The name of the project containing the wiki (e.g., "ReferenceData")
- **Wiki Name**: (Optional) Leave empty for project wiki, or specify wiki identifier
- **Wiki Page Path**: Path to the wiki page (e.g., "/Names" or "/ReferenceData/Names")
- **Show Select All option**: (Optional) Check to show a "Select All" option in the dropdown (enabled by default)

## Supported Wiki Page Formats

### Plain Text (One per line)

```
John Smith
Jane Doe
Bob Johnson
Alice Williams
Charlie Brown
```
## Example Setup

1. Create a project named "ReferenceData" (or use existing)
2. Go to Wiki section in that project
3. Create a new page at path "/Names"
4. Add your list using any of the formats above
5. In your work item extension configuration:
   - Set **Wiki Project Name** to "ReferenceData"
   - Leave **Wiki Name** empty (to use project wiki)
   - Set **Wiki Page Path** to "/Names"

## Editing the List

Contributors can edit the wiki page to add/remove names:
1. Navigate to the wiki page
2. Click "Edit" button
3. Modify the list
4. Click "Save"
5. The extension will use the updated list immediately

## Troubleshooting

If the extension doesn't fetch values from the wiki:
- Check that the project name is correct
- Verify the wiki page path is correct (include leading slash)
- Ensure the wiki page exists and has content
- Check browser console for error messages
- The extension will fall back to field allowed values if wiki fetch fails
