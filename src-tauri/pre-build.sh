#!/bin/bash

# Set environment variables
export GIT_HASH=$(git rev-parse HEAD)

# Print the values to verify
echo "Environment variables set:"
echo "GIT_HASH: $GIT_HASH"

