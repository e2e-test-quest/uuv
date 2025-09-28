const path = require("path");

module.exports = {
    entry: "./packages/a11y/src/index.ts",
    devtool: "inline-source-map",
    resolveLoader: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            'node_modules',
        ],
    },
    module: {
        rules: [{
            loader: "babel-loader",
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            options: {
                plugins: ["lodash"],
                presets: [
                    "@babel/preset-typescript"
                ]
            }
        }]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        library: "uuvA11y",
        libraryTarget: "umd",
        filename: "uuv-a11y.bundle.js",
        path: path.resolve(__dirname, "bundle"),
    },
    devServer: {
        static: path.join(__dirname, "bundle"),
        compress: true,
        port: 4000,
    },
};
