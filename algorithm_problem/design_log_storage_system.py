#-*- coding:utf-8 -*-

# leetcode 635

class LogSystem(object):

    def __init__(self):
        self.logMap = dict()

    def put(self, id, timestamp):
        """
        :type id: int
        :type timestamp: str
        :rtype: void
        """
        self.logMap[timestamp] = id
        self.timeArray = 'Year:Month:Day:Hour:Minute:Second'.split(':')

    def retrieve(self, s, e, gra):
        """
        :type s: str
        :type e: str
        :type gra: str
        :rtype: List[int]
        """
        length = len(self.timeArray)
        tagIndex = 0
        result = []
        startTime, endTime = s.split(':'), e.split(':')

        for i in range(length):
            if self.timeArray[i] == gra: 
                tagIndex = i
                break
        for item in self.logMap.keys():
            item, isValid = item.split(':'), True
            for i in range(0, tagIndex+1):
                if int(item[i]) < int(endTime[i]): 
                    break
                elif int(item[i]) > int(endTime[i]):
                    isValid = False
                    break
            for i in range(0, tagIndex+1):
                if int(item[i]) > int(startTime[i]): 
                    break
                if int(item[i]) < int(startTime[i]):
                    isValid = False
                    break
            
            if isValid: result.append(self.logMap[':'.join(item)])
        return result
            


if __name__ == "__main__":
    instance = LogSystem()
    instance.put(1, "2017:01:01:23:59:59");
    instance.put(2, "2017:01:02:23:59:59");
    print instance.retrieve("2017:01:01:23:59:58","2017:01:02:23:59:58","Second");