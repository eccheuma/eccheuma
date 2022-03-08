// ENV
require('dotenv').config();

// AUTH
import { form } from '~/api/auth';

// TEST USER
if ( !process.env.TEST_USER_EMAIL && !process.env.TEST_USER_PASS ) throw new Error('ENV is not defined...');

const email: form.email = process.env.TEST_USER_EMAIL as form.email;
const password: string = process.env.TEST_USER_PASS!;

export const userForm: form.registration = { 
	email			: email, 
	password	: password, 
	name			: 'Vitest' 
};