#!/bin/bash

# SAFE COMPONENT PORTING SCRIPT
# Ports a single component from core to mobile project safely

set -e  # Exit on any error

COMPONENT=$1
if [ -z "$COMPONENT" ]; then
    echo "❌ Usage: ./port-component.sh ComponentName"
    echo "📋 Available components:"
    ls src/components/mobile/ | sed 's/.tsx$//' | sed 's/^/  - /'
    exit 1
fi

echo "🔄 Porting $COMPONENT from core to mobile..."

# Check if component exists
if [ ! -f "src/components/mobile/$COMPONENT.tsx" ]; then
    echo "❌ Component $COMPONENT.tsx not found in core project"
    exit 1
fi

# Navigate to mobile project
cd "../mind-measure-mobile"

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# Port component
echo "📤 Porting $COMPONENT.tsx..."
cp "../mind-measure-core/src/components/mobile/$COMPONENT.tsx" "src/components/"

# Port related hook if exists
HOOK_NAME="use${COMPONENT}"
if [ -f "../mind-measure-core/src/hooks/$HOOK_NAME.ts" ]; then
    echo "📤 Porting $HOOK_NAME.ts..."
    cp "../mind-measure-core/src/hooks/$HOOK_NAME.ts" "src/hooks/"
fi

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ $COMPONENT ported successfully!"
    echo "📦 Backup available at: $BACKUP_DIR"
    echo "🚀 Mobile app ready for testing"
else
    echo "❌ Port failed, restoring backup..."
    rm -rf src/
    mv "$BACKUP_DIR/src" ./
    rm -rf "$BACKUP_DIR"
    echo "🔄 Mobile project restored to previous state"
    exit 1
fi
