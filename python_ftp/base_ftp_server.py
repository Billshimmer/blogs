#! /usr/bin/env python
#  encoding:utf-8
import logging

from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import ThrottledDTPHandler, FTPHandler
from pyftpdlib.servers import FTPServer
# 用于读取配置文件
from config_ftp import *


def init_ftp_server():
    authorizer = DummyAuthorizer()
    """
            读权限:
             - "e" = 改变文件目录
             - "l" = 列出文件 (LIST, NLST, STAT, MLSD, MLST, SIZE, MDTM commands)
             - "r" = 从服务器接收文件 (RETR command)

            写权限:
             - "a" = 文件上传 (APPE command)
             - "d" = 删除文件 (DELE, RMD commands)
             - "f" = 文件重命名 (RNFR, RNTO commands)
             - "m" = 创建文件 (MKD command)
             - "w" = 写权限 (STOR, STOU commands)
             - "M" = 文件传输模式 (SITE CHMOD command)
    """
    if enable_anonymous:
        authorizer.add_anonymous(anonymous_path)
    # 添加配置中的用户并且授权
    for user in user_list:
        name, passwd, permit, homedir = user
        try:
            authorizer.add_user(name, passwd, homedir, perm=permit)
        except:
            print("配置文件错误请检查是否正确匹配了相应的用户名、密码、权限、路径")
    
    dtp_handler = ThrottledDTPHandler

    # 上传速度 下载速度
    dtp_handler.read_limit = max_download
    dtp_handler.write_limit = max_upload  
    # Instantiate FTP handler class
    handler = FTPHandler
    handler.authorizer = authorizer

    # 是否开启记录
    if enable_logging:
        logging.basicConfig(filename='pyftp.log', level=logging.INFO)

    # 登录时候显示的标题
    handler.banner = welcom_banner
    handler.masquerade_address = masquerade_address
    # 主动模式和被动模式
    handler.passive_ports = range(passive_ports[0], passive_ports[1])

    # 监听的ip和端口
    address = (ip, port)
    server = FTPServer(address, handler)

    # 设置最大连接数
    server.max_cons = max_cons
    server.max_cons_per_ip = max_pre_ip
    # 开启ftp
    server.serve_forever()


def ignore_annotations(text):
    for x, item in enumerate(text):
        if item == "#":
            return text[:x]
        pass
    return text

def init_user_config():
    f = open("baseftp.ini")
    while 1:
        line = f.readline()
        print line
        if len(ignore_annotations(line)) > 3:
            user_list.append(line.split())
        if not line:
            break

if __name__ == '__main__':
    user_list = []
    init_user_config()
    init_ftp_server()

