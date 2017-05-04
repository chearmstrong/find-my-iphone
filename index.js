'use strict';

const alexa = require('alexa-app');
const _ = require('underscore');
const Promise = require('bluebird');
const icloud = Promise.promisifyAll(require('find-my-iphone').findmyphone);
const app = new alexa.app();

icloud.apple_id = process.env.ICLOUD_LOGIN || null; // me@icloud.com
icloud.password = process.env.ICLOUD_PASSWORD || null; // P@55w0rd

const homeLatLong = process.env.HOME_LAT_LONG ? process.env.HOME_LAT_LONG.split(',') : null; // 51.5033640,-0.1276250
const deviceName = process.env.DEVICE_NAME || null; // Che


app.intent('number', {
	'slots': {},
	'utterances': [
		'{alert|find} my {phone|iphone|device}',
		'where my {phone|iphone|device} is'
	]
}, (request, response) => {

	let device;
	let distance;
	let phone;
	let location;

	return icloud.getDevicesAsync()
		.then(devices => {
			let filteredDevice = _.filter(devices, d => {
				return d.name === deviceName;
			});
			device = filteredDevice[0]; // only want first one - should be one
			phone = device.modelDisplayName;
			location = {
				lat: device.latitude,
				long: device.longitude
			};
			return icloud.getDistanceOfDeviceAsync(device, homeLatLong[0], homeLatLong[1]);
		})
		.then(result => {
			distance = result.distance.text;
			return icloud.alertDeviceAsync(device.id);
		})
		.then(() => {
			return response.say(`your ${phone} is ${distance} away from home. i've triggered an alert for you.`).send();
		})
		.catch(err => {
			return response.say(err.message || err).send();
		});
});

// connect to lambda
exports.handler = app.lambda();

module.exports = app;