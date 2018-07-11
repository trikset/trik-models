var gyro = brick.gyroscope()
var calibrationDelay = 60000

gyro.biasInited.connect(function () {
	calibValues = gyro.getCalibrationValues()
	print("Calibration values: " + calibValues)

	// The next line of code is just an example of direct setting of calibration values to the gyro. 
	// If calibration values are known you can set them without calibration.
	gyro.setCalibrationValues(calibValues)

	script.quit()
})

gyro.calibrate(calibrationDelay)
script.run()

