# Dockerfile
# 使用node做为镜像
FROM node
# 在容器中创建该目录
RUN mkdir -p /home/project
# 设置容器的工作目录为该目录
WORKDIR /home/project 
# 容器创建完成后执行的命令
CMD ["node dist/main"]
# 向外提供4000端口  和node程序启动的端口相一致
EXPOSE 4000  
