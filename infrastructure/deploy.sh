#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "=========================================="
echo " Deploying Meeting2Tasks Backend (SAM)"
echo "=========================================="

echo "[1/3] Building backend (TypeScript)..."
cd ../backend
npm install
npm run build
cd ../infrastructure

echo "[2/3] Building SAM application..."
sam build --template-file template.yaml

echo "[3/3] Deploying SAM application..."
# We use --guided for the first run, but for subsequent runs we can just use sam deploy
# Check if samconfig.toml exists and has the necessary parameters to avoid prompting
if grep -q "GroqApiKey" samconfig.toml 2>/dev/null; then
    echo "Using existing samconfig.toml"
    sam deploy
else
    echo "Running guided deployment. You will be prompted for your GROQ_API_KEY."
    sam deploy --guided
fi

echo "=========================================="
echo " Deployment Complete!"
echo "=========================================="
