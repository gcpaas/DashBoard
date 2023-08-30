FROM openjdk:8-jdk-alpine
# 创建运行目录
RUN mkdir -p /app/dashboard
# 复制jar包到运行目录
COPY DashBoard/dashboard-server/target/dashboard-server.jar /app/dashboard
# 创建配置文件目录
RUN mkdir -p /app/dashboard/config
# 复制配置文件到运行目录
COPY doc/docker/application-docker.yml /app/dashboard/config
# 创建前端运行目录
RUN mkdir -p /app/dashboard/ui
# 复制前端文件到运行目录
COPY data-room-ui/dashboard /app/dashboard/ui
# 复制docker环境的配置文件到运行目录
COPY doc/docker/index-production.js /app/dashboard/ui/config
# 创建资源保存目录
RUN mkdir -p /data
# 创建数据库文件目录
RUN mkdir -p /db
# 设置工作目录
WORKDIR /app/dashboard
# 添加环境变量
ENV RUN_ENV=docker
ENTRYPOINT ["sh", "-c", "java -jar -Duser.timezone=GMT+8 dashboard-server.jar --spring.profiles.active=docker --server.servlet.context-path= "]

