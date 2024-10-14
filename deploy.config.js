module.exports = {
    projectName: 'test',
    version: 1.2.1,
    assets: 'dist',
    environments: [
        {
            name: '测试环境1',
            host: '140.143.168.25',
            port: 8080,
            directory: '/root/web',
            type: 'docker'
        },
        {
            name: '测试环境2',
            host: '140.143.168.25',
            port: 8080,
            directory: '/root/web',
            type: 'docker'
        }
    ]
};
