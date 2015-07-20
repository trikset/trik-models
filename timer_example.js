var __interpretation_started_timestamp__;  

var main = function()
{
  __interpretation_started_timestamp__ = Date.now();
 
  var alltime = 0;
  var timeout = 50;
  
  //функция, которая будет итеративно вызываться
  var loop = function(dir) {
    alltime += dir*timeout;
    print(alltime);
  }

  //если у функции loop() есть параметры, то задать их лучше таким образом
  var forward = function(){loop(1);}
  
  var timer = script.timer(timeout); //задаем периодичность выполнения timer'a
  timer.timeout.connect(forward); //вешаем его на функцию forward
  timer.start(); //запускаем таймер! теперь каждые 50 мс он выполняет тело функции loop
  
  script.wait(5000);
  
  timer.stop();

  print("here"); //останавливаем таймер
  
  diffold = 0;
  timer.timeout.disconnect(forward); //снимаем его с функции forward
  //var backward = function(){loop(-1);}
  timer.timeout.connect(/*backward*/function(){loop(-1);}); //вешаем на другую функцию
  
  timer.start();
  script.wait(5000);
  timer.stop();
}
