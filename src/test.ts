import { DecentUsername, DecentUsernameProblem } from './index.js';
import testUsernames from './ressources/testsUsername.json' assert { type: 'json' };

import logSymbols from 'log-symbols';
import chalk from 'chalk';

const tests = [
    '"tropppe`="',
    '"asser`="',
    '"assssswer`="',
    '"access$^ù`="',
    '"access$^`="',
    'teo"',
    'tropp"',
    '"',
    'asspicture',
    'pornpony',
    'hitler3302',
    'hitleer3302',
    'hitl3r3302',
    'settings',
    'account',
    'butterorgasm',
    //...testUsernames,
];

var testsPassedCounter = 0;

console.log('');
console.log('');
console.log(chalk.bold('\t\tTests'));
console.log('');
console.log('');

const start = new Date().getTime();

for (const username of tests) {
    const du = new DecentUsername(username);
    du.validate();

    if (!du.isValid()) {
        console.log(
            logSymbols.warning,
            chalk.yellow(
                username +
                    ' is not valid (' +
                    DecentUsernameProblem[du.problemType] +
                    ')'
            )
        );

        continue;
    }

    testsPassedCounter++;
}

let elapsed = (new Date().getTime() - start) / 1000;

console.log(
    logSymbols.success,
    chalk.bold('Tests passed : ' + testsPassedCounter + '/' + tests.length)
);

const timePerHit = elapsed / tests.length;
let color = chalk.green;
let icon = logSymbols.success;

if (timePerHit > 0.0005) {
    color = chalk.red;
    icon = logSymbols.warning;
}

console.log('');
console.log(icon, color('Time spent : ' + elapsed + 'ms'));
console.log(icon, color('Time spent per hit : ' + timePerHit));
