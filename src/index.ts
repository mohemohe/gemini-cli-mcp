#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const server = new Server(
  {
    name: "gemini-cli-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "google_search",
        description: "Search Google using gemini and get summaries with title, description and source URL",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query to send to Google",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "consult_with_gemini",
        description: "Consult with Gemini AI for general questions, analysis, or assistance. An excellent tool for getting a second opinion when you need additional perspectives or information",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The question or prompt to send to Gemini",
            },
          },
          required: ["prompt"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Use GEMINI_CLI_PATH environment variable if set, otherwise default to 'gemini'
  const geminiCommand = process.env.GEMINI_CLI_PATH || 'gemini';
  
  if (request.params.name === "google_search") {
    const query = request.params.arguments?.query as string;
    
    if (!query) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Query parameter is required"
      );
    }

    const prompt = `Please search the web with the following requirements. Output the title, summary, and source URL for each result. Search query: ${query}`;
    
    try {
      const { stdout, stderr } = await execAsync(`${geminiCommand} -p "${prompt.replace(/"/g, '\\"')}"`);
      
      if (stderr) {
        console.error("gemini stderr:", stderr);
      }
      
      return {
        content: [
          {
            type: "text",
            text: stdout.trim(),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to execute gemini command: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  
  if (request.params.name === "consult_with_gemini") {
    const prompt = request.params.arguments?.prompt as string;
    
    if (!prompt) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Prompt parameter is required"
      );
    }
    
    try {
      const { stdout, stderr } = await execAsync(`${geminiCommand} -p "${prompt.replace(/"/g, '\\"')}"`);
      
      if (stderr) {
        console.error("gemini stderr:", stderr);
      }
      
      return {
        content: [
          {
            type: "text",
            text: stdout.trim(),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to execute gemini command: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  
  throw new McpError(
    ErrorCode.MethodNotFound,
    `Unknown tool: ${request.params.name}`
  );
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Gemini CLI MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});