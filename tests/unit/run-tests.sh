#!/bin/bash
# ============================================================================
# Unit Test Runner for Convergence System
# ============================================================================
# Runs all unit tests in tests/unit/convergence/

echo "==================================="
echo "Convergence System - Unit Tests"
echo "==================================="
echo ""

# Check if tsx is installed
if ! command -v npx tsx &> /dev/null; then
    echo "Installing tsx (TypeScript runner)..."
    npm install -D tsx
fi

# Run PresetMapper tests
echo "Running PresetMapper tests..."
npx tsx tests/unit/convergence/PresetMapper.test.ts
PRESET_EXIT=$?

echo ""

# Run BotValidator tests
echo "Running BotValidator tests..."
npx tsx tests/unit/convergence/BotValidator.test.ts
VALIDATOR_EXIT=$?

echo ""
echo "==================================="

# Check if all tests passed
if [ $PRESET_EXIT -eq 0 ] && [ $VALIDATOR_EXIT -eq 0 ]; then
    echo "✓ All unit tests passed!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
