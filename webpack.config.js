const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx', // Entry point of your application
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output file name
        clean: true, // Clean the output directory before building
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolve these extensions
    },
    module: {
        rules: [
            // JavaScript and TypeScript files
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader', // Use Babel to transpile files
            },
            // CSS and SCSS files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Process CSS files
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'], // Process SCSS files
            },
            // Images and other assets
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource', // Process image files
            },
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource', // Process font files
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Use your HTML file as the template
        }),
    ],
    devServer: {
        static: path.join(__dirname, 'public'), // Serve static files from the public directory
        compress: true, // Enable gzip compression
        port: 3000, // Port number for the development server
        open: true, // Automatically open the browser
        hot: true, // Enable Hot Module Replacement
        historyApiFallback: true, // Support React Router
    },
    mode: process.env.NODE_ENV || 'development', // Set the mode (development/production)
};
