const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join, resolve } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },

  resolve: {
    // allow importing .ts/.js without extensions
    extensions: ['.ts', '.js'],
    // hook in your tsconfig paths
    plugins: [
      new TsconfigPathsPlugin({
        configFile: resolve(__dirname, 'tsconfig.app.json'),
      }),
    ],
  },

  module: {
    rules: [],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: join(__dirname, '.env'),
          to: join(__dirname, 'dist/.env'),
          toType: 'file',
        },
      ],
    }),
  ],
};
