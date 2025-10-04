const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';
console.log('isDevelopment', isDevelopment);

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: join(__dirname, 'dist'),
    ...(isDevelopment && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  // Enable webpack caching for faster rebuilds
  cache: isDevelopment
    ? {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    : false,
  // Optimize for development
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  // Faster source maps for development
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false,
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false, // Disable optimization for faster builds
      outputHashing: 'none',
      generatePackageJson: false, // Don't generate package.json to avoid workspace deps
      sourceMaps: isDevelopment,
      progress: isDevelopment,
      watch: isDevelopment,
      // Enable incremental compilation
      incremental: isDevelopment,
    }),
  ],
};
