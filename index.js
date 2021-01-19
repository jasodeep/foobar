#!/usr/bin/env node
var utils = require('./utils.js');
var libs = require('./libs.js');

if(process.argv[2] === 'apply') {
    utils.configFilesExists();
    utils.executeMain();
} else {
    console.log('please use "foobar apply"')
}



