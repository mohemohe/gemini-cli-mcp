# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that provides integration with the Gemini AI CLI tool. The server exposes two tools:
- `google_search`: Performs web searches using Gemini and returns formatted results
- `consult_with_gemini`: Allows general consultation with Gemini AI

## Key Architecture

The entire server is implemented in a single file `/src/index.ts` that:
1. Uses the MCP SDK to create a stdio-based server
2. Shells out to the `gemini` CLI command to execute AI requests
3. Supports environment variable `GEMINI_CLI_PATH` for custom gemini executable paths

## Development Commands

```bash
# Install dependencies
npm install

# Run the server
npm start
# or
tsx src/index.ts

# No build, test, or lint commands are currently defined
```

## Important Implementation Details

- The server depends on an external `gemini` CLI tool being installed
- Default command is `gemini` (not `gemini-cli`)
- All prompts to Gemini for web search are in Japanese
- Uses stdio transport for MCP communication (stdout is reserved for protocol)
- Error messages and debugging go to stderr

## Integration with Claude Code

To add this MCP server to Claude Code:
```bash
claude mcp add google-search -s user -- npx tsx /path/to/this/repo/src/index.ts
```

Ensure `GEMINI_CLI_PATH` is set if gemini is not in PATH:
```bash
export GEMINI_CLI_PATH=/Users/username/.n/bin/gemini
```