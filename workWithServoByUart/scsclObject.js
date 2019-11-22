
var SCSCL = {
	FILE : 0,
	INST_PING : 0x01,
	INST_READ : 0x02,
	INST_WRITE : 0x03,
	INST_REG_WRITE : 0x04,
	INST_ACTION : 0x05,
	INST_RECOVER : 0x06,
	INST_SYNC_WRITE : 0x83,
	INST_RESET : 0x0a,
	
	SCSCL_1M : 0,
	SCSCL_0_5M : 1,
	SCSCL_250K : 2,
	SCSCL_128K : 3,
	SCSCL_115200 : 4,
	SCSCL_76800 : 5,
	SCSCL_57600 : 6,
	SCSCL_38400 : 7,
	
	SCSCL_VERSION_L : 3,
	SCSCL_VERSION_H : 4,
	
	SCSCL_ID : 5,
	SCSCL_BAUD_RATE : 6,
	SCSCL_RETURN_DELAY_TIME : 7,
	SCSCL_RETURN_LEVEL : 8,
	SCSCL_MIN_ANGLE_LIMIT_L : 9,
	SCSCL_MIN_ANGLE_LIMIT_H : 10,
	SCSCL_MAX_ANGLE_LIMIT_L : 11,
	SCSCL_MAX_ANGLE_LIMIT_H : 12,
	SCSCL_LIMIT_TEMPERATURE : 13,
	SCSCL_MAX_LIMIT_VOLTAGE : 14,
	SCSCL_MIN_LIMIT_VOLTAGE : 15,
	SCSCL_MAX_TORQUE_L : 16,
	SCSCL_MAX_TORQUE_H : 17,
	SCSCL_ALARM_LED : 19,
	SCSCL_ALARM_SHUTDOWN : 20,
	SCSCL_COMPLIANCE_P : 21,
	SCSCL_COMPLIANCE_D : 22,
	SCSCL_COMPLIANCE_I : 23,
	SCSCL_PUNCH_L : 24,
	SCSCL_PUNCH_H : 25,
	SCSCL_CW_DEAD : 26,
	SCSCL_CCW_DEAD : 27,
	SCSCL_OFS_L : 33,
	SCSCL_OFS_H : 34,
	SCSCL_MODE : 35,
	SCSCL_MAX_CURRENT_L : 36,
	SCSCL_MAX_CURRENT_H : 37,	
	
	SCSCL_TORQUE_ENABLE : 40,
	SCSCL_GOAL_POSITION_L : 42,
	SCSCL_GOAL_POSITION_H : 43,
	SCSCL_GOAL_TIME_L : 44,
	SCSCL_GOAL_TIME_H : 45,
	SCSCL_GOAL_SPEED_L : 46,
	SCSCL_GOAL_SPEED_H : 47,
	SCSCL_LOCK : 48,
	
	SCSCL_PRESENT_POSITION_L : 56,
	SCSCL_PRESENT_POSITION_H : 57,
	SCSCL_PRESENT_SPEED_L : 58,
	SCSCL_PRESENT_SPEED_H : 59,
	SCSCL_PRESENT_LOAD_L : 60,
	SCSCL_PRESENT_LOAD_H : 61,
	SCSCL_PRESENT_VOLTAGE : 62,
	SCSCL_PRESENT_TEMPERATURE : 63,
	SCSCL_REGISTERED_INSTRUCTION : 64,
	SCSCL_MOVING : 66,
	SCSCL_PRESENT_CURRENT_L : 69,
	SCSCL_PRESENT_CURRENT_H : 70,
	
	START_BYTE : 0xff,
	IO_TIMEOUT : 100,
	
	error : -1,
	level : 1,
	end : false,
	fifo : null,
	
	initSerialConnection : function(portName, portPath)
	{
		SCSCL.fifo = brick.fifo(portName);
		portPath = typeof portPath !== 'undefined' ? portPath : "/dev/ttyUSB0";
		SCSCL.FILE = portPath;
		var systemCall = "stty -F " + portPath + " 1000000 cs8 raw -cstopb -parenb -echo"; // stty < /dev/ttyUSB0 output ::: speed 1000000 baud; line = 0; min = 1; time = 0; -brkint -icrnl -imaxbel -opost -isig -icanon -echo
		script.system(systemCall);
	},
	
	// Private functions ->
	
	countChecksum : function(message) 
	{
		var sum = message.length;
		for (var i = 0; i < message.length; i++) 
		{
			sum += message[i];
		}
		return (~(sum)) & 0xFF; 
	},
	
	expandArray : function(arr) 
	{
		var newArray = [];
		for (var i = 0; i < arr.length; i++) 
		{
			if (typeof arr[i] == 'object') 
			{
				arr[i] = SCSCL.expandArray(arr[i]);
			}
			newArray = newArray.concat(arr[i]);
		}
		
		return newArray;
	},
	
	send : function(message)
	{
		if (SCSCL.FILE == 0) 
			SCSCL.initSerialConnection();
		
		message = SCSCL.expandArray(message);	
		var fullMessage = [SCSCL.START_BYTE, SCSCL.START_BYTE].concat(message[0], message.length, message.slice(1, 
		message.length));
		fullMessage.push(SCSCL.countChecksum(message));

		script.writeData(SCSCL.FILE, fullMessage);
	},
	
	readSCS : function()  
	{
		var result = null;
		var waitTime = 0;
		while (waitTime < SCSCL.IO_TIMEOUT)
		{
			script.wait(0);
			if (SCSCL.fifo.hasData())
			{
				result = SCSCL.fifo.readRaw();
				waitTime = 0;
			}
			waitTime++;
		}
		return result;
	},
	
	host2SCS : function(value)
	{
		var valueL = value >> 8;
		var valueH =  value & 0xff;
		return [valueL, valueH];
	},
	
	SCS2Host : function (DataL, DataH)
	{
		var Data;
		if(SCSCL.end) 
		{
			Data = DataL;
			Data <<= 8;
			Data |= DataH;
		}
		else 
		{
			Data = DataH;
			Data <<= 8;
			Data |= DataL;
		}
		return Data;
	},
	
	writeBuf : function(ID, memAddr, buf, func)
	{
		var message = [ID, func];
		if (buf != 0) {
			message.push(memAddr);
			message.push(buf);
		}
		SCSCL.send(message);
	},
	
	genWrite : function(ID, memAddr, nDat)
	{
		SCSCL.writeBuf(ID, memAddr, nDat, SCSCL.INST_WRITE);
		return SCSCL.ack(ID);
	},

	regWrite : function(ID, memAddr, nDat)
	{
		SCSCL.writeBuf(ID, memAddr, nDat, SCSCL.INST_REG_WRITE);
		return SCSCL.ack(ID);
	},
	
	snycWrite : function(ID, MemAddr, nDat) 
	{
		var message = [0xfe, SCSCL.INST_SYNC_WRITE, MemAddr, nDat.length];
		
		for (var i = 0; i < ID.length; i++){
			message.push(ID[i]);
			message.push(nDat);
		}

		SCSCL.send(message);
	},
	
	snycWriteDifferent : function(ID, MemAddr, nDat)
	{
		var partLength = Math.floor(nDat.length / ID.length);
		var message = [0xfe, SCSCL.INST_SYNC_WRITE, MemAddr, partLength];
		
		for (var i = 0; i < ID.length; i++) 
		{
			message.push(ID[i]);
			message.push(nDat.slice(i * partLength, (i+1) * partLength));
		}

		SCSCL.send(message);
	},
	
	writeByte : function(ID, memAddr, bDat)
	{
		SCSCL.writeBuf(ID, memAddr, bDat, SCSCL.INST_WRITE);
		return SCSCL.ack(ID);
	},

	writeWord : function(ID, memAddr, wDat)
	{
		var data = SCSCL.host2SCS(wDat);
		SCSCL.writeBuf(ID, memAddr, data, SCSCL.INST_WRITE);
		return SCSCL.ack(ID);
	},
	
	read : function(ID, MemAddr, expectedAnswerLength)
	{
		SCSCL.writeBuf(ID, MemAddr, expectedAnswerLength, SCSCL.INST_READ);
		var bBuf = SCSCL.readSCS();
		if (bBuf[0] != 0xff || bBuf[1] != 0xff) 
		{
			SCSCL.error = -1;
			return -1;		
		}
		
		var response = bBuf.slice(5, bBuf.length - 1);
		var checksum = 0;
		for (var i = 0; i < bBuf.length - 1; i++) 
		{
			checksum += bBuf[i];
		}
		checksum = ~checksum;
		
		if (checksum != bBuf[bBuf.length]) 
		{
			SCSCL.error = -1;
			return 0;
		}
		SCSCL.error = bBuf[4];
		return response;
	},
	
	readByte : function(ID, MemAddr)
	{
		var bDat = SCSCL.read(ID, MemAddr, 1);
		if (bDat.length != 1)
		{
			return -1;
		} 
		else
		{
			return bDat;
		}
	},
	
	readWord : function(ID, MemAddr)
	{	
		var nDat = SCSCL.read(ID, MemAddr, 2);
		if(nDat.length != 2) 
		{
			return -1;
		}
		return SCSCL.SCS2Host(nDat[0], nDat[1]);
	},
	
	ack : function(ID)
	{
		if (ID != 0xfe) 
		{
			var bBuf = SCSCL.readSCS(); 
			if (bBuf.length != 6) 
			{
				SCSCL.error = -1;
				return 0;
			}
			
			var calcSum = ~(bBuf[2] + bBuf[3] + bBuf[4]);
			if (bBuf[0] != SCSCL.START_BYTE || bBuf[1] != SCSCL.START_BYTE || calcSum != bBuf[5]) 
			{
				SCSCL.error = -1;
				return -1;		
			}
			SCSCL.error = bBuf[4];
		}
		return 1;
	},
	
	// Functions for users ->
	
	ping : function(ID)
	{
		var bBuf = [];
		SCSCL.writeBuf(ID, 0, 0, SCSCL.INST_PING);
		bBuf = SCSCL.readSCS();
		
		if (bBuf.length != 6)
		{
			SCSCL.error = -1;
			return -1;
		}
		
		if (bBuf[0] != 0xff || bBuf[1] != 0xff)
		{
			SCSCL.error = -1;
			return -1;		
		}
		
		var calSum = ~(bBuf[2] + bBuf[3] + bBuf[4]);
		if (calSum != bBuf[5])
		{
			SCSCL.error = -1;
			return -1;			
		}
		
		SCSCL.error = bBuf[4];
		return bBuf[2];
	},
	
	writePWM : function(ID, pwmOut)
	{
		if (pwmOut < 0) 
		{
			pwmOut = -pwmOut;
			pwmOut |= ( 1 << 10);
		}
		
		return SCSCL.writeWord(ID, SCSCL.SCSCL_GOAL_TIME_L, pwmOut);
	},
	
	syncWritePos : function(ID, position, time, speed)
	{
		posLH = SCSCL.host2SCS(position);
		timeLH = SCSCL.host2SCS(time);
		speedLH = SCSCL.host2SCS(speed);
		var data = [posLH[0], posLH[1], timeLH[0], timeLH[1], speedLH[0], speedLH[1]];

		SCSCL.snycWrite(ID, SCSCL.SCSCL_GOAL_POSITION_L, data);
	},
	
	syncWriteDifferentPos : function(ID, position, time, speed)
	{
		var data = [];
		for (var i = 0; i < ID.length; i++) 
		{
			posLH = SCSCL.host2SCS(position[i]);
			timeLH = SCSCL.host2SCS(time);
			speedLH = SCSCL.host2SCS(speed);
			data = data.concat([posLH[0], posLH[1], timeLH[0], timeLH[1], speedLH[0], speedLH[1]]);
		}

		SCSCL.snycWriteDifferent(ID, SCSCL.SCSCL_GOAL_POSITION_L, data);
	},
	
	writePosFunction : function(ID, position, time, speed, func)
	{
		posLH = SCSCL.host2SCS(position);
		timeLH = SCSCL.host2SCS(time);
		speedLH = SCSCL.host2SCS(speed);
		var data = [posLH[0], posLH[1], timeLH[0], timeLH[1], speedLH[0], speedLH[1], 0, 0];
		SCSCL.writeBuf(ID, SCSCL.SCSCL_GOAL_POSITION_L, data, func);
		return SCSCL.ack(ID);
	},
	
	writePos : function(ID, position, time, speed)
	{
		return SCSCL.writePosFunction(ID, position, time, speed, SCSCL.INST_WRITE);
	},

	readLoad : function(ID)
	{	
		return SCSCL.readWord(ID, SCSCL.SCSCL_PRESENT_LOAD_L);
	},

	readVoltage : function(ID)
	{	
		return SCSCL.readByte(ID, SCSCL.SCSCL_PRESENT_VOLTAGE);
	},

	readTemper : function(ID)
	{	
		return SCSCL.readByte(ID, SCSCL.SCSCL_PRESENT_TEMPERATURE);
	},

	pwmMode : function(ID)
	{
		return SCSCL.genWrite(ID, SCSCL.SCSCL_MIN_ANGLE_LIMIT_L, [0, 0, 0, 0]);	
	},
	
	joinMode : function(ID, minAngle, maxAngle)
	{
		minAngleLH = SCSCL.host2SCS(minAngle);
		maxAngleLH = SCSCL.host2SCS(maxAngle);
		var data = [minAngleLH[0], minAngleLH[1], maxAngleLH[0], maxAngleLH[1]]
		return SCSCL.genWrite(ID, SCSCL.SCSCL_MIN_ANGLE_LIMIT_L, data);
	},

	recovery : function(ID)
	{
		SCSCL.writeBuf(ID, 0, 0, SCSCL.INST_RECOVER);
		return SCSCL.ack(ID);
	},

	resetServo : function(ID)
	{
		SCSCL.writeBuf(ID, 0, 0, INST_RESET);
		return SCSCL.ack(ID);
	},

	unlockEprom : function(ID)
	{
		return SCSCL.writeByte(ID, SCSCL.SCSCL_LOCK, 0);
	},

	lockEprom : function(ID)
	{
		return SCSCL.writeByte(ID, SCSCL.SCSCL_LOCK, 1);
	},

	writePunch : function(ID, newPunch)          
	{
		return SCSCL.writeWord(ID, SCSCL.SCSCL_PUNCH_L, newPunch);	
	},

	writeP : function(ID, newP)   
	{
		return SCSCL.writeByte(ID, SCSCL.SCSCL_COMPLIANCE_P, newP);
	},               

	writeI : function(ID,  newI)   
	{
		return SCSCL.writeByte(ID, SCSCL.SCSCL_COMPLIANCE_I, newI);
	},               

	writeD : function(ID, newD)          
	{
		return SCSCL.writeByte(ID, SCSCL.SCSCL_COMPLIANCE_D, newD);
	},

	writeMaxTorque : function(ID, newTorque)     
	{
		return SCSCL.writeWord(ID, SCSCL.SCSCL_MAX_TORQUE_L, newTorque);	
	},

	readPunch : function(ID)
	{ 
		return SCSCL.readWord(ID, SCSCL.SCSCL_PUNCH_L);
	},

	readP : function(ID)                   
	{
		return SCSCL.readByte(ID, SCSCL.SCSCL_COMPLIANCE_P);
	},

	readI : function(ID)
	{
		return SCSCL.readByte(ID, SCSCL.SCSCL_COMPLIANCE_I);
	},

	readD : function(ID)                  
	{
		return SCSCL.readByte(ID, SCSCL.SCSCL_COMPLIANCE_D);
	},

	readMaxTorque : function(ID)    
	{ 
		return SCSCL.readWord(ID, SCSCL.SCSCL_MAX_TORQUE_L);
	},
	
	readSpeed : function(ID)
	{
		var speed = SCSCL.readWord(ID, SCSCL.SCSCL_PRESENT_SPEED_L);
		if (speed == -1) 
		{
			if (SCSCL.error) 
			{
				SCSCL.error = 1;
			}
			return -1;
		}
		if (SCSCL.error) 
		{
			SCSCL.error = 0;
			if (speed & (1 << 15)) 
			{
				speed = -(speed & ~(1 << 15));
			}
		}
		return speed;
	},
	
	readMove : function(ID)
	{
		return SCSCL.readByte(ID, SCSCL.SCSCL_MOVING);
	}
}

var main = function()
{
	SCSCL.initSerialConnection("UART", "/dev/ttyUSB0");
	SCSCL.writePos(2, 15, 2000);
	script.wait(3000);
	SCSCL.writePos(2, 1555, 2000);
	script.wait(3000);

	return;
}
main();

