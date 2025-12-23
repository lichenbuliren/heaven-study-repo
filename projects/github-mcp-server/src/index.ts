#!/usr/bin/env node

import { GitHubMCPServer } from "./server";

async function main() {
  const server = new GitHubMCPServer();
  await server.run();
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error:", error);
  process.exit(1);
});
