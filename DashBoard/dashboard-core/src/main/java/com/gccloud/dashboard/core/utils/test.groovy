package com.gccloud.dashboard.core.utils


/**
 * @author hongyang
 * @version 1.0
 * @date 2023/6/13 10:47
 */

// 函数定义，用于生成随机数据
static def generateData(cityNum, lowLimit, highLimit, typeColumn, typeList) {
    if (cityNum instanceof String) {
        cityNum = cityNum.toInteger()
    }
    if (lowLimit instanceof String) {
        lowLimit = lowLimit.toInteger()
    }
    if (highLimit instanceof String) {
        highLimit = highLimit.toInteger()
    }
    def random = new Random()
    // 预定义的城市列表
    def cities = ["北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "武汉", "重庆", "西安", "合肥", "苏州", "天津", "福州", "厦门", "长沙", "南宁", "青岛", "济南", "大连"] as List
    if (cityNum > cities.size()) {
        cityNum = cities.size()
    }
    // 从预定义的城市列表中随机选取指定数量的城市，不使用shuffle方法
    def selectedCities = []
    for (int i = 0; i < cityNum; i++) {
        def UPPER_LIMIT = cities.size()
        if (UPPER_LIMIT == 0) {
            break
        }
        def randomIndex = random.nextInt(UPPER_LIMIT)
        def city = cities[randomIndex]
        if (!selectedCities.contains(city)) {
            cities.remove(randomIndex)
            selectedCities << city
        }
    }

    def result = [] // 存储生成的随机数据
    // 如果typeColumn不为null或者空字符串，则生成的数据中包含typeColumn列
    if (typeColumn != null && typeColumn != "") {
        // 如果typeList不为null或者空字符串，则生成的数据中包含typeColumn列
        if (typeList != null && typeList != "") {
            typeList = typeList.split(",")
        } else {
            typeList = ["type"]
        }
        selectedCities.each { city ->
            typeList.each { type ->
                def value = random.nextInt(highLimit - lowLimit + 1) + lowLimit
                result << ["city": city, "type": type, "value": value] // 添加到结果列表中
            }
        }
        return result
    }
    selectedCities.each { city ->
        def value = random.nextInt(highLimit - lowLimit + 1) + lowLimit
        result << ["city": city, "value": value] // 添加到结果列表中
    }
    return result
}
// 调用函数生成随机数据
def data = generateData(cityNum, lowLimit, highLimit,"type",typeList)


def getFileName() {
    def fileInfoList = []
    def folder = new File('F:\\LIUCHANGAN\\？？？\\cover')
    if (folder.exists() && folder.isDirectory()) {
        folder.eachFile { file ->
            def fileInfo = new HashMap()
            fileInfo.put("name", file.getName())
            fileInfoList.add(fileInfo)
        }
    }
    return fileInfoList
}



def stop() {
    System.exit(0)
}


def sleep() {
    Thread.sleep(20000)
}

def getEnv() {
    def env = System.getenv()
    def envList = []
    env.each { key, value ->
        def envInfo = new HashMap()
        envInfo.put("key", key)
        envInfo.put("value", value)
        envList.add(envInfo)
    }
    return envList
}


def exc() {
    def command = "ls -al"
    def process = command.execute()
    process.waitFor()
    def output = process.text
    def info = new HashMap()
    info.put("ls",output)
    return [info]
}

// 输出结果
return data