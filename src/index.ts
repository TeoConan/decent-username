enum Result {
    Ok,
    Warning,
    Violation,
}

export class DecentUsername {
    private reservedWords: string[] = [];
    private mappers: any;
    private customWords: string[] = [];
    private engine: any = null;

    private possibilities: string[];

    constructor() {
        var BadWords = require('bad-words');
        var frenchBadwordsList = require('french-badwords-list');
        this.reservedWords = require('./res/reserved.json');

        this.engine = new BadWords({ placeHolder: '' });
        this.engine.addWords(...this.reservedWords);
        this.engine.addWords(...frenchBadwordsList.array);
    }

    validate(text: string): Result {
        return Result.Ok;
    }

    getPosibilities(text: string): string[] {
        let output: string[] = [];

        this.mappers.forEach((charsToReplace: string, mapLetter: string) => {
            console.log(mapLetter, charsToReplace);

            for (const char of charsToReplace) {
                output.push(text.replace(char, mapLetter));
            }
        });

        return output;
    }

    validateAll(texts: string[]): Result[] {
        return texts.map((t) => this.validate(t));
    }
}
