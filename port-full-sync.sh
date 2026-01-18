#!/bin/bash

# SAFE FULL SYNC SCRIPT
# Ports all mobile components from core to mobile project safely

set -e  # Exit on any error

echo "🔄 Starting full sync from core to mobile..."

# Navigate to mobile project
cd "../mind-measure-mobile"

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# Port all mobile components
echo "📤 Porting mobile components..."
cp -r "../mind-measure-core/src/components/mobile/"* "src/components/"

# Port all hooks
echo "📤 Porting hooks..."
cp -r "../mind-measure-core/src/hooks/"* "src/hooks/"

# Port mobile pages
echo "📤 Porting mobile pages..."
cp "../mind-measure-core/src/pages/Mobile"* "src/pages/" 2>/dev/null || true

# Port mobile services
echo "📤 Porting services..."
mkdir -p "src/services"
cp -r "../mind-measure-core/src/services/"* "src/services/"

# Port mobile integrations
echo "📤 Porting integrations..."
mkdir -p "src/integrations"
cp -r "../mind-measure-core/src/integrations/"* "src/integrations/"

# Port mobile types
echo "📤 Porting types..."
mkdir -p "src/types"
cp -r "../mind-measure-core/src/types/"* "src/types/"

# Port mobile data
echo "📤 Porting data..."
mkdir -p "src/data"
cp -r "../mind-measure-core/src/data/"* "src/data/"

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Full sync completed successfully!"
    echo "📦 Backup available at: $BACKUP_DIR"
    echo "🚀 Mobile app ready for testing"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test mobile app functionality"
    echo "2. Verify database connections"
    echo "3. Test assessment flow"
    echo "4. Check voice functionality"
else
    echo "❌ Sync failed, restoring backup..."
    rm -rf src/
    mv "$BACKUP_DIR/src" ./
    rm -rf "$BACKUP_DIR"
    echo "🔄 Mobile project restored to previous state"
    exit 1
fi
