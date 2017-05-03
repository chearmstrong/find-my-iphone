'use strict';

const alexa = require('alexa-app');
const icloud = require('find-my-iphone').findmyphone;
const _ = require('underscore');
const app = new alexa.app();

icloud.apple_id = process.env.ICLOUD_LOGIN;
icloud.password = process.env.ICLOUD_PASSWORD;

const homeLatLong = process.env.HOME_LAT_LONG.split(',');
const deviceName = process.env.DEVICE_NAME;

app.launch((request, response) => {

	icloud.getDevices((err, devices) => {

		let device;

		if (err) {
			response.say(err.message || err).send();
			return;
		}

		device = _.filter(devices, d => {
			return d.name === deviceName;
		});

		if (device.length === 1) {

			icloud.getDistanceOfDevice(device, homeLatLong[0], homeLatLong[1], (err, result) => {

				let distance = result.distance.text;
				let phone = device[0].modelDisplayName;
				let location = {
					lat: device[0].latitude,
					long: device[0].longitude

				}

				if (err) {
					response.say(err.message || err).send();
					return;
				}

				icloud.alertDevice(device[0].id, err => {

					if (err) {
						response.say(err.message || err).send();
						return;
					}

					response.say(`your ${phone} is ${distance} away from home. i've triggered an alert for you.`);

				});

			});

		}

	});

	// because this is an async handler
	return false;
});

// connect to lambda
exports.handler = app.lambda();