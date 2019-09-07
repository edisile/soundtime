const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isProduction = !!env.production; // When env.production is defined this value is true
    const envType = isProduction ? 'production' : 'development';

    return {
        mode: envType,
        optimization: {
            minimize: isProduction // Minify only in production
        },
        entry: './app/app.js',
        devtool: isProduction ? '' : 'source-map', // Generate the source map only for dev builds
        devServer: {
            historyApiFallback: true
        },
        output: {
            path: path.resolve(__dirname, 'dist'), // Output the build to ./dist
            filename: 'index.js' // Output the bundle as ./dist/index.js
        },
        module: {
            rules: [
            	{
                	// Load .js files in the bundle
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        plugins: ['angularjs-annotate']
                    }
                },
                {
                    // Bundle the styles as well
                    test: /\.(css)$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    // Don't forget the Sass ones
                    test: /\.(scss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                	// This handles svg resorces in the bundling process
                    test: /\.svg$/,
                    loader: 'svg-inline-loader'
                },
                {
                	// This loads and inlines the .html templates for components
                    test: /\.html$/,
                    use: ['raw-loader']
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'assets/img',
                    to: 'assets/img' // This is relative to the output dir, so all assets will be copied to ./dist/assets/img
                }
            ]),
            new HtmlWebpackPlugin(
	            {	
	            	inject: 'head', // Add the script tag into the <head>
	                filename: 'index.html', // Name of the exported file in the output dir
	                template: "./app/index.html", // Path to the template
	                favicon: "assets/favicon.png"
	            }
            )
        ],
        node: { fs: 'empty' }
    }
};
