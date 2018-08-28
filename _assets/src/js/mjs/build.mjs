#!/usr/bin/env node
/* global document:true, window:true */
import fs from 'fs';
import path from 'path';
import jsdom from 'jsdom';
// var module = {}
// module.exports = {}
var document = jsdom.jsdom();
var window = document.defaultView;
// var global = {}
var global = {'hm': 'sdfsdf'}
// this = {'well': 'no'}
// global.document = document;
// global.window = window;
// console.log(global.document);
// global.window = window;
// global.document = document;

import $ from 'jquery';

// console.log(global.document);

console.log($)
console.log($.fn)
