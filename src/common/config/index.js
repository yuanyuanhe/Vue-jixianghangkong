
'use strict';
let config;

if (process.env.NODE_ENV === 'development') {
	config = require('./device/device.dev');
}
if (process.env.NODE_ENV === 'production') {
	config = require('./device/device.prod');
}
module.exports = config;