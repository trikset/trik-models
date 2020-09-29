var __interpretation_started_timestamp__;
var pi = 3.141592653589793;

var main = function()
{
	mailbox.connect("192.168.1.113", 1234)
	script.wait(1000)
	mailbox.send("Hello World(1)!!")
	script.wait(1000)
	mailbox.send("Hello World(2)!!")
	script.wait(1000)
	mailbox.send("Hello World(3)!!")
	print("start")
	message = mailbox.receive(true);
	print("Got:" + message);
	print("end")
	
}

