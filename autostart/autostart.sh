#/bin/sh

# Replaces trikGui with some other frontend. Can be useful when creating reusable constant-time models
# Fill in pathes to programs to auto-start:
NATIVE_PROGRAM_NAME=
NATIVE_PROGRAM_ARGS=
JAVA_SCRIPT_NAME="/home/trik/scripts/remoteControl.js"
JAVA_PROGRAM_NAME="/home/root/myCoolJavaProgram.java"

######################################################################################################
function startProgram
{
	PROCESS_NAME=$1
	START_COMMAND=$2
	if [ -n $PROCESS_NAME ] && ! ps | grep -v grep | grep $PROCESS_NAME >dev/null
	then
		bash -c "$START_COMMAND"
	fi
}

# Killing gui if it still works
chmod -x /etc/trik/trikGui.sh
killall -q -9 trikGui

# Selecting possible path to trikRuntime
TRIK_RUN_PATH1=/home/root/trik/trikRun
TRIK_RUN_PATH2=/etc/trik/trikRun
TRIK_RUN_PATH=
if [ -e $PATH1 ]
then
	TRIK_RUN_PATH=TRIK_RUN_PATH1
else
	TRIK_RUN_PATH=TRIK_RUN_PATH2
fi

cd $(dirname $TRIK_RUN_PATH)

# And then simply starting everything that possible

startProgram $NATIVE_PROGRAM_NAME "$NATIVE_PROGRAM_NAME $NATIVE_PROGRAM_ARGS"
startProgram "trikRun" "./trikRun -qws $JAVA_SCRIPT_NAME"
startProgram "java" "java $JAVA_PROGRAM_NAME"
######################################################################################################
