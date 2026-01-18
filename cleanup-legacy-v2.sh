#!/bin/bash
# cleanup-legacy-v2.sh - Remove legacy code including current dashboards

echo "🧹 Starting comprehensive legacy cleanup..."

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# Remove Worcester legacy
echo "🗑️ Removing Worcester legacy..."
rm -f src/pages/WorcesterDashboard.tsx
rm -f src/pages/WorcesterDashboard.css
rm -f src/pages/WorcesterHelp.tsx
rm -f src/pages/WorcesterLanding.tsx
rm -f src/components/institutional/WorcesterDashboard.tsx

# Remove old admin dashboards
echo "🗑️ Removing old admin dashboards..."
rm -f src/pages/AdminAssets.tsx
rm -f src/pages/AdminDashboard.tsx
rm -f src/pages/BootstrapAdmin.tsx
rm -f src/pages/NoDatabaseBootstrapAdmin.tsx
rm -f src/pages/SimpleBootstrapAdmin.tsx
rm -f src/components/AdminNav.tsx
rm -f src/components/ProtectedAdminRoute.tsx

# Remove demo/test components
echo "🗑️ Removing demo/test components..."
rm -f src/pages/DemoPage.tsx
rm -f src/pages/MobileDemoPage.tsx
rm -f src/components/DemoConversation.tsx
rm -f src/components/WorkingDemoConversation.tsx
rm -f src/components/TestComponent.tsx
rm -f src/components/PollyTest.tsx
rm -f src/components/GPTCapabilityTest.tsx

# Remove CURRENT institutional dashboard (you'll replace with Figma design)
echo "🗑️ Removing current institutional dashboard..."
rm -f src/pages/InstitutionalDashboard.tsx
rm -f src/pages/InstitutionalDashboard.css
rm -f src/pages/InstitutionalDashboardOriginal.css
rm -f src/components/institutional/InstitutionalDashboardComponents.tsx
rm -f src/components/institutional/InstitutionalOnboarding.tsx
rm -f src/components/institutional/InstitutionalRouter.tsx

# Remove CURRENT superuser portal (you'll replace with Figma design)
echo "🗑️ Removing current superuser portal..."
rm -f src/pages/SuperUserPortal.tsx
rm -f src/components/institutional/SuperUserPortal.tsx

# Remove legacy CSS
echo "🗑️ Removing legacy CSS..."
rm -rf src/components/institutional/original/

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Cleanup completed successfully!"
    echo "📦 Backup available at: $BACKUP_DIR"
    echo "🚀 Core project is now clean and ready for your Figma designs"
    echo ""
    echo "📋 Next steps:"
    echo "1. Replace institutional dashboard with your Figma design"
    echo "2. Replace superuser portal with your Figma design"
    echo "3. Focus on mobile app functionality"
else
    echo "❌ Cleanup failed, restoring backup..."
    rm -rf src/
    mv "$BACKUP_DIR/src" ./
    rm -rf "$BACKUP_DIR"
    echo "🔄 Project restored to previous state"
    exit 1
fi
