import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flowstate.app',
  appName: 'FlowState',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    ioScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      showSpinner: false
    }
  }
};

export default config;
