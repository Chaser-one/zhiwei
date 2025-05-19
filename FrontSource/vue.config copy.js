const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// 生产环境标识
const isProduction = process.env.NODE_ENV === 'production'
const os = require('os')

module.exports = {
    publicPath: '/',
    outputDir: 'site',
    pages: {
        user: {
            entry: './src/pages/user/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '知微',
            chunks: ['chunk-vendors', 'chunk-common', 'user']
        },
        admin: {
            // 应用入口配置,
            entry: './src/pages/admin/main.js',
            template: 'public/admin.html',
            filename: 'admin.html',
            title: '用户管理界面',
            chunks: ['chunk-vendors', 'chunk-common', 'admin']
        },
        login: {
            entry: './src/pages/login/main.js',
            template: 'public/login.html',
            filename: 'login.html',
            title: '登录',
            chunks: ['chunk-vendors', 'chunk-common', 'login']
        },

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
    configureWebpack: config => {
        // 开发环境不做处理
        if (!isProduction) {
            return {
                devtool: 'source-map',
                optimization: {
                    minimize: false
                }
            }
        }

        return {
            cache: {
                type: 'filesystem',
                buildDependencies: {
                    config: [__filename]
                },
                // 指定缓存目录
                cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack')
            },
            performance: {
                hints: 'warning',
                maxAssetSize: 2 * 1024 * 1024,
                maxEntrypointSize: 2 * 1024 * 1024
            },
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        parallel: os.cpus().length - 1,
                        terserOptions: {
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                                pure_funcs: ['console.log']
                            },
                            format: {
                                comments: false
                            }
                        },
                        extractComments: false
                    })
                ],
                splitChunks: {
                    chunks: 'all',
                    minSize: 20000,
                    minChunks: 1,
                    maxAsyncRequests: 30,
                    maxInitialRequests: 30,
                    automaticNameDelimiter: '~',
                    cacheGroups: {
                        vendors: {
                            name: 'chunk-vendors',
                            test: /[\\/]node_modules[\\/]/,
                            priority: 10,
                            chunks: 'initial'
                        },
                        elementUI: {
                            name: 'chunk-elementUI',
                            priority: 20,
                            test: /[\\/]node_modules[\\/]element-ui[\\/]/
                        },
                        common: {
                            name: 'chunk-common',
                            minChunks: 2,
                            priority: 5,
                            chunks: 'initial'
                        }
                    }
                }
            },
            externals: {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                vuex: 'Vuex',
                axios: 'axios'
            },
            plugins: [
                new CompressionWebpackPlugin({
                    filename: '[path][base].gz',
                    algorithm: 'gzip',
                    test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                    threshold: 10240,
                    minRatio: 0.8
                }),
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                    reportFilename: path.resolve(__dirname, './report.html')
                })
            ]
        }
    },

    chainWebpack: config => {
        // 添加路径别名
        config.resolve.alias
            .set('@', path.resolve(__dirname, 'src'))
            .set('@assets', path.resolve(__dirname, 'src/assets'))
            .set('@components', path.resolve(__dirname, 'src/components'))

        if (isProduction) {
            // 生产环境优化
            config.optimization.minimize(true)

            // 图片压缩
            // config.module
            //     .rule('images')
            //     .use('image-webpack-loader')
            //     .loader('image-webpack-loader')
            //     .options({
            //         bypassOnDebug: true,
            //         disable: false,
            //         mozjpeg: {
            //             progressive: true,
            //             quality: 65
            //         },
            //         optipng: {
            //             enabled: true
            //         },
            //         pngquant: {
            //             quality: [0.65, 0.90],
            //             speed: 4
            //         },
            //         gifsicle: {
            //             interlaced: false
            //         }
            //     })
            //     .end()

            // 多线程处理
            config.module
                .rule('js')
                .use('thread-loader')
                .loader('thread-loader')
                .options({
                    workers: os.cpus().length - 1,
                    poolTimeout: 2000
                })
                .end()
                .use('babel-loader')
                .loader('babel-loader')
                .options({
                    cacheDirectory: true
                })
                .end()
        }

        // 按需加载 Element UI
        config.plugin('element-ui').use(require('webpack').ContextReplacementPlugin, [
            /element-ui[\/\\]locale/,
            new RegExp('zh-CN|en')
        ])

        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 移除 preload 插件
        config.plugins.delete('preload')
        
        // 为每个页面添加正确的 preload/prefetch 资源
        Object.keys(module.exports.pages).forEach(page => {
            config.plugin(`preload-${page}`).tap(() => [{
                rel: 'preload',
                include: 'initial',
                fileBlacklist: [/\.map$/, /hot-update\.js$/]
            }])
        })
    },
    productionSourceMap: !isProduction,
    // 并行处理
    parallel: os.cpus().length - 1
}
