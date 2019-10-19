# node_cli_tools

This project aims to be a collection of node.js powered CLI tool examples that are all part of a single package. The idea here is that everything is in a single bin folder, and each project can be used as a stand alone CLI tool, or as a resource of another tool in the collection.

This serves as code example for posts on my website, as I would like to write a few posts on this subject. However I would also like to make some actual useful tools that might help me when it comes to creating a project folder for a site.

## nc-init

Initialize a new project folder.

## nc-walk command

This is just a basic file system walker. The walker can be used by itself by calling the command and pass arguments for the root path to walk, and a path to a script that will be called for each file found in a target path. It can also be used in the same way from another script.
