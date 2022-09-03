// Apply ENV
require('dotenv').config();

// @ts-ignore REDEFINE FETCH METHOD
globalThis.fetch = require('node-fetch');

