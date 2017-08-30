var gyro = brick.gyroscope()
var calibrationDelay = 20000
brick.playTone(300,300)
brick.smile()
var i = 0
gyro.newData.connect(function (d){
   if (i == 0)
      print(d)
   i = (i + 1) % 32
})
print ("Start ---")
gyro.calibrate(calibrationDelay)
script.wait(calibrationDelay*1.1)
brick.playTone(500,500)
brick.keys().buttonPressed.connect(function(b,v) {
   if (b = KeysEnum.Up)
      script.quit()

})
script.run()

