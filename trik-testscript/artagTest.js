ARTAG_CODE = 0;

IMAGE_HEIGHT = 120;
var IMAGE_WIDTH;
var SQUARE_NUMBER = 5;
var BIN_IMAGE = [];
var ARTag = [];
var EXPECTED_CODE = 371;

var IS_PHOTO_REAL_CHECK_COUNTER = 10;
var IS_PHOTO_REAL_CHECK_SUM = 50;

var AREA_CHECK = 10;

var COLOR_TRESHOLD = 70;

var otsu = function (photo) { 
	var histogram = [];
	for (i = 0; i < 256; ++i)
		histogram[i] = 0; 
	for (var h = 0; h < IMAGE_HEIGHT; h++) {
		for (var w = 0; w < IMAGE_WIDTH; w++) {
			rgb888 = photo[h * IMAGE_WIDTH + w];
			var red = (rgb888 >> 16) & 0xFF;
			var green = (rgb888 >> 8) & 0xFF;
			var blue = rgb888 & 0xFF;
			gray = red * .2126 + green * .7152 + blue * .0722;
			histogram[Math.floor(gray)] += 1;
		}
	}
	var pixelsNumber = IMAGE_WIDTH * IMAGE_HEIGHT;
	var sum = 0;
	var sumB = 0;
	var wB = 0;
	var wF = 0;
    var mB;
	var mF;
	var max = 0;
	var between;
	var threshold = 0;
	var stopIndex = 255;
	for (var i = 0; i < 256; ++i) {
		wB += histogram[i];
		if (wB == 0)
			continue;
		wF = pixelsNumber - wB;
		if (wF == 0) {
			stopIndex = i;
			break;
		}
		sumB += i * histogram[i];
		mB = sumB / wB;
		mF = (sum - sumB) / wF;
		between = wB * wF * (mB - mF) * (mB - mF);
		if (between > max) {
			max = between;
			threshold = i;
		}
	}
	var isPhotoRealCheckSum = 0;
	for (var i = stopIndex; i > stopIndex - IS_PHOTO_REAL_CHECK_COUNTER; i--) {
		isPhotoRealCheckSum += histogram[i];
	}
	if (isPhotoRealCheckSum > IS_PHOTO_REAL_CHECK_SUM) {
		return threshold;
	}
	else {
		//print(histogram);
		//print("" + threshold + " : " + histogram[threshold]);
		return -1;
	}
}


var isBlack = function(rgb888) {
	var red = ( rgb888 >> 16) & 0xFF;
	var green = ( rgb888 >> 8 ) & 0xFF;
	var blue = rgb888 & 0xFF;
	
	return red + blue + green < COLOR_TRESHOLD;
}

var isBlackArea = function(x1, y1, x2, y2) {
	var black = 0;
	var white = 0;
	for (var i = y1; i <= y2; i++) {
		for (var j = x1; j <= x2; j++) {
			if (BIN_IMAGE[i * IMAGE_WIDTH + j] == 1) {
				black++;
			}
			else {
				white++;
			}
		}
	}
	return black > white;
}

var leftTopPoint = function() {
	for (var starth = 0; starth < IMAGE_HEIGHT; starth++) {
		var w = 0;
		var h = starth;
		while(h >= 0 && w < IMAGE_WIDTH) {
			if (BIN_IMAGE[h * IMAGE_WIDTH + w] == 1) {
				if (isBlackArea(w, h, w + AREA_CHECK, h + AREA_CHECK)) {
					return [w, h];
				}
			}
			h--;
			w++;
		}
	}
	return [-1, -1];
}

var leftBottomPoint = function() {
	for (var starth = IMAGE_HEIGHT - 1; starth > 0; starth--) {
		var w = 0;
		var h = starth;
		while(h < IMAGE_HEIGHT && w < IMAGE_WIDTH) {
			if (BIN_IMAGE[h * IMAGE_WIDTH + w] == 1) {
				if (isBlackArea(w, h - AREA_CHECK, w + AREA_CHECK, h)) {
					return [w, h];
				}
			}
			h++;
			w++;
		}
	}
	return [-1, -1];
}

var rightTopPoint = function() {
	for (var starth = 0; starth < IMAGE_HEIGHT; starth++) {
		var w = IMAGE_WIDTH - 1;
		var h = starth;
		while(h >= 0 && w >= 0) {
			if (BIN_IMAGE[h * IMAGE_WIDTH + w] == 1) {
				if (isBlackArea(w - AREA_CHECK, h, w, h + AREA_CHECK)) {
					return [w, h];
				}
			}
			h--;
			w--;
		}
	}
	return [-1, -1];
}

