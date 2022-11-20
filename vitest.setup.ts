// Apply ENV
require('dotenv').config();

// Redefine*
globalThis.fetch = require('node-fetch');

// Initiate DB clients
import Supabase from '~/plugins/Supabase'; Supabase();
import Firebase from '~/plugins/Firebase'; Firebase();