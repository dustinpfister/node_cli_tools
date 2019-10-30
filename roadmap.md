# roadmap for node_cli_tools

Okay so I am going to try this simple list style roadmap as a way to outline what needs to happen with this project.

## bin folder

In this section I am outlining a standard format by which each command should be designed.

### /bin/[commandName]

Each command has a folder in the bin folder
 
### /bin/[commandName]/index.js

Each nc-[commandName] command has an index.js file in the commandName folder. This is the script that will be called to start the command, and as such it is what the package.json file points to in the bin key of the package.json file. It also has the nodejs shebang at the top of the file as well. The file uses yargs to load commands from the command folder of the commandName folder, and that folder should have at least a default.js file.
 
### /bin/[commandName]/commands

Here there should be at least a default.js file that outlines the options and handler of the default command of the nc-commandName cli tool.
 
### /bin/[commandName]/lib

This is a local lib folder for the command. If the lib is just used by the local commandName it should go here, otherwise it might be better to place it in the lib folder of the shared folder.

## shared folder

* (done) start new shared folder
* (done) have a shared public folder for any assests that are to be used as a public asset in client systems and any site builds (front end js, css, images, ect) to be used with two or more commands.
* shared lib folder for libs that are used by two or more commands, but are not published to npm.

## commands

This is what needs to be done for each command in the /bin folder

### nc-commit

* start new nc-commit command that commits changes to the site folder

#### post

* start new nc-commit-post command that is to be called each time a new post is to be saved
* makes a git commit for the site_folder each time a change is made to the site_folder state
* commit messages follow a pattern c-post:[pid]:[rn]:[uid] where pid is the id of the post, rn is revision number of the post, and uid is a user id number that edited the content

#### theme

* start new nc-commit-theme command that is the theme counterpart of nc-commit-post

#### phaser

* start new nc-commit-phaser command that is the phaser game counterpart of nc-command-post

#### three

* start new nc-commit-three command that is the threejs counterpart of nc-command-post

### nc-edit

* (done) simple default command working
* (done) files can be saved as any text format

### nc-hexer

* (done) new hexer.js lib that can be used to convert text to a hex format and back
* (done) default command working
* (done) hexer.js should be in a lib folder local or shared

### nc-init

* (done) default command working
* generate .gitignore file for the site folder
* make the site folder a git folder
* make a first commit

### nc-ssg

* (done) new default command started
* (done) new gen command started
* The /bin/lib/walk.js file should be used as a normal nodejs lib and not a command via the child_process module

### nc-walk

* (done) basic idea of nc-walk working
* (done) walk.js should have a more clearly defined public api rather than just exporting one method
* (done) leave the main function as is, but add some public keys to the function that are to be used by other commands such as nc-ssg extending a new public api while not breaking older code.
