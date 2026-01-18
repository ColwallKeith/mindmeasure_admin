# Mind Measure Institutional Dashboard - Development Export Guide

## Overview

This is a React-based institutional dashboard for Mind Measure, a student mental health monitoring platform. The dashboard transforms real-time check-in data into actionable insights for universities.

## Required Files for Export

### 1. Core Application Files

```
/App.tsx                           # Main application entry point
/styles/globals.css                # Tailwind V4 configuration and custom CSS
```

### 2. React Components (Export all from /components/)

```
/components/Layout.tsx             # Main layout with sidebar and header
/components/CohortFilters.tsx      # Student cohort filtering system
/components/AISummary.tsx          # AI-generated insights summary
/components/TrendCharts.tsx        # Mind Measure score trends and distribution
/components/EngagementMetrics.tsx  # Student engagement statistics
/components/TopTopics.tsx          # Stressor analysis and positive themes
/components/BaselineAssessment.tsx # Wellbeing assessment tracking
/components/MindMeasureLogo.tsx    # Brand logo component
```

### 3. UI Components (Export all from /components/ui/)

Complete shadcn/ui component library including:

- All .tsx files in /components/ui/
- /components/ui/utils.ts
- /components/ui/use-mobile.ts

### 4. Assets and Images

```
/components/figma/ImageWithFallback.tsx  # Image component with fallback
figma:asset/66710e04a85d98ebe33850197f8ef41bd28d8b84.png  # Mind Measure logo
/imports/svg-02msz91dyv.ts              # SVG path definitions
```

## Required Dependencies

### Core Framework

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### UI and Styling

```json
{
  "@tailwindcss/forms": "latest",
  "tailwindcss": "^4.0.0",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

### Chart and Data Visualization

```json
{
  "recharts": "latest"
}
```

### Icons and Components

```json
{
  "lucide-react": "latest",
  "@radix-ui/react-accordion": "latest",
  "@radix-ui/react-alert-dialog": "latest",
  "@radix-ui/react-avatar": "latest",
  "@radix-ui/react-checkbox": "latest",
  "@radix-ui/react-collapsible": "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-hover-card": "latest",
  "@radix-ui/react-label": "latest",
  "@radix-ui/react-menubar": "latest",
  "@radix-ui/react-navigation-menu": "latest",
  "@radix-ui/react-popover": "latest",
  "@radix-ui/react-progress": "latest",
  "@radix-ui/react-radio-group": "latest",
  "@radix-ui/react-scroll-area": "latest",
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-separator": "latest",
  "@radix-ui/react-sheet": "latest",
  "@radix-ui/react-slider": "latest",
  "@radix-ui/react-switch": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-toast": "latest",
  "@radix-ui/react-toggle": "latest",
  "@radix-ui/react-toggle-group": "latest",
  "@radix-ui/react-tooltip": "latest"
}
```

### Additional UI Libraries

```json
{
  "sonner": "^2.0.3",
  "cmdk": "latest",
  "react-day-picker": "latest",
  "react-resizable-panels": "latest",
  "vaul": "latest"
}
```

## Build Configuration

### 1. Tailwind Configuration

The project uses **Tailwind V4** with CSS variables. No separate tailwind.config.js needed - all configuration is in `/styles/globals.css`.

### 2. TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## Design System Specifications

### Brand Colors

- **Green**: #0BA66D (healthy wellbeing scores ≥60)
- **Amber**: #F4A742 (moderate wellbeing scores 45-59)
- **Red**: #EB5757 (concerning wellbeing scores <45)
- **Slate**: #1F2937 (primary text and UI elements)
- **Muted Grey**: #F3F4F6 (backgrounds and subtle elements)

### Typography

- Base font size: 14px
- Font family: Inter, system fonts
- 8pt spacing grid system

### Key Features

1. **Real-time Mind Measure Score Tracking** - Line chart with color-coded bands
2. **Cohort Filtering** - Filter by faculty, year, domicile, residence
3. **AI-Generated Insights** - Automated summary of key trends
4. **Engagement Metrics** - Student participation and usage stats
5. **Baseline Assessment Journey** - Wellbeing assessment progression
6. **Topic Analysis** - Student stressors and positive themes
7. **Responsive Design** - Works on desktop and tablet

## Data Requirements

### Sample Data Structure

The dashboard expects data in the following formats:

#### Mind Measure Scores

```typescript
interface MindMeasureData {
  date: string;
  averageScore: number;
  greenCount: number; // scores ≥60
  amberCount: number; // scores 45-59
  redCount: number; // scores <45
}
```

#### Engagement Data

```typescript
interface EngagementData {
  totalStudents: number;
  activeUsers: number;
  weeklyCheckIns: number;
  completionRate: number;
}
```

## Deployment Notes

1. **Environment**: React 18+ with Vite or Create React App
2. **Node Version**: 16+ recommended
3. **Build Command**: `npm run build` or `yarn build`
4. **Preview**: `npm run preview` or `yarn preview`

## Security & Privacy Considerations

- No PII collection or storage in frontend
- All student data should be anonymized/aggregated
- Implement proper authentication before deployment
- Consider GDPR/FERPA compliance for student data

## Next Steps for Development

1. **Backend Integration**: Connect to real Mind Measure API
2. **Authentication**: Implement university SSO
3. **Data Pipeline**: Set up real-time data ingestion
4. **Testing**: Add unit and integration tests
5. **Accessibility**: Ensure WCAG compliance
6. **Performance**: Optimize for large datasets

## Support

For technical questions about the implementation:

- Review component documentation in each .tsx file
- Check Tailwind V4 documentation for styling
- Reference shadcn/ui docs for component usage