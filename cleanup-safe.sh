#!/bin/bash
# cleanup-safe.sh - Safe cleanup that fixes imports first

echo "🧹 Starting safe legacy cleanup..."

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# First, let's test the current build
echo "🔨 Testing current build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Current build is broken, aborting cleanup"
    exit 1
fi

echo "✅ Current build works, proceeding with cleanup..."

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

# Now we need to fix App.tsx imports
echo "🔧 Fixing App.tsx imports..."

# Create a temporary App.tsx with only mobile-focused imports
cat > src/App.tsx << 'EOF'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SessionProvider } from "@/components/SessionManager";
import { Capacitor } from '@capacitor/core';
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AssessmentBaseline from "./pages/AssessmentBaseline";
import AssessmentCheckin from "./pages/AssessmentCheckin";
import BaselineSummary from "./pages/BaselineSummary";
import BaselineComplete from "./pages/BaselineComplete";
import BaselineIncomplete from "./pages/BaselineIncomplete";
import CheckinIncomplete from "./pages/CheckinIncomplete";
import NotFound from "./pages/NotFound";
import BuddySettings from "./pages/BuddySettings";
import { BottomNavigation } from "@/components/BottomNav";
import AssessmentReport from "./pages/AssessmentReport";
import Help from "./pages/Help";
import DashboardNew from "./pages/DashboardNew";
import ProactiveNotification from "./components/ProactiveNotification";

const queryClient = new QueryClient();

function App() {
  const isNative = Capacitor.isNativePlatform();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionProvider>
          <TooltipProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardNew />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/assessment/baseline" element={
                    <ProtectedRoute>
                      <AssessmentBaseline />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/assessment/checkin" element={
                    <ProtectedRoute>
                      <AssessmentCheckin />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/assessment/summary" element={
                    <ProtectedRoute>
                      <BaselineSummary />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/assessment/complete" element={
                    <ProtectedRoute>
                      <BaselineComplete />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/assessment/incomplete" element={
                    <ProtectedRoute>
                      <BaselineIncomplete />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/checkin/incomplete" element={
                    <ProtectedRoute>
                      <CheckinIncomplete />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/assessment/report" element={
                    <ProtectedRoute>
                      <AssessmentReport />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/buddies" element={
                    <ProtectedRoute>
                      <BuddySettings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Bottom Navigation for Mobile */}
                {isNative && <BottomNavigation />}
                
                {/* Notifications */}
                <ProactiveNotification />
              </div>
              
              {/* Toasters */}
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </SessionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
EOF

# Test build
echo "🔨 Testing build after cleanup..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Cleanup completed successfully!"
    echo "📦 Backup available at: $BACKUP_DIR"
    echo "🚀 Core project is now clean and focused on mobile"
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
