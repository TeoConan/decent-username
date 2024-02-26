import { DecentUsername, DecentUsernameProblem } from './index.js';
import tests from './ressources/testsUsername.json' assert { type: 'json' };

import logSymbols from 'log-symbols';
import chalk from 'chalk';

/**
 * Class to test a long list of username, to try every possibilities
 */

console.log(chalk.bold('Tests'));
console.log('');

let errorCounter = 0;
// Record execution time
const start = new Date().getTime();

for (const username of tests) {
    const du = new DecentUsername(username);
    du.validate();

    if (!du.isValid()) {
        const highlight = chalk.red(chalk.underline(du.violationText));
        console.log(
            `${logSymbols.warning} ${highlight} (${DecentUsernameProblem[du.problemType]})`
        );

        errorCounter++;
    } else {
        console.log(`${logSymbols.success} ${du.get()}`);
    }
}

// Get in second the execution time
const elapsed = (new Date().getTime() - start) / 1000;
const timePerHit = elapsed / tests.length;
let strTimePerHit = timePerHit.toString();

let color = chalk.green;
let icon = logSymbols.success;

if (timePerHit > 0.0001) {
    color = chalk.red;
    icon = logSymbols.warning;

    if (strTimePerHit.length < 8)
        strTimePerHit = strTimePerHit.slice(0, strTimePerHit.length);
    else strTimePerHit = strTimePerHit.slice(0, 8);
}

console.log('');
console.log(
    logSymbols.error,
    chalk.red(
        'Non decent usernames found : ' + errorCounter + '/' + tests.length
    )
);
console.log(icon, color('Time spent : ' + elapsed + 's'));
console.log(icon, color('Time spent per hit : ' + strTimePerHit));
console.log('');
