[forked from vsts-extension-multivalue-control](https://github.com/microsoft/vsts-extension-multivalue-control)

# Multi-value-control

The Azure DevOps Multi-Value Control extension allows work item fields to accept multiple selections instead of a single value. This is useful when a work item needs to be associated with more than one category or tag.

The selectable values are sourced directly from an Azure DevOps Wiki page.

# Documentation

For detailed instructions on using the Wiki Multi-value-control Azure DevOps extension, please refer to the official documentation. You can access the comprehensive guide by clicking [Marketplace](https://marketplace.visualstudio.com/items?itemName=DougBloch.vsts-extensions-wiki-multivalue-control). This resource provides step-by-step information to help you effectively utilize the Multi-value-control features within your Azure DevOps environment.

# Support

## How to file issues and get help

This project uses [GitHub Issues](https://github.com/dbloch3643/vsts-extension-wiki-multivalue-control/issues) to track bugs and feature requests. Please search the existing issues before filing new issues to avoid duplicates. For new issues, file your bug or feature request as a new Issue.

# Contributing

I welcome contributions to improve the extension. If you would like to contribute, please fork the repository and create a pull request with your changes. Your
contributions help enhance the functionality and usability of the extension for the entire community.

### Developing and Testing

```bash
# Install node dependencies
npm install

# Compile the source code
npm run dev

# Build the extension
npm run build:release

# Run the Playwright UI tests (builds first; one-time: npx playwright install chromium)
npm run test:ui
```

