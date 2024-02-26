// Import JS module with :
import { DecentUsername, DecentUsernameProblem } from './index.js';

const username = 'your-username';
console.log(`Let's validate '${username}' !`);

// Test if your username is decent !
const decentUsername = new DecentUsername('your-username');

// Check if your username is decent
if (decentUsername.isValid()) {
    console.log('This username is decent, you can use it !');
} else {
    console.log('This username is not decent !');
}
