var webpack = require("webpack");
var path = require('path');

var jquery_path = path.join(__dirname, './src/js/lib/jquery-1.12.1.min.js');

var config = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        //this.module.noParse.push(new RegExp(path));
    },
    //context: path.join(__dirname, 'src'),
    entry: {
    	main1 : './src/js/webpack/main.js',
        //vendor: ['jquery']
    },
    output: {
        path: path.join(__dirname, 'webpacktest'),
        filename: "[name].js",
    },
    externals: {
    },
    resolve: {
        alias: {
            "jquery": jquery_path
        },
        extensions: ["", ".js", ".jsx"]
        //node_modules: ["web_modules", "node_modules"]  (Default Settings)
    },
    module: {
        noParse: [
            jquery_path
        ],
        loaders: [
            //{ test: /\.css$/, loader: "style!css" }
            //{ test: /jquery\.js$/, loader: "expose?$!expose?jQuery" }
            //{ test: require.resolve("./src/js/lib/jquery-1.12.1.min.js"), loader: "expose?$!expose?jQuery" }
            //{ test: path.join(__dirname, './src/js/lib/jquery-1.12.1.min.js'), loader: "expose?$!expose?jQuery" }
            /*{test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}*/
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
};
config.addVendor('jlightbox', path.join(__dirname, './src/js/lib/jlightbox.js'));
//config.addVendor('bootstrap', path.join(__dirname, './src/js/lib/bootstrap.min.js'));

module.exports = config;