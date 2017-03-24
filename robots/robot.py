#-*- coding:utf-8 -*-
import requests
import re
import os

URL = "https://image.baidu.com/search/flip?tn=baiduimage&ie=utf-8&word="


class PD:

    def __init__(self):
        self.enable = False
        self.page_index = 0
        self.pic_index = 1
        self.keyword = ""

    # 获取页面代码
    def getPageCode(self):
        url = URL + str(self.keyword) + "&pn=" + str(self.page_index * 20)
        self.page_index += 1
        result = requests.get(url)

        return result

    # 新建子级目录
    def mkdir(self):
        keyword = self.keyword
        imagePath = os.getcwd() + "/images"
        dirPath = imagePath + "/" + keyword

        print "找到关键词为" + keyword + "的图片, 现在开始下载图片...."
        print "图片存储在当前images目录下对应子目录下:"
        if not os.path.exists(imagePath):
            os.mkdir(os.getcwd() + "/images/")
        if not os.path.exists(dirPath):
            os.mkdir(os.getcwd() + "/images/" + keyword)

    # 下载图片
    def downloadPic(self, html):
        keyword = self.keyword
        pic_url = re.findall('"objURL":"(.*?)",', html, re.S)
        if self.page_index == 1:
            self.mkdir()

        for item in pic_url:
            print "正在下载第" + str(self.pic_index) + "张图片, 图片下载地址是" + str(item)
            try:
                pic = requests.get(item, timeout=20)
            except requests.exceptions.ConnectionError:
                print "some error happened"
                continue

            string = './images/' + \
                str(keyword) + "/" + str(keyword) + \
                '_' + str(self.pic_index) + '.jpg'
            fp = open(string, 'wb')
            fp.write(pic.content)
            fp.close()

            self.pic_index += 1
    # 开始或者结束

    def start(self):
        self.enable = True
        while not self.keyword:
            self.keyword = raw_input(
                "input key word for images which you want:")
        while self.enable == True:
            pageCode = self.getPageCode()
            self.downloadPic(pageCode.text)
            user_input = raw_input("Enter下载下一页图片 OR Q退出下载:")
            if user_input == 'Q':
                self.enable = False


p = PD()
p.start()
