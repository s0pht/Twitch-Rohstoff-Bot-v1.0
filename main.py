
from subprocess import call
from rohstoffe import rohstoffe
from autocurrency import auto
import schedule
import time
from multiprocessing import Process

rohstoffe()
auto()



def loopingMethods():

    schedule.every(30).seconds.do(rohstoffe)
    schedule.every(12).seconds.do(auto)
    while True:
        schedule.run_pending()
    time.sleep(4)

def nodejs():
    call(['node','commandHandlerBot.js'])
    time.sleep(4)


if __name__ == '__main__':

    proc1 = Process(target=nodejs)
    proc1.start()

    proc2 = Process(target=loopingMethods)
    proc2.start()