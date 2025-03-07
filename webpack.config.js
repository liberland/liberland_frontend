/* eslint-disable */
const HtmlWebPackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");

const webpack = require('webpack');

const path = require('path');

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const postcssNormalize = require('postcss-normalize');

const getStyleLoaders = (cssOptions) => {
  const loaders = [
    'style-loader',
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssNormalize,
          ],
        },
      },
    },
    'sass-loader',
  ];
  return loaders;
};

module.exports = (env, argv) => {
  return {
    context: __dirname,
    entry: ['babel-polyfill', './src/index.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: true,
    },
    optimization: {
      moduleIds: 'deterministic',
      splitChunks: {
        maxSize: 51200,
        maxAsyncSize: 51200,
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          resolve: {
            fallback: { 'process/browser': require.resolve('process/browser'), }
          },
          use: {
            loader: 'babel-loader',
            options: {
              include: [path.resolve(__dirname, 'src')],
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                      },
                    },
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|j?g|svg|gif)?$/,
          use: 'file-loader',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
            },
            'sass-loader'
          ),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules, but using SASS
        // using the extension .module.scss or .module.sass
        {
          test: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              modules: true,
            },
            'sass-loader'
          ),
        },
      ],
    },
    devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : undefined,
    cache: argv.mode === 'development' ? {
      type: 'filesystem',
      compression: 'gzip',
      allowCollectingMemory: true,
    } : undefined,
    plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
      }),
      argv.mode === 'production' && (
        new CopyPlugin({
          patterns: [
            "./public/favicon.ico",
            "./public/logo192.png",
            "./public/logo512.png",
            "./public/manifest.json",
            "./public/robots.txt",
          ],
        })
      ),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new Dotenv(),
      // new InterpolateHtmlPlugin({PUBLIC_URL: 'static' }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      },
      alias: {
        buffer: 'buffer',
        stream: 'stream-browserify',
        '../fonts/PlayfairDisplay-Regular.ttf': path.resolve(__dirname, './src/assets/fonts/PlayfairDisplay-Regular.ttf'),
      },
    },
  };
};
