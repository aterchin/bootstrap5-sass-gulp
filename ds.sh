#!/bin/bash
# usage: sh ds.sh path/to/directory

if [ -z "$1" ]
  then
    echo "Enter path/to/directory"
    exit 1
fi

find $1/. -type f -name ".DS_Store" -exec rm -f {} \;
