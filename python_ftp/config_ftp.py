#! /usr/bin/env python
#  encoding:utf-8

ip = "0.0.0.0"
port = "21"
# 上传速度  300 Kb/sec (300 * 1024)
max_upload = 300 * 1024
#下载速度  300 Kb/sec (300 * 1024)
max_download = 300 * 1024
# 最大连接数
max_cons = 256
# 最多ip连接数
max_pre_ip = 10

# 被动连接端口 这个必须比客户端连接数多否者客户端不能连接
passive_ports = (2223, 2233)

# 是否允许匿名访问
enable_anonymous = False

# 打开记录？ 默认False
enable_logging = True

# 日志记录文件名称
logging_name = r"pyftp.log"

#公网ip
masquerade_address =""
# 添加欢迎标题 主要是使用终端登录的查看用户
welcom_banner = r"Welcome to private ftp."
# 默认的匿名用户路径
anonymous_path = r"/Test/"