import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import cssnano from 'cssnano';

delete process.env.TS_NODE_PROJECT; // fixing tsconfig-paths-webpack-plugin bug

const IS_DEV = (process.env.NODE_ENV === 'dev');

const port  = 8080;

const plugins = [
  new webpack.DefinePlugin({
    __DEV__: IS_DEV
  }),
  new HtmlWebpackPlugin({
    template: 'views/index.ejs',
    filename: 'index.html',
    dev: IS_DEV
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  })
];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());
/*
if (IS_DEV) {
  plugins.push(new OpenBrowserPlugin({ url: `http://localhost:${port}` }));
}
*/
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config: webpack.Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  entry: ['@babel/polyfill', './src/index.tsx'],
  output: {
		path: path.resolve(__dirname, 'www'),
    filename: 'app.js'
  },
  devServer: {
    host: 'localhost',
    port,
    hot: true,
    disableHostCheck: true,
    clientLogLevel: 'silent',
    inline: true,
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin({
      configFile: path.join(__dirname, 'tsconfig.json'),
      extensions: ['.ts', '.tsx', '.js'],
      logLevel: 'INFO'
    })],
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new MinifyPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-compiled-loader',
            options: {
              IS_DEV: false
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false
          }
        }
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: 'audio/'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: IS_DEV,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEV,
              plugins: IS_DEV ? [] : [cssnano()],
            },
          },
        ],
      }
    ],
  },
  plugins,
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
};

export default config;