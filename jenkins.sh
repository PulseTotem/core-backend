#!/usr/bin/env bash

if [ -z $1 ]
then
  echo "Give path for core directory."
  exit 1
fi

npm install
echo '{ "coreRepoPath" : "'$1'" }' > core-repos-config.json
grunt init
grunt jenkins