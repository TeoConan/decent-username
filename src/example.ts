// Import JS module with :
import { DecentUsername, DecentUsernameProblem } from './index.js';

const username = 'iamnâZｉｉｉt';
// Even if it looks like, the "ｉ" is a special char not equals to "i"

console.log(`Let's validate '${username}' !`);

// Test if your username is decent !
const decentUsername = new DecentUsername(username);
// Validate it in a second time, if you want to change somes settings
decentUsername.validate();

// Check if your username is decent
if (decentUsername.isValid()) {
    console.log('This username is decent, you can use it !');
} else {
    console.log('This username is not decent !');

    switch (decentUsername.problemType) {
        case DecentUsernameProblem.Banned:
            console.log('This username is banned');
            break;
        case DecentUsernameProblem.MaxLengthViolation:
            console.log('This username is too long');
            break;
        case DecentUsernameProblem.MinLengthViolation:
            console.log('This username is too short');
            break;
        case DecentUsernameProblem.Reserved:
            console.log('This username is reserved by system');
            break;
        case DecentUsernameProblem.Undefined:
            console.log('This username has not been validated yet');
            break;
    }
}
