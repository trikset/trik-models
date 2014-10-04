Small program written as an example of using TrikControl library from C++ code.
Supposed to show current gyroscope readings on robot display.
To compile it needs sources of trikRuntime located in a directory pointed by TRIKRUNTIME_SOURCES_PATH variable in .pro file,
and binaries for trikControl and trikKernel libraries in a directory pointed by TRIKRUNTIME_PATH.

To build it first build trikRuntime, then adjust cppExample.pro so that it can use built libraries, then build
it. To run, make sure that config.xml and "media" folder for trikControl is in a directory with binary.

Note that event loop is needed for asynchronous sensors to work correctly, so preferred way to write C++ programs
is to use event driven method. Here we set up a timer and call gyroscope reading code from a slot connected 
to "timeout()" signal.
