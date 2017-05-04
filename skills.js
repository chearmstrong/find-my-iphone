// This file generates the intents and utterances for your Alexa skill
// run 'npm run skill' to generate these and have them logged to the console
// You won't need to add this file to AWS Lambda

'use strict';

const skill = require('./index');

console.log('SCHEMA: ');
console.log(skill.schema());

console.log('UTTERANCES: ');
console.log(skill.utterances());