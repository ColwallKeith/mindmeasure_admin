
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    define: {
      global: 'globalThis',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/d0f6eaab8491562aeb8c3df2cfcd2c6a20b00e1e.png': path.resolve(__dirname, './src/assets/d0f6eaab8491562aeb8c3df2cfcd2c6a20b00e1e.png'),
        'figma:asset/bb827a19515889bb062d58859b831662378c36cb.png': path.resolve(__dirname, './src/assets/bb827a19515889bb062d58859b831662378c36cb.png'),
        'figma:asset/a5ec0d9266e5c8d1d4ca0c6daf9753d43ff512ff.png': path.resolve(__dirname, './src/assets/a5ec0d9266e5c8d1d4ca0c6daf9753d43ff512ff.png'),
        'figma:asset/66710e04a85d98ebe33850197f8ef41bd28d8b84.png': path.resolve(__dirname, './src/assets/66710e04a85d98ebe33850197f8ef41bd28d8b84.png'),
        'figma:asset/57232a2e8f77967ba1ae01ab3f5468b0c102a4b8.png': path.resolve(__dirname, './src/assets/57232a2e8f77967ba1ae01ab3f5468b0c102a4b8.png'),
        'figma:asset/09faec71f9d3802be7219825a1035943a576793f.png': path.resolve(__dirname, './src/assets/09faec71f9d3802be7219825a1035943a576793f.png'),
        'figma:asset/068152bfc12d21732b8aeafbd4eab27fa36c38dd.png': path.resolve(__dirname, './src/assets/068152bfc12d21732b8aeafbd4eab27fa36c38dd.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/components/ui': path.resolve(__dirname, './src/components/ui'),
        '@/components/features': path.resolve(__dirname, './src/components/features'),
        '@/components/mobile': path.resolve(__dirname, './src/components/mobile'),
        '@/components/admin': path.resolve(__dirname, './src/components/admin'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/services/core': path.resolve(__dirname, './src/services/core'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/contexts': path.resolve(__dirname, './src/contexts'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/utils': path.resolve(__dirname, './src/utils'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      rollupOptions: {
        external: ['pg'],
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom'],
            'aws-sdk': ['@aws-sdk/client-cognito-identity-provider', '@aws-sdk/client-rds', '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
            'radix-ui': [
              '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label', '@radix-ui/react-navigation-menu', '@radix-ui/react-popover',
              '@radix-ui/react-progress', '@radix-ui/react-scroll-area', '@radix-ui/react-select',
              '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-switch',
              '@radix-ui/react-tabs', '@radix-ui/react-tooltip'
            ],
            'charts': ['recharts'],
            'icons': ['lucide-react'],
            'forms': ['react-hook-form', 'react-day-picker'],
            'utils': ['class-variance-authority', 'clsx', 'tailwind-merge']
          }
        }
      },
      chunkSizeWarningLimit: 1000, // Increase warning limit temporarily
      sourcemap: false, // Disable sourcemaps for smaller build
    },
    optimizeDeps: {
      exclude: ['pg'],
    },
    server: {
      port: 3000,
      open: true,
    },
  });