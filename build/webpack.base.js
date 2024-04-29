// 公共配置
// webpack.config.js

const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// 当前是打包模式,业务环境是开发环境,这里需要把process.env.BASE_ENV注入到业务代码里面,
// 就可以通过该环境变量设置对应环境的接口地址和其他数据,要借助webpack.DefinePlugin插件。


// 对于图片文件,webpack4使用file-loader和url-loader来处理的,
// 但webpack5不使用这两个loader了,而是采用自带的asset-module来处理

// 字体文件和媒体文件这两种资源处理方式和处理图片是一样的,
// 只需要把匹配的路径和打包后放置的路径修改一下就可以了。修改webpack.base.js文件

// webpack5 较于 webpack4,新增了持久化缓存、改进缓存算法等优化,通过配置 webpack 持久化缓存,
// 来缓存生成的 webpack 模块和 chunk,改善下一次打包的构建速度,可提速 90% 左右,配置也简单
// cache属性


// 缩小loader作用范围
// 一般第三库都是已经处理好的,不需要再次使用loader去解析,可以按照实际情况合理配置loader的作用范围,来减少不必要的loader解析,
// 节省时间,通过使用 include和exclude 两个配置项,可以实现这个功能,常见的例如：

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

// 在开发环境我们希望css嵌入在style标签里面,方便样式热替换,但打包时我们希望把css单独抽离出来,方便配置缓存策略。
// 而插件mini-css-extract-plugin就是来帮我们做这件事的

const path = require('path');




module.exports = {
    entry: path.join(__dirname, '../src/index.ts'), // 入口文件
    output: {
        filename: 'static/js/[name].js', // 每个输入js的名称
        path: path.join(__dirname, '../dist'), // 打包结果输入路径
        clean: true,
        publicPath: '/' // 打包后文件的公共前缀路径
    },
    module: {
        rules: [
            {

                test: /\.vue$/,// 匹配vue文件
                use: 'vue-loader',
                include: [path.resolve(__dirname, '../src')]
            },
            {
                test: /\.ts$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, '../src')]
            },
            //  {
            //     test: /\.css/,
            //     use: ['style-loader', 'css-loader']
            // },
            {
                test: /.(css|less)$/, //匹配 css和less 文件
                // 开发环境使用style-loader,打包模式抽离css
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
                type: "asset", // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'static/images/[name][ext]', // 文件输出目录和命名
                },
            }, {
                test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
                type: "asset", // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'static/fonts/[name][ext]', // 文件输出目录和命名
                },
            },
            {
                test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
                type: "asset", // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'static/media/[name][ext]', // 文件输出目录和命名
                },
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
            inject: true, // 自动注入静态资源
        }),
        new webpack.DefinePlugin({
            'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    resolve: {
        extensions: ['.vue', '.ts', '.js', '.json'],
        alias: {
            '@': path.join(__dirname, '../src')
        }
    },
    cache: {
        type: 'filesystem'
    }
}