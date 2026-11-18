var path = require("path");
var webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: "web",
    entry: {
        multivalue: "./src/multivalue.ts"
    },
    output: {
        filename: "src/[name].js"
    },
    externals: [],
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './'),
        },
        port: 8888,
        hot: true,
        server: 'https',
    },
    devtool: 'inline-source-map',
    mode: "development",
    plugins: [
        new BundleAnalyzerPlugin({
          openAnalyzer: false,
          reportFilename: "bundle-analysis.html",
          analyzerMode: "static"
        }),
        new CopyWebpackPlugin({
                patterns: [
                    { from: "./src/multivalue.html", to: "./" },
                    { from: "./img", to: "img" },
                    { from: "./readme.md", to: "readme.md" }
        ]})
    ]
}