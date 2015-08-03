#!/usr/bin/env bash

if [ -z $1 ]
then
  echo "Give path for core directory."
  exit 1
fi

currentDir=`pwd`
cd $1
absolutePathCore=`pwd`
cd $currentDir

npm install
echo '{ "coreRepoPath": "'$absolutePathCore'" }' > core-repos-config.json
grunt init
grunt jenkins