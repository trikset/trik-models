var __interpretation_started_timestamp__;
var pi = 3.141592653589793;

var main = function()
{
	mailbox.connect("192.168.1.113", 1234)
	print("start")
	script.wait(1000)
	mailbox.send("Hello World(1)!!")
	mailbox.send("My message")
	script.wait(1000)
	mailbox.send("Hello World(2)!!")
	script.wait(3000)
	mailbox.send("Hello World(keyword)!!")
	msg = mailbox.receive(true);
	print(msg)
	print("end")
}

