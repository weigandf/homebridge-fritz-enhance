"use strict";

// The plugin identifier must match the npm package name, otherwise Homebridge
// cannot assign registered accessories to this plugin.
const PLUGIN_NAME = require('../package.json').name;
const PLATFORM_NAME = 'FRITZ!Box';

module.exports = { PLUGIN_NAME, PLATFORM_NAME };
