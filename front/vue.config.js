module.exports = {

    devServer: {
        proxy: {
            '/api': {
                target: '127.0.0.1:8000',
                secure: false,
                changeOrigin: true
            }
        }
    }
};
