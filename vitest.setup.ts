import fetch from 'node-fetch'

// @ts-ignore REDEFINE FETCH METHOD
globalThis.fetch = fetch;