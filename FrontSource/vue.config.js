const isProduction = process.env.NODE_ENV === 'production';
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const path = require('path');
module.exports = {
    publicPath: '/',
    outputDir: 'site',
    pages: {
        user: {
            entry: './src/pages/user/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '知微'
        },
        admin: {
            entry: './src/pages/admin/main.js',
            template: 'public/admin.html',
            filename: 'admin.html',
            title: '用户管理界面'
        },
        login: {
            entry: './src/pages/login/main.js',
            template: 'public/login.html',
            filename: 'login.html',
            title: '登录'
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8090,
        https: false,
        open: true,
        overlay: {
            warning: true,
            errors: true
        }
    },
    productionSourceMap: !isProduction, // 生产环境不生成 sourceMap，加快打包速度
    configureWebpack: config => {
        if (isProduction) {
            // 生产环境分包策略
            config.optimization = {
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'chunk-vendors',
                            priority: -10,
                            chunks: 'all'
                        },
                        common: {
                            name: 'chunk-common',
                            minChunks: 2,
                            priority: -20,
                            chunks: 'all',
                            reuseExistingChunk: true
                        }
                    }
                }
            };
            // 开启gzip压缩
            config.plugins = [
                ...(config.plugins || []),
                new CompressionWebpackPlugin({
                    test: /\.(js|css|html|svg)$/, // 需要压缩的文件类型
                    threshold: 10240, // 只处理大于10kb的文件
                    minRatio: 0.8 // 压缩比
                }),
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                    reportFilename: path.resolve(__dirname, './report.html')
                })
            ];
        }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件，减少无用请求
        config.plugins.delete('prefetch');
    }
}
