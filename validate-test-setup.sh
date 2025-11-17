#!/bin/bash

###############################################################################
# Test Suite Setup Validation
# 
# This script validates that the test suite is properly installed and configured.
# Run this after setting up the project to ensure all test dependencies are ready.
#
# Usage: ./validate-test-setup.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Test Suite Setup Validation${NC}"
echo -e "${BLUE}================================${NC}\n"

CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Function to run a check
check() {
    local check_name="$1"
    local check_command="$2"
    local is_optional="${3:-false}"
    
    echo -ne "${YELLOW}Checking:${NC} $check_name ... "
    
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((CHECKS_PASSED++))
        return 0
    else
        if [ "$is_optional" = "true" ]; then
            echo -e "${YELLOW}⚠ (optional)${NC}"
            ((CHECKS_WARNING++))
        else
            echo -e "${RED}✗${NC}"
            ((CHECKS_FAILED++))
        fi
        return 1
    fi
}

echo -e "${BLUE}Node.js Environment${NC}"
check "Node.js installed" "node --version"
check "npm installed" "npm --version"
check "Node.js version >= 18" "[[ \$(node -v | cut -d'v' -f2 | cut -d'.' -f1) -ge 18 ]]"

echo -e "\n${BLUE}Project Dependencies${NC}"
check "node_modules exists" "[ -d node_modules ]"
check "Playwright installed" "npm list @playwright/test --depth=0"
check "Jest installed" "npm list jest --depth=0"

echo -e "\n${BLUE}Playwright Setup${NC}"
check "Playwright config exists" "[ -f playwright.config.ts ]"
check "E2E tests exist" "[ -d e2e ]"
check "Playwright browsers installed" "npx playwright --version && [ -d ~/.cache/ms-playwright/chromium-* ] || [ -d ~/Library/Caches/ms-playwright/chromium-* ]" true

echo -e "\n${BLUE}Load Testing Setup${NC}"
check "Load test scripts exist" "[ -d load-tests ]"
check "k6 installed" "k6 version" true

echo -e "\n${BLUE}Vercel Integration Setup${NC}"
check "Vercel test scripts exist" "[ -d vercel-tests ]"
check "deployment-test.sh executable" "[ -x vercel-tests/deployment-test.sh ]"
check "env-check.sh executable" "[ -x vercel-tests/env-check.sh ]"

echo -e "\n${BLUE}Documentation${NC}"
check "TESTING.md exists" "[ -f TESTING.md ]"
check "K6_SETUP.md exists" "[ -f K6_SETUP.md ]"
check "IMPLEMENTATION_SUMMARY.md exists" "[ -f IMPLEMENTATION_SUMMARY.md ]"

echo -e "\n${BLUE}NPM Scripts${NC}"
check "test:e2e script exists" "npm run test:e2e --help 2>&1 | grep -q playwright"
check "test:load script exists" "grep -q 'test:load' package.json"
check "test:vercel script exists" "grep -q 'test:vercel' package.json"

echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}Validation Summary${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Checks Passed:  ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks Failed:  ${RED}$CHECKS_FAILED${NC}"
echo -e "Warnings:       ${YELLOW}$CHECKS_WARNING${NC}"
echo -e "================================\n"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All required checks passed!${NC}\n"
    
    if [ $CHECKS_WARNING -gt 0 ]; then
        echo -e "${YELLOW}Note: Some optional checks failed:${NC}"
        echo -e "  - Playwright browsers: Run ${BLUE}npx playwright install${NC}"
        echo -e "  - k6: See K6_SETUP.md for installation instructions\n"
    fi
    
    echo -e "${GREEN}You can now run tests:${NC}"
    echo -e "  ${BLUE}npm test${NC}          - Unit tests"
    echo -e "  ${BLUE}npm run test:e2e${NC}  - E2E tests"
    echo -e "  ${BLUE}npm run test:load${NC} - Load tests (requires k6)"
    echo -e ""
    exit 0
else
    echo -e "${RED}✗ Some required checks failed!${NC}\n"
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. Run ${BLUE}npm install${NC} to install dependencies"
    echo -e "  2. Run ${BLUE}npx playwright install${NC} to install browsers"
    echo -e "  3. Ensure you're in the project root directory"
    echo -e "  4. Check TESTING.md for setup instructions\n"
    exit 1
fi
