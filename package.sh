#!/bin/bash

npm run build
rm -rf UpGitbookWebServer UpGitbookWebServer.tgz
mkdir -p UpGitbookWebServer
echo 'cp files'
cp -rf client dist node_modules package.json package-lock.json UpGitbookWebServer
echo 'rm client/markdown'
rm -rf UpGitbookWebServer/client/markdown
echo 'rm client/node_modules'
rm -rf UpGitbookWebServer/client/node_modules
echo 'rm node_modules'
rm -rf UpGitbookWebServer/node_modules
echo 'npm install'
cd UpGitbookWebServer && npm install --prod && cd ..
echo 'tar'
tar czf UpGitbookWebServer.tgz UpGitbookWebServer
echo 'succ'
