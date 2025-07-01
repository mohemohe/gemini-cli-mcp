# gemini-cli-mcp

A Model Context Protocol (MCP) server that provides integration with the Gemini AI CLI tool.

## Features

This MCP server exposes two tools:

- **`google_search`** - Search Google using Gemini and get summaries with title, description and source URL
- **`consult_with_gemini`** - Consult with Gemini AI for general questions, analysis, or assistance

## Prerequisites

- Node.js (v16 or higher recommended)
- [gemini CLI](https://github.com/reorx/gemini-cli) installed and accessible in your PATH

## Installation

```bash
# Clone the repository
git clone https://github.com/mohemohe/gemini-cli-mcp.git
cd gemini-cli-mcp

# Install dependencies
npm install
```

## Configuration

### Gemini CLI Path

By default, the server looks for the `gemini` command in your PATH. If your gemini CLI is installed elsewhere, you can specify its path using the `GEMINI_CLI_PATH` environment variable:

```bash
export GEMINI_CLI_PATH=/Users/mohemohe/.n/bin/gemini
```

## Usage

### Running the Server Standalone

```bash
npm start
```

### Adding to Claude Desktop

To use this MCP server with Claude Desktop, add it to your Claude configuration:

```bash
claude mcp add google-search -s user -- npx tsx /path/to/gemini-cli-mcp/src/index.ts
```

Or with a custom gemini path:

```bash
GEMINI_CLI_PATH=/custom/path/to/gemini claude mcp add google-search -s user -- npx tsx /path/to/gemini-cli-mcp/src/index.ts
```

## Available Tools

### google_search

Performs a web search using Gemini and returns formatted results.

**Parameters:**
- `query` (string, required) - The search query to send to Google

**Example:**
```json
{
  "name": "google_search",
  "arguments": {
    "query": "latest Node.js features"
  }
}
```

### consult_with_gemini

Consults with Gemini AI for general questions or assistance.

**Parameters:**
- `prompt` (string, required) - The question or prompt to send to Gemini

**Example:**
```json
{
  "name": "consult_with_gemini",
  "arguments": {
    "prompt": "Explain the concept of quantum computing in simple terms"
  }
}
```

## Development

This project uses TypeScript and the MCP SDK. The main server implementation is in `src/index.ts`.

### Project Structure

```
gemini-cli-mcp/
├── src/
│   └── index.ts      # Main server implementation
├── package.json      # Project configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

### Building

Currently, the project runs directly using `tsx`. To add a build step:

```bash
# Add to package.json scripts:
"build": "tsc"

# Then run:
npm run build
```

## License

ISC

## Author

mohemohe