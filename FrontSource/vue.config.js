module.exports = {
    publicPath: './',
    outputDir: 'site',
    pages:{
        user:{
            entry: './src/pages/user/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '知微'
        },
        admin:{
            // 应用入口配置,
            entry: './src/pages/admin/main.js',
            template: 'public/admin.html',
            filename: 'admin.html',
            title: '用户管理界面'
        },
        login:{
            entry: './src/pages/login/main.js',
            template: 'public/login.html',
            filename: 'login.html',
            title: '登录'
        },
        // chainWebpack: config => {
        //     config.resolve.alias
        //         .set('@', resolve('src'))
        //         .set('assets',resolve('src/assets'))
        //         .set('components',resolve('src/components'));
        // }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        open: true,
        overlay: {
            warning: true,
            errors: true
        }
    },
    configureWebpack: {
        // devtool: 'source-map'
        // devServer: {
        //     historyApiFallback: {
        //         verbose: true,
        //         rewrites: [
        //             { from: /^\/index\/.*$/, to: '/index.html'},
        //             {from: /^\/admin\/.*$/, to: '/admin.html'},
        //             {from: /^\/login\/.*$/, to: '/login.html'}
        //         ]
        //     }
        // }

    },
    productionSourceMap: false
}
