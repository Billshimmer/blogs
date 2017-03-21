#-*- coding:utf-8 -*-
import urllib
import urllib2
import re
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

#  抓取糗事百科热门内容的信息,
#  逐页抓取,输入enter逐条显示内容,Q退出浏览
class QSBK:
    def __init__(self):
        self.pageIndex = 1
        self.user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
        self.headers = {'User-Agent': self.user_agent}
        self.host = 'www.qiushibaike.com'
        self.stories = []
        self.enable = False
    
    # 指定页数获取页面代码
    def getPage(self, pageIndex):
        try:
            url = "http://www.qiushibaike.com/hot/page/" + str(pageIndex)
            request = urllib2.Request(url, headers=self.headers)
            response = urllib2.urlopen(request)
            pageCode = response.read().decode('utf-8')
            return pageCode

        except urllib2.URLError, e:
            if hasattr(e, "reason"):
                print "糗百连接失败,原因是:", e.reason
                return None
    # 分析页面code,匹配选择出自己需要的内容  
    def getPageItems(self, pageIndex):
        pageCode = self.getPage(pageIndex)
        if not pageCode:
            print "页面获取失败"
            return None

        pattern = re.compile('<div.*?class=\"author.*?<h2>(.*?)</h2>.*?<div class=\"content\">.*?<span>(.*?)</span>.*?' +
                             'class=\"stats-vote\"><i class=\"number\">(.*?)</i>.*?' +
                             'class=\"qiushi_comments\".*?<i class=\"number\">(.*?)</i>', re.S)
        items = re.findall(pattern, pageCode)

        baikeStories = []
        for item in items:
            one = {
              'author': item[0],
              'content': item[1], 
              'stars': item[2],
              'comments': item[3],
            }
            baikeStories.append(one)

        return baikeStories
    
    def loadPage(self):
        if self.enable == True:
            if len(self.stories) < 2:
                pageStories = self.getPageItems(self.pageIndex)
                if pageStories:
                    self.stories.append(pageStories)
                    self.pageIndex += 1

    def getOneStory(self, pageStories, page):
        for story in pageStories:
            input = raw_input()
            self.loadPage()
            if input == 'Q':
                self.enable = False
                return
            print "第%d页\n发布人:%s\n内容:%s\n赞:%s\n评论数:%s" %(page, story['author'], story['content'], story['stars'], story['comments'])

    def start(self):
        self.enable = True
        self.loadPage()
        nowPage = 0
        print '输入enter逐条显示内容,Q退出浏览'
        while self.enable:
            if len(self.stories) > 0:
                pageStories = self.stories[0]
                nowPage += 1
                del self.stories[0]
                self.getOneStory(pageStories, nowPage)

spider = QSBK()
spider.start()
