import specialsChars from './ressources/specialschars.json' assert { type: 'json' };
import reservedWords from './ressources/reserved.json' assert { type: 'json' };
import lettersMap from './ressources/lettersMap.json' assert { type: 'json' };
import badWords from './ressources/badWords.json' assert { type: 'json' };

export enum DecentUsernameProblem {
    Undefined,
    Ok,
    Banned,
    Reserved,
    MinLengthViolation,
    MaxLengthViolation,
}

export class DecentUsername {
    public readonly minLength: number;
    public readonly maxLength: number;

    private text: string;
    public variants: string[] = [];
    public problemType: DecentUsernameProblem;
    public violationText: string;

    public specialsChars: string[];
    public reservedWords: string[];
    public lettersMap: any;
    public badWords: string[];

    constructor(text: string, minLength: number = 4, maxLength: number = 16) {
        if (!text) throw 'Please provide username';

        this.minLength = minLength;
        this.maxLength = maxLength;

        this.text = text.toLocaleLowerCase();
        this.problemType = DecentUsernameProblem.Ok;
        this.specialsChars = specialsChars;
        this.reservedWords = reservedWords;
        this.lettersMap = lettersMap;
        this.badWords = badWords;
    }

    validate(): boolean {
        if (this.text.length < this.minLength) {
            this.violationText = this.text;
            this.problemType = DecentUsernameProblem.MinLengthViolation;
            return;
        }

        if (this.text.length >= this.maxLength) {
            this.violationText = this.text;
            this.problemType = DecentUsernameProblem.MaxLengthViolation;
            return;
        }

        this.forChars(this.specialsChars, (i, c) => {
            this.text = this.text.replaceAll(c, '');
        });

        this.variants = this.getVariations();
        this.clearRepeat();

        for (const p of this.variants) {
            for (const r of this.reservedWords) {
                if (p == r) {
                    this.violationText = this.text;
                    this.problemType = DecentUsernameProblem.Reserved;
                    return;
                }
            }

            let hidder = '';
            for (const b of this.badWords) {
                if (this.text.includes(b)) {
                    hidder = '*'.repeat(b.length);
                    this.violationText = this.text.replaceAll(b, hidder);
                    this.problemType = DecentUsernameProblem.Banned;
                }
            }
        }
        return true;
    }

    clearRepeat() {
        const text = this.text.split('');
        let output = [];

        for (let i = 0; i < this.text.length; i++) {
            // Si le charactère courant n'est pas 0 ou max et que les 3 lettres courante ne sont pas égaux, alors
            if (
                i != 0 &&
                i != text.length &&
                text[i - 1] == text[i] &&
                text[i] == text[i + 1]
            ) {
                continue;
            }

            output.push(text[i]);
        }

        this.variants.push(output.join());
    }

    get(): string {
        return this.text;
    }

    isValid(): boolean {
        return this.problemType == DecentUsernameProblem.Ok;
    }

    removeSpecialChars(text: string): string {
        return text;
    }

    getVariations(): string[] {
        let output: string[] = [this.text];

        this.forChars(this.lettersMap, (mapLetter, char) => {
            const changedText = this.text.replaceAll(char, mapLetter);
            if (changedText != this.text) output.push(changedText);
        });

        return output;
    }

    forChars(
        input: any,
        callback: (i: string, v: string, line: string) => void
    ) {
        const keys = Object.keys(input);

        for (const key of keys) {
            const values = Reflect.get(input, key);

            for (const value of values) {
                callback(key, value, values);
            }
        }
    }
}
