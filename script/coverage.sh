#!/bin/bash
set -ev -o pipefail

npm test -- --coverage --watchAll=false
