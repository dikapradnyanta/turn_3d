const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',

    target: 'web',

    entry: {
      ui: './src/ui/ui.tsx',
      code: './src/plugin/controller.ts',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                target: 'ES5',
                module: 'CommonJS',
              }
            }
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname),
      clean: false,
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/ui/ui.html',
        filename: 'ui.html',
        chunks: ['ui'],
        inject: 'body',
        scriptLoading: 'blocking',
      }),
      // PENTING: Inline semua JS ke dalam HTML
      // Figma plugin UI tidak bisa load external script files!
      new HtmlInlineScriptPlugin(),
    ],
  };
};