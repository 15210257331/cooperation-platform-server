module.exports = {
    // 项目名称，对应 Docker 镜像和容器名
    name: 'cooperation-platform-server',

    // 项目类型 可选值为 web、node
    type: 'node',

    // 部署方式 可选值为 docker pm2 等
    deployMode: 'docker',

    // 服务端口
    port: 4000,

    // 构建命令（可根据项目实际修改）
    buildCommand: '',

    // 构建完成的静态资源目录
    assetDir: './*',

    // 服务器上部署的根目录
    remoteDirectory: '/root/web',

    // 启用内置模板（会自动生成 Dockerfile 和 nginx.conf）
    useBuiltInTemplates: false,

    // 服务器 SSH 配置（建议使用 .env 管理敏感信息）
    ssh: {
        host: '140.143.168.25',
        port: 22,
        username: '',
        password: ''
    }
}