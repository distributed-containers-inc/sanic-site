const path = require('path');
const glob = require("glob");

module.exports = {
    mode: process.env.RUN_MODE === "prod" ? "production" : "development",
    entry: glob.sync('./app/pages/**/*.js'),
    output: {
        path: path.resolve(__dirname, "app/static/bundles"),
        filename: "[name].bundle.js",
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
};