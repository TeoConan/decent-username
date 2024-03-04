import { DecentUsername, DecentUsernameProblem } from './index.js';
import terminalKit from 'terminal-kit';
const { terminal } = terminalKit;
import fs from 'fs';
import path from 'node:path';
import testUsernames from './ressources/testsUsername.json' assert { type: 'json' };
import testExtended from './ressources/testsUsernameExtended.json' assert { type: 'json' };

terminal.cyan('The hall is spacious. Someone lighted few chandeliers.\n');
terminal.cyan('There are doorways south and west.\n');

var items = ['Valid', 'Banned', 'Previous', 'Save', 'Exit'];

class Item {
    name: string;
    index: number;
    value: DecentUsernameProblem;
    output: DecentUsernameProblem;

    constructor(
        name: string,
        index: number,
        value: DecentUsernameProblem,
        ouput: DecentUsernameProblem
    ) {
        this.name = name;
        this.index = index;
        this.value = value;
        this.output = ouput;
    }
}

const tests = [...testUsernames, ...testExtended];

const output: Item[] = [];

ask(tests[0], 0);

function getCorrelation() {
    if (output.length == 0) return 0;

    let matches = 0;
    for (const i of output) {
        if (i.value == i.output) {
            matches++;
        }
    }
    return (matches / output.length) * 100;
}

function save(): void {
    const filePath = path.join(process.cwd(), 'decent_username_export.json');

    terminal.cyan('Export json at ' + filePath + ' ? [Y|n]\n');

    terminal.yesOrNo(
        { yes: ['y', 'ENTER'], no: ['n'] },
        function (error: any, result: any) {
            if (result) {
                terminal.green('Saving...\n');
                let json = JSON.stringify(output);

                fs.writeFile(filePath, json, (err) => {
                    if (err) {
                        terminal.red('Error writing file:');
                        console.log(err);
                    } else {
                        terminal.green('Successfully wrote file');
                    }
                    process.exit();
                });
            }
        }
    );
}

function ask(name: string, index: number) {
    terminal.clear();
    terminal('\n');
    terminal.gray(output.length + ' current changes\n');
    terminal.gray('Correlation : ' + getCorrelation() + '%\n');
    terminal.bold(name + ' ?\n');
    const du = new DecentUsername(name);
    du.validate();

    terminal.cyan('DecentUsername think ');

    if (du.isValid()) terminal.green('yes');
    else terminal.red('no');

    terminal.singleColumnMenu(items, function (error, response) {
        switch (response.selectedIndex) {
            case 0:
                terminal.green('Validated\n\n');
                output[index] = new Item(
                    name,
                    index,
                    DecentUsernameProblem.Ok,
                    du.problemType
                );
                index++;
                ask(tests[index], index);
                break;

            case 1:
                terminal.red('Banned\n\n');
                output[index] = new Item(
                    name,
                    index,
                    DecentUsernameProblem.Banned,
                    du.problemType
                );
                index++;
                ask(tests[index], index);
                break;

            case 2:
                index--;
                ask(tests[index], index);
                break;

            case 3:
                save();
                break;

            case 4:
                process.exit(1);
        }
    });
}
