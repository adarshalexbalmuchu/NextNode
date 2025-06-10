#!/bin/bash
cd /workspaces/quantum-read-flow
echo "Starting development server..."
bun run dev --host 0.0.0.0 --port 8080
