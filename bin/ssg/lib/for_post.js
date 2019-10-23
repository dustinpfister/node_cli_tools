let fs = require('fs'),
marked = require('marked');

module.exports = (item, next) => {

    console.log(item);

    next();

};
