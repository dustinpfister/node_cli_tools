# node_cli_tools

This project aims to be a collection of node.js powered CLI tool examples that are all part of a single package. The idea here is that everything is in a single bin folder in the main folder of the project, and each command in the bin folder can be used as a stand alone CLI tool, but they are all tools that are used for a common formated project folder that is created and maintained with these tools.

This serves as code examples for posts on my website on node cli tools, as I would like to write a few posts on this subject. However I would also like to make some actual useful tools that might help me when it comes to creating a project folder for a website because I would like to create and maintain additional websites.

## 1 - Setup

I do not intend to publish to npm at this time so the project will have to be cloned down and then install the project globally.

```
$ git clone --depth 1 https://github.com/dustinpfister/node_cli_tools
$ cd node_cli_tools
$ npm install -g
```

## 2 - NPM packages used

This project contains a lot of vanilla js code, but I am also making use of some npm packages to help make quick work of certain things that I do not want to create and maintain by myself.

### 2.1 - Yargs

The npm package yargs is used for option parsing.

## 3 - TheCommands

These are the commands that this project provides.

### 3.1 - nc-init

Initialize a new project folder. This command will create a new standard project folder that is used for this over all project. This will be a posts, and themes folders as well as a config file.

### 3.2 - nc-walk

This is just a basic file system walker. The walker can be used by itself by calling the command and pass arguments for the root path to walk, and a path to a script that will be called for each file found in a target path.

### 3.3 - nc-ssg

A simple static site generator for this project. When called in a project folder that was created using the nc-init command it will create a public folder using the content in the posts folder and the theme.

### 3.4 - nc-edit

A text editor.
