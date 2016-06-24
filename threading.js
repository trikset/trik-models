var count;

var task1 = function()
{
	for (var i = 0; i < count; ++i) {
		print("1: " + i + "; " + Threading.activeThreadCount() + " / " + Threading.maxThreadCount());
	}
}

var task2 = function()
{
	for (var i = 0; i < count; ++i) {
		print("2: " + i + "; " + Threading.activeThreadCount() + " / " + Threading.maxThreadCount());
	}
}

var main = function()
{
	count = 100;
	Threading.start("task1");
	Threading.start("task2");
	for (var i = 0; i < count; ++i) {
		print("3: " + i + "; " + Threading.activeThreadCount() + " / " + Threading.maxThreadCount());
	}
}
