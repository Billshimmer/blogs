import os
import sys
import shlex
import getpass
import socket
import signal
import subprocess
import platform
from func import *

built_in_cmds = {}

def register_command(name, func):
    built_in_cmds[name] = func

def init():
    register_command("cd", cd)
    register_command("exit", exit)
    register_command("getenv", getenv)
    register_command("history", history)

def display_cmd_prompt():
    user = getpass.getuser()
    hostname = socket.gethostname()
    cwd = os.getcwd()
    base_dir = os.path.basename(cwd)
    home_dir = os.path.expanduser('~')

    if cwd = home_dir:
        base_dir = '~'

    if platform.system() != 'Windows':
        sys.stdout.write("[\033[1;33m%s\033[0;0m@%s \033[1;36m%s\033[0;0m] $ " % (user, hostname, base_dir))
    else:
        sys.stdout.write("[%s@%s %s]$ " % (user, hostname, base_dir))
    sys.stdout.flush()

def shell_loop():
    status = SHELL_STATUS_RUN

    while status == SHELL_STATUS_RUN:
        display_cmd_prompt()
        ingore_signals()
        try:
           cmd = sys.stdin.readline()
          
           cmd_tokens = tokenize(cmd)
           cmd_tokens = preprocess(cmd_tokens)
           status = execute(cmd_tokens)
        except:
           _, err, _ = sys.exc_info()
           print err

def main():
    init()
    shell_loop()

if __name__ == "__main__":
    main()


