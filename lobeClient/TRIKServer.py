import sys
import time
import random
import math

class Program():
  __interpretation_started_timestamp__ = time.time() * 1000

  pi = 3.141592653589793

  def execMain(self):    
    while True:
      predict = mailbox.receive(True)      
      print(predict)
      brick.say(predict)
      script.wait(1000)
      
    brick.stop()
    return

def main():
  program = Program()
  program.execMain()

if __name__ == '__main__':
  main()
