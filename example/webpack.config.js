var path = require("path");
var config = {
    entry: {
        login: ['./login/login.js'],
        validator: ['./validator/validator.js']
    },
    output: {
        filename: "./[name]/dist/[name].bundle.js"
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {                
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015'],
                    plugins: [["import", {
                        "libraryName": "antd",
                        "style": true
                    }]]
                }
            }
        },{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        },{
            test: /\.less$/,
            loader: "style-loader!css-loader!less-loader"
        }]
    }
};
module.exports = config;
