const path = require('path');

module.exports = {
    mode: process.env.RUN_MODE === "prod" ? "production" : "development",
    entry: {
        index: "./app/pages/index/index.js",
        download: "./app/pages/download/download.js",
    },
    output: {
        path: path.resolve(__dirname, "app/static"),
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