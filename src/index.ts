enum Result {
    Ok,
    Warning,
    Violation,
}

export class DecentUsername {
    private specialsChars: string[] = [];
    private reservedWords: string[] = [];
    private customWords: string[] = [];
    private mappers: any;

    private engine: any = null;

    private possibilities: string[];

    constructor() {
        var BadWords = require('bad-words');
        var frenchBadwordsList = require('french-badwords-list');
        this.specialsChars = require('./res/specialschars.json');
        this.reservedWords = require('./res/reserved.json');
        this.mappers = require('./res/mappers.json');

        this.engine = new BadWords({ placeHolder: '' });
        this.engine.addWords(...this.reservedWords);
        this.engine.addWords(...frenchBadwordsList.array);
    }

    validate(text: string): Result {
        this.possibilities = this.getPosibilities(text);
        return Result.Ok;
    }

    getPosibilities(text: string): string[] {
        let output: string[] = [];
        const keys = Object.keys(this.mappers);

        for (const mapLetter of keys) {
            const charsToReplace = Reflect.get(this.mappers, mapLetter);

            for (const char of charsToReplace) {
                output.push(text.replace(char, mapLetter));
            }
        }

        return output;
    }

    validateAll(texts: string[]): Result[] {
        return texts.map((t) => this.validate(t));
    }
}
