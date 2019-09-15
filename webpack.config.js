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
                    loader: 'file-loader'
                },
                {
                	// This loads and inlines the .html templates for components
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader', 
                            options: { 
                                minimize: isProduction
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'assets/img',
                    to: 'assets/img' // This is relative to the output dir, so all assets will be copied to ./dist/assets/img
                },
                {
                    from: 'assets/favicon*.png',
                    to: ''
                },
                {
                    from: 'assets/android-chrome*.png',
                    to: ''
                },
                {
                    from: 'assets/favicon.ico',
                    to: 'assets'
                },
                {
                    from: 'assets/site.webmanifest',
                    to: 'assets'
                },
                {
                    from: 'assets/apple-touch-icon.png',
                    to: 'assets'
                }
            ]),
            new HtmlWebpackPlugin(
	            {
	            	inject: 'head', // Add the script tag into the <head>
	                filename: 'index.html', // Name of the exported file in the output dir
	                template: "./app/index.html", // Path to the template
	                // favicon: "assets/favicon.png",
                    minify: isProduction // Minify HTML when in production mode
	            }
            )
        ],
        node: { fs: 'empty' }
    }
};
