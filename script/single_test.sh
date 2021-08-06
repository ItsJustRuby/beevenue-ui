#!/bin/bash
set -ev -o pipefail

npm test -- test --runInBand --watchAll=false --testNamePattern "$@"