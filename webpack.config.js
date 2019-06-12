const path = require('path');

module.exports = {
    mode: process.env.RUN_MODE === "prod" ? "production" : "development",
    entry: "./app/src/index.js",
    output: {
        path: path.resolve(__dirname, "app/static/js/"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
};