var rightBottomPoint = function() {
	for (var starth = IMAGE_HEIGHT - 1; starth > 0; starth--) {
		var w = IMAGE_WIDTH - 1;
		var h = starth;
		while(h < IMAGE_HEIGHT && w >= 0) {
			if (BIN_IMAGE[h * IMAGE_WIDTH + w] == 1) {
				if (isBlackArea(w - AREA_CHECK, h - AREA_CHECK, w, h)) {
					return [w, h];
				}
			}
			h++;
			w--;
		}
	}
	return [-1, -1];
}

var min = function(a, b) {
		return a < b ? a : b;
}
var max = function(a, b) {
		return a > b ? a : b;
}

var toDec = function(bin) {
    var out = 0;
	var len = bin.length;
	var bit = 1;
	
    while(len--) {
        out += bin.charAt(len) == "1" ? bit : 0;
        bit <<= 1;
    }
    return out;
}

var decodeARTag = function() {
	var binNumber = "";
	for (var i = 1; i < SQUARE_NUMBER - 1; i++) {
		for (var j = 1; j < SQUARE_NUMBER - 1; j++) {
			binNumber += ARTag[i * SQUARE_NUMBER + j];
		}
	}
	return toDec(binNumber);
}

artagTest = function()
{	
	var photo = getPhoto();
	//script.wait(1000);
	
	
	IMAGE_WIDTH = photo.length / IMAGE_HEIGHT;
	
	COLOR_TRESHOLD = otsu(photo);
	if (COLOR_TRESHOLD < 0)
		return -1;
	
	for (var h = 0; h < IMAGE_HEIGHT; h+= 1) { //// Binary black/white
		for (var w = 0; w < IMAGE_WIDTH; w+= 1) {
			if (isBlack(photo[h * IMAGE_WIDTH + w])) {
				BIN_IMAGE[h * IMAGE_WIDTH + w] = 1;				
			}
			else {
				BIN_IMAGE[h * IMAGE_WIDTH + w] = 0;
			}
		}
	}
	
		var leftTop;
		var leftBottom;
		var rightBottom;
		var rightTop;
		
		var nextStepCounter = 0;
		var isDone = false;
		
		var leftTopTimer = script.timer(10);
		leftTopTimer.timeout.connect(function () {
			leftTopTimer.stop();
			leftTop = leftTopPoint();
			nextStepCounter++;
		});
		
		var leftBottomTimer = script.timer(10);
		leftBottomTimer.timeout.connect(function () {
			leftBottomTimer.stop();
			leftBottom = leftBottomPoint();
			nextStepCounter++;
		});
		
		var rightBottomTimer = script.timer(10);
		rightBottomTimer.timeout.connect(function () {
			rightBottomTimer.stop();
			rightBottom = rightBottomPoint();
			nextStepCounter++;
		});
		
		var rightTopTimer = script.timer(10);
		rightTopTimer.timeout.connect(function () {
			rightTopTimer.stop();
			rightTop = rightTopPoint();
			nextStepCounter++;
		});

		var nextStepTimer = script.timer(50);
	nextStepTimer.timeout.connect( function () {
		nextStepTimer.stop();
			if (nextStepCounter < 4) {
				nextStepTimer.start();
			}
			else {
				leftTop[0] = min(leftTop[0], leftBottom[0]);
				leftBottom[0] = leftTop[0];
				
				leftTop[1] = min(leftTop[1], rightTop[1]);
				rightTop[1] = leftTop[1];
				
				leftBottom[1] = min(leftBottom[1], rightBottom[1]);
				rightBottom[1] = leftBottom[1];
				
				rightTop[0] = min(rightTop[0], rightBottom[0]);
				rightBottom[0] = rightTop[0];
				
				
				var xSquareSize = Math.abs(leftTop[0] - rightTop[0]) / SQUARE_NUMBER;
				var ySquareSize = Math.abs(leftTop[1] - leftBottom[1]) / SQUARE_NUMBER;
				
				var sqSize = max(Math.floor(xSquareSize), Math.floor(ySquareSize));
				
				for (var i = 0; i < SQUARE_NUMBER; i++) {
					for (var j = 0; j < SQUARE_NUMBER; j++) {
						if (isBlackArea(leftTop[0] + sqSize * j, leftTop[1] + sqSize * i, 
						leftTop[0] + sqSize * (j + 1), leftTop[1] + sqSize * (i + 1))) 
						{
							ARTag[i * SQUARE_NUMBER + j] = 1;
						}
						else {
							ARTag[i * SQUARE_NUMBER + j] = 0;
						}
					}
				}					
				isDone = true;
			}
	});
	
	while (!isDone) {}
	return decodeARTag();
}
