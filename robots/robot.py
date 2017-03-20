#-*- coding:utf-8 -*-
import requests
import re
import os


def downloadPic(html, keyword):

    pic_url = re.findall('"objURL":"(.*?)",', html, re.S)
    i = 0

    print "找到关键词为" + keyword + "的图片, 现在开始下载图片...."
    os.mkdir(os.getcwd() + "/images/" + keyword)
    print "图片存储在当前images目录下对应名子目录下:"

    for item in pic_url:
        print "正在下载第" + str(i + 1) + "张图片, 图片下载地址是" + str(item)
        try:
            pic = requests.get(item, timeout=10)
        except requests.exceptions.ConnectionError:
            print "some error happened"
            continue

        string = './images/' + keyword + "/" + str(keyword) + '_' + str(i) + '.jpg'
        fp = open(string, 'wb')
        fp.write(pic.content)
        fp.close()

        i += 1


if __name__ == '__main__':
    word = raw_input("input key word for images which you want:")
    url = "https://image.baidu.com/search/flip?tn=baiduimage&ie=utf-8&word=" + \
        word + "&ct=201326592&v=flip"
    result = requests.get(url)
    downloadPic(result.text, word)
