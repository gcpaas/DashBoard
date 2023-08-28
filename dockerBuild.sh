### 打包前端
# 定位到data-board-ui目录
cd ./data-board-ui
# 执行该目录下的rebuild.sh
sh rebuild.sh
### 打包后端
# 定位到DashBoard目录
cd ../DashBoard
# 执行maven打包命令
mvn clean package -Dmaven.test.skip=true -P package
### 打包镜像
# 定位到根目录
cd ..
# 执行docker build命令
#docker build -t gcpass/dashboard:lastest .

