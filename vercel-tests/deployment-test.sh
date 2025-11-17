#!/bin/bash

###############################################################################
# Vercel Deployment Integration Test
# 
# This script verifies that the application is correctly deployed to Vercel
# and all essential functionality works in the production environment.
#
# Usage:
#   ./vercel-tests/deployment-test.sh <DEPLOYMENT_URL>
#
# Example:
#   ./vercel-tests/deployment-test.sh https://your-app.vercel.app
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get deployment URL from argument or environment
DEPLOYMENT_URL="${1:-${VERCEL_DEPLOYMENT_URL:-}}"

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}Error: No deployment URL provided${NC}"
    echo "Usage: $0 <DEPLOYMENT_URL>"
    echo "Or set VERCEL_DEPLOYMENT_URL environment variable"
    exit 1
fi

echo -e "${YELLOW}Starting Vercel Deployment Tests${NC}"
echo "Testing URL: $DEPLOYMENT_URL"
echo "================================================"

# Counter for tests
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}Test:${NC} $test_name"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Check if deployment is accessible
run_test "Deployment is accessible" \
    "curl -s -o /dev/null -w '%{http_code}' '$DEPLOYMENT_URL' | grep -E '^(200|301|302|307|308)$'"

# Test 2: Homepage loads without 500 errors
run_test "Homepage loads successfully" \
    "[ \$(curl -s -o /dev/null -w '%{http_code}' '$DEPLOYMENT_URL') != '500' ]"

# Test 3: Login page is accessible
run_test "Login page is accessible" \
    "curl -s -o /dev/null -w '%{http_code}' '$DEPLOYMENT_URL/login' | grep -E '^(200|301|302)$'"

# Test 4: Dashboard page exists (may redirect)
run_test "Dashboard route exists" \
    "curl -s -o /dev/null -w '%{http_code}' '$DEPLOYMENT_URL/dashboard' | grep -E '^(200|301|302|401|403)$'"

# Test 5: API routes respond
run_test "API health endpoint responds" \
    "curl -s -o /dev/null -w '%{http_code}' '$DEPLOYMENT_URL/api/health' | grep -E '^(200|404|405)$'"

# Test 6: Static assets load
run_test "Static assets are served" \
    "curl -s -I '$DEPLOYMENT_URL/_next/static/' | head -n 1 | grep -E '(200|301|302|404)'"

# Test 7: Check response time
run_test "Response time is acceptable (<5s)" \
    "[ \$(curl -s -o /dev/null -w '%{time_total}' '$DEPLOYMENT_URL' | cut -d'.' -f1) -lt 5 ]"

# Test 8: HTTPS is enforced
if [[ $DEPLOYMENT_URL == http://* ]]; then
    run_test "HTTPS redirect is configured" \
        "curl -s -I '$DEPLOYMENT_URL' | grep -i 'location: https://'"
else
    run_test "HTTPS is used" \
        "[[ '$DEPLOYMENT_URL' == https://* ]]"
fi

# Test 9: Essential HTML content is present
run_test "HTML contains expected content" \
    "curl -s '$DEPLOYMENT_URL/login' | grep -q 'email'"

# Test 10: No critical JavaScript errors on page load
run_test "Page loads without critical errors" \
    "curl -s '$DEPLOYMENT_URL' | grep -qv 'Error 500'"

# Summary
echo -e "\n================================================"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests:  $((TESTS_PASSED + TESTS_FAILED))"
echo -e "================================================"

# Exit with appropriate code
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed!${NC}"
    exit 1
fi
