# copy-older-than

Node.js script that copies files from given source directory to a given destination directory while filtering out files newer than the given date.

To use it you must first install Node.js: https://nodejs.org/en/download/

## Usage:

First make sure you know the path of your source and have an already created destination directory.
Paths must be in absolute form (e.g on Windows "C:\path\to\source", or "/path/to/source" on Linux/Mac OSX)



### On Windows:

When you open "run-windows.bat" in a text editor (e.g notepad on Windows) you will see this:
```
node copyOlderThan.js C:\path\to\source\directory C:\path\to\destination\directory 2020-12-30
pause
```

### On Linux / Mac OS X:

When you open "run-linux-mac-osx.sh" in a text editor you will see this:
```
#!/usr/bin/env bash
node copyOlderThan.js /absolute/path/to/source/directory /absolute/path/to/destination/directory 2020-12-30
pause
```

### Editing the arguments

To edit your arguments, edit the space-separated lines of text (arguments) after "node copyOlderThan.js".
The first argument after "node copyOlderThan.js" is the source directory.
The second argument is the destination directory (note: you must already have a destination directory created, these will not be created for you).
The third argument is the latest allowed date. If you want to specify by hour or minutes, you can further specify it in the format: 2020-12-30T00:00


The script saves the list of files it copied along with the date when it was copied in "log.txt" under the same directory it was called from.

The script copies all directories and files from the source directory to the destination directory according to the given arguments.
It does not overwrite files or folders if they already exist under the destination directory.


## Testing:

This has so far been tested on Windows and Ubuntu. Mac OS X compatibility is assumed as everything works on Ubuntu.
