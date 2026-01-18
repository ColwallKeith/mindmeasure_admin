import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mindmeasure.mobile',
  appName: 'Mind Measure',
  webDir: 'dist',
  // Mobile app uses local assets only - no web server URL
  // Admin interface is served separately on mindmeasure.co.uk
  plugins: {
    Keyboard: {
      resize: "none",
      style: "dark",
      resizeOnFullScreen: true
    },
    App: {
      appUrlOpen: true
    },
    Device: {
      permissions: {
        microphone: 'required',
        camera: 'optional'
      }
    }
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false
  }
};

export default config;
