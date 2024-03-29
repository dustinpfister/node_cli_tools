# Roadmap / Outline for the node_cli_tools project

Okay so I am going to try this simple list style roadmap as a way to outline what needs to happen with this project. I will also use it is a place to write other notes related to the how the project is designed.

## 1 - bin folder

In this section I am outlining a standard format by which each command should be designed.

### 1.1 - /bin/[commandName]

Each command has a folder in the bin folder
 
### 1.2 - /bin/[commandName]/index.js

Each nc-[commandName] command has an index.js file in the commandName folder. This is the script that will be called to start the command, and as such it is what the package.json file points to in the bin key of the package.json file. It also has the nodejs shebang at the top of the file as well. The file uses yargs to load commands from the command folder of the commandName folder, and that folder should have at least a default.js file.
 
### 1.3 - /bin/[commandName]/commands

Here there should be at least a default.js file that outlines the options and handler of the default command of the nc-commandName cli tool.
 
### 1.4 - /bin/[commandName]/lib

This is a local lib folder for the command. If the lib is just used by the local commandName it should go here, otherwise it might be better to place it in the lib folder of the shared folder.

## 2 - shared folder

The shared folder is for shared resources accross commands. A place to park things that will be used by more than one command, but is not published to npm. This can contain bolth front end, and nodejs resources.

### 2.1 - /shared/public

The shard public folder is for shared resoucse that are inteend to be used in the front end, or anything where it might be okay for it to be accessabule from a public url.

### 2.2 - /shared/lib

This is a a shared lib folder for nodejs modules that are used for two or more commands. If it is closly related to a single command then it should be part of that commands local lib folder.


## 3 - The Commands Roadmap

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
* make hexer.js a shared lib
* hexer.js has one or more simple keyless obfustication options
* hexer.js has a general createCipheriv option where a single key, salt ect is used for each line
* advanced createCipheriv method for uisng custom key, salt, and iv for each line

### nc-init

* (done) default command working
* (done) make a standard commands and lib folders for nc-init
* (done) add a force option for the default command for nc-init
* (done) when writing the demo-post to the target folder append the current data as the date and updated fields for the header of the post.
* (done) generate a /themes/core folder for the core theme
* (done) core theme needs a layout folder
* (done) core theme should have a home layout
* (done) core theme should have a post layout
* (done) add a source folder for the core theme
* (done) have a css folder in the core theme folder with a styles.css file
* (done) The core theme has a default font other than browser default set in styles.css.
* (done) The core theme has a main wrap container div
* (done) The core theme has a header for each page
* (done) some basic style for each container

* generate a /conf.yaml file
* conf.yaml title property
* conf.yaml blog.postsPerPage property
* conf.yaml blog.dir_blog property default: 'blog' (/blog/2017/02/04/first-post/index.html)
* conf.yaml blog.dir_page property default: 'page' (/blog/page/2/index.html)
* conf.yaml blog.genBread property default: true (will generate index.html files for each dir)
* conf.yaml blog.genCats property default: true (generate catagory pages)
* conf.yaml blog.genTags property default: true (generate tag pages)
* conf.yaml blog.index.posts default: true (index meta tags for blog posts only, no-follow for others)
* conf.yaml blog.index.pages default: false
* conf.yaml blog.index.bread default: false
* conf.yaml blog.index.cats default: false
* conf.yaml blog.index.tags default: false
* conf.yaml theme property
* conf.yaml sitemap property
* generate /.gitignore file for the site folder
* make the site folder a git folder
* make a first commit

### nc-sspub

* (done) Serve Static PUBlic command. This just starts a simple static web server for the public folder.
* (done) can set the port number via -p option
* (done) can set the folder location via -t option
* (done) using express.static for _public folder

### nc-ssg

* (done) Static Site Generator command
* (done) new default command started
* (done) new gen command started
* (done) The /bin/lib/walk.js file should be used as a normal nodejs lib and not a command via the child_process module
* (done) nc-ssg should make use of a theme folder in the project folder
* (done) create a main render higher order function that is used in gen.js, and passed from gen.js to any additional assets that render html files.
* (done) use new render method to render blog posts
* (done) nc-ssg should create a main index.js file
* (done) render posts in the _public folder following a /yyyy/mm/dd/[postFileName]/index.html pattren
* (done) generate a posts object that is passed as as a local for the ejs templates
* (done) render pages for posts following a pattern.
* (done) page files should be created in a /page/[pageNumber] url pattern
* (done) built in helper methods for the locals ejs template object
* (done) have a genPostHTML theme helepr, and others
* (done) copy over source folder from theme to _public folder

* have a system where you can have just the first few lines of text for use in blog pages, and the home page (ex: <!-- more -->, or a method that grabs the first 100 words of a post and appends ... more link).

* helpers should be pulled out of the object for posts only and into a common object that is used in all pages.
* try to work out an object standard for everything that has to do with generating pages, and make the generator itself sumething that loads one or more of these objects. call these objects something like a 'component'

Something like this maybe.
```
// component
let blogComponent = {
  
  // what to do during the buildLocals object phase
  // return a Promise
  buildLocals: (conf, locals) => {
     // use data in conf to help create
     // something that is appended to locals
     return PromiseMethod();
  },
  
  // build pages by returning one instance of render
  // of a Promise.all of renders
  build: (conf, locals, render) => {
    return Promise.all(locals.posts.map((post)=>{
      return render({
        path: '/blog' + post.dir_post, 
        layout: 'post'
      });
    }));
  }
  
}
```

* cat pages
* tag pages
* Generate /blog/index.html that can be used to link to /page/1/index.html, cats/[catName]/page/1/html for all cats, as well as /blog/[yyyy]/index.html for all years, and the same for tag pages
* see if I can fix the isshue with copyDir causing anything that comes after it to stop when I change the code to return a promise
* read conf.yaml and use pagesPerPost value.



### nc-walk

* (done) basic idea of nc-walk working
* (done) walk.js should have a more clearly defined public api rather than just exporting one method
* (done) leave the main function as is, but add some public keys to the function that are to be used by other commands such as nc-ssg extending a new public api while not breaking older code.
* (done) make walk.js the first lib in the shard lib folder
* the walk.js walk methods onDone option is problamatic when walking recursively, but this can be fixed if I can find a way to fire onDone when recursive walking really is done
* the walk.js walk method should return a promise, and this should work as a good alterative to the onDone option
