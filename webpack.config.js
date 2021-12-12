const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (passedInConfig = {}, { mode = "production" }) => {
  const isProduction = mode === "production";

  const copiedEntries = [
    {
      from: "assets",
      to: "assets",
    },
  ];

  let plugins = [
    // new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: copiedEntries,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /inspector|perf_hooks/,
    }),
    // new webpack.EnvironmentPlugin(buildEnvironmentVars),
    // new webpack.DefinePlugin({
    //   "process.env": envConfig,
    // }),
    new MiniCssExtractPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      title: "",
      minify: false, // to prevent script type from being stripped out
      scriptLoading: "module",
      favicon: "public/favicon.ico",
      hash: true,
    }),
  ];

  const sassLoader = {
    loader: "sass-loader",
    options: {
      sourceMap: true, // need for production build
    },
  };

  const moduleRules = [
    { test: /\.m?js/, resolve: { fullySpecified: false } },
    {
      test: /\.(j|t)sx?$/,
      exclude: /node_modules|plugins/,
      use: {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: isProduction,
          babelrc: false,
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                targets: { browsers: ["last 1 Chrome version"] },
                corejs: 3.19,
                bugfixes: true,
                shippedProposals: true,
              },
            ],
            ["@babel/preset-typescript", { allowDeclareFields: true }],
            [
              "@babel/preset-react",
              // { runtime: 'automatic', importSource: '@emotion/react' }
            ],
          ],
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            "babel-plugin-parameter-decorator",
          ],
          // ignore: ['./plugins/pageManager/**']
        },
      },
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    },
    {
      test: /\.scss$/i,
      exclude: /\.lazy\.scss$/i,
      use: [MiniCssExtractPlugin.loader, "css-loader", "resolve-url-loader", sassLoader],
    },
    {
      test: /\.lazy\.scss$/i,
      use: [
        {
          loader: "style-loader",
          options: {
            attributes: { "data-type": "theme" },
            injectType: "lazySingletonStyleTag",
            insert: function insertAtTop(element) {
              var parent = document.querySelector("head");
              var lastInsertedElement = window["_lastElementInsertedByStyleLoader"];
              if (!lastInsertedElement) {
                parent.insertBefore(element, parent.firstChild);
              } else if (lastInsertedElement.nextSibling) {
                parent.insertBefore(element, lastInsertedElement.nextSibling);
              } else {
                parent.appendChild(element);
              }
              window["_lastElementInsertedByStyleLoader"] = element;
            },
          },
        },
        "css-loader",
        {
          loader: "resolve-url-loader",
          options: {
            removeCR: true,
          },
        },
        sassLoader,
      ],
    },
    {
      test: /\.(gif|png|jpe?g|svg|eot|woff|woff2|ttf)$/,
      use: [
        "file-loader",
        {
          loader: "image-webpack-loader",
          options: {
            disable: !isProduction,
          },
        },
      ],
    },
    // {
    //     enforce: 'pre',
    //     test: /\.js$/,
    //     exclude: /(node_modules|lib|screens)/,
    //     loader: 'source-map-loader'
    // },
    // {
    //     test: /\.d.ts$/,
    //     use: 'raw-loader'
    // }
  ];

  const webpackConfig = {
    entry: "./src/index.tsx",
    module: {
      rules: moduleRules,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "bundle.js",
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
    },
    plugins,
  };

  if (mode === "development") {
    Object.assign(webpackConfig, {
      devtool: "eval-source-map",
      ignoreWarnings: [/Failed to parse source map/],
    });
  }

  if (passedInConfig.WEBPACK_SERVE) {
    Object.assign(webpackConfig, {
      devServer: {
        static: path.resolve(__dirname, "dist"),
        compress: false,
        historyApiFallback: true,
        hot: true,
        allowedHosts: "all",
        watchFiles: ["src/**/*"],
        client: {
          overlay: { warnings: false },
        },
      },
    });
  }

  return webpackConfig;
};
