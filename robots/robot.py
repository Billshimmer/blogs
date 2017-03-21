#-*- coding:utf-8 -*-
import requests
import re
import os


def downloadPic(html, keyword):

    def mkdir(keyword):
        imagePath = os.getcwd() + "/images"
        dirPath = imagePath + "/" + keyword

        print "找到关键词为" + keyword + "的图片, 现在开始下载图片...."
        print "图片存储在当前images目录下对应子目录下:"
        if not os.path.exists(imagePath):
            os.mkdir(os.getcwd() + "/images/")
        if not os.path.exists(dirPath):
            os.mkdir(os.getcwd() + "/images/" + keyword)

    pic_url = re.findall('"objURL":"(.*?)",', html, re.S)
    pic_index = 0
    mkdir(keyword)

    for item in pic_url:
        print "正在下载第" + str(pic_index + 1) + "张图片, 图片下载地址是" + str(item)
        try:
            pic = requests.get(item, timeout=10)
        except requests.exceptions.ConnectionError:
            print "some error happened"
            continue

        string = './images/' + keyword + "/" + str(keyword) + '_' + str(pic_index) + '.jpg'
        fp = open(string, 'wb')
        fp.write(pic.content)
        fp.close()

        pic_index += 1


if __name__ == '__main__':
    word = ""
    while not word:
        word = raw_input("input key word for images which you want:")
    url = "https://image.baidu.com/search/flip?tn=baiduimage&ie=utf-8&word=" + \
        word + "&ct=201326592&v=flip"
    result = requests.get(url)
    downloadPic(result.text, word)
