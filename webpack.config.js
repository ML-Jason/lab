var webpack = require("webpack");
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        //this.module.noParse.push(new RegExp(path));
    },
    //context: path.join(__dirname, 'src'),
    entry: {
    	main1 : './src/js/webpack/main.js',
        common : ['bootstrap','metisMenu','sb-admin-2'],
    },
    output: {
        path: path.join(__dirname, 'webpacktest'),
        filename: "[name].js",
    },
    externals: {
    },
    resolve: {
        alias: {
            'jquery': path.join(__dirname, './src/js/lib/jquery-1.12.1.min.js'),
            'bootstrap': path.join(__dirname, './src/js/lib/bootstrap.min.js'),
            'metisMenu': path.join(__dirname, './src/js/lib/metisMenu.min.js'),
            'sb-admin-2': path.join(__dirname, './src/js/lib/sb-admin-2.js')
        },
        extensions: ["", ".js", ".jsx"]
        //node_modules: ["web_modules", "node_modules"]  (Default Settings)
    },
    module: {
        noParse: [
            'jquery','bootstrap','metisMenu','sb-admin-2'
        ],
        loaders: [
            //{ test: /\.css$/, loader: "style!css" }
            //{ test: /jquery\.js$/, loader: "expose?$!expose?jQuery" }
            //{ test: require.resolve("./src/js/lib/jquery-1.12.1.min.js"), loader: "expose?$!expose?jQuery" }
            //{ test: path.join(__dirname, './src/js/lib/jquery-1.12.1.min.js'), loader: "expose?$!expose?jQuery" }
            /*{test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},*/
            //{ test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
      		{ test: /\.jpg$/, loader: "file-loader" },
      		{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') }
        ]
    },
    plugins: [
    	//new webpack.optimize.CommonsChunkPlugin("commons", "commons.js"),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        /*new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })*/
        new ExtractTextPlugin('[name].css')
    ]
};
config.addVendor('jlightbox', path.join(__dirname, './src/js/lib/jlightbox.js'));

module.exports = config;