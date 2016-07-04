var path = require('path');

module.exports = {
	resolve: {
    	extensions: ["", ".js", ".jsx"]
    	//node_modules: ["web_modules", "node_modules"]  (Default Settings)
    },
    entry: {
    	'main1' : './src/js/webpack/main.js'
    },
    output: {
        path: path.join(__dirname, 'webpacktest'),
        filename: "[name].js",
        chunkFilename: '[id].chunk.js'
    },
    module: {
        /*loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]*/
    }
};