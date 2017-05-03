'use strict';

const alexa = require('alexa-app');
const icloud = require('find-my-iphone').findmyphone;
const _ = require('underscore');
const nodemailer = require('nodemailer');
const app = new alexa.app();
const credentials = {
	login: 'neuroscience.che@gmail.com',
	password: 'Digweed81',
	device: 'Che'
};

icloud.apple_id = credentials.login;
icloud.password = credentials.password;

icloud.getDevices((err, devices) => {

	let device;

	if (err) {
		console.log(err);
		return;
	}

	device = _.filter(devices, d => {
		return d.name === credentials.device;
	});

	if (device) {

		// icloud.alertDevice(device[0].id, err => {
		// 	console.log('beep');
		// });

		let myLatitude = 51.5033640;
		let myLongitude = -0.1276250;

		icloud.getDistanceOfDevice(device[0], myLatitude, myLongitude, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}

			console.log("distance: " + result.distance.text);
		});

	}

});