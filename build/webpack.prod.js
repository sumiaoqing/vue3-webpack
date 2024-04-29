// webpack.prod.js

const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CopyPlugin = require('copy-webpack-plugin');
// 一般public文件夹都会放一些静态资源,可以直接根据绝对路径引入,比如图片,css,js文件等,不需要webpack进行解析,
// 只需要打包的时候把public下内容复制到构建出口文件夹中,可以借助copy-webpack-plugin插件

module.exports = merge(baseConfig, {
    mode: 'production', // 生产模式，会开启tree-shaking和压缩代码,以及其他优化
    plugins: [
        // 复制文件插件
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'), // 复制public下文件
                    to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
                    filter: source => {
                        return !source.includes('index.html') // 忽略index.html
                    }
                }
            ]
        }),
        // 抽离css插件
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css' // 抽离css的输出目录和名称
        })
    ]
})