#!/bin/bash

# This script prepares the repository for deployment to Vercel

# Ensure we're on the right branch
git checkout main

# Create or update the .eslintignore file
cat > .eslintignore << EOL
# Next.js build folder
.next/
# Output directory
out/
# Dependencies
node_modules/
# Contentlayer
.contentlayer/
EOL

# Commit changes
git add .
git commit -m "Prepare for deployment: Fix ESLint and TypeScript errors"

# Push to Vercel
git push origin main

echo "Changes pushed to main branch. Check Vercel dashboard for deployment status."
