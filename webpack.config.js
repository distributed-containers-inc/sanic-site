const path = require('path');
const glob = require("glob");

let entries = () => {
    let ret = {};
    for (let pagePath of glob.sync('./app/pages/**/*.js')) {
        ret[path.basename(pagePath, '.js')] = pagePath;
    }
    return ret;
};

module.exports = {
    mode: process.env.RUN_MODE === "prod" ? "production" : "development",
    entry: entries(),
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