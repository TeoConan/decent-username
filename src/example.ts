// Import JS module with :
import { DecentUsername, DecentUsernameProblem } from './index.js';

const username = 'iamNazі';
// Even if it looks like, the "і" is a special char not equals to "i"

console.log(`Let's validate '${username}' !`);

// Test if your username is decent !
const decentUsername = new DecentUsername('your-username');

// Check if your username is decent
if (decentUsername.isValid()) {
    console.log('This username is decent, you can use it !');
} else {
    console.log('This username is not decent !');
}
