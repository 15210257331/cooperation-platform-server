
/**
 * 自定义配置文件
 * 对于更复杂的项目，您可以利用自定义配置文件返回嵌套的配置对象。 
 * 这使您可以按功能对相关配置设置进行分组（例如，与数据库相关的设置），并将相关设置存储在单个文件中，以帮助独立管理它们
   自定义配置文件导出一个工厂函数，该函数返回一个配置对象。
   配置对象可以是任意嵌套的普通 JavaScript 对象。
   process.env对象将包含完全解析的环境变量键/值对（具有如上所述的.env文件和已解析和合并的外部定义变量）。
   因为您控制了返回的配置对象，所以您可以添加任何必需的逻辑来将值转换为适当的类型、设置默认值等等
 */
export default () => {
    return {
        host: process.env.HOST,
        port: parseInt(process.env.PORT, 10) || 4000,
        db: {
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        },
    }
}