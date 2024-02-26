/* Import all required ressources */
// Characters to remove from input
import specialsChars from './ressources/specialschars.json' assert { type: 'json' };
// Safe words but reserved by the system
import reservedWords from './ressources/reserved.json' assert { type: 'json' };
// Json of mapped letters, transform some specific char to another
import lettersMap from './ressources/lettersMap.json' assert { type: 'json' };
// Banned words, like injures etc...
import badWords from './ressources/badWords.json' assert { type: 'json' };
import chalk from 'chalk';

/**
 * Type of problem (or not) that the algorithm found
 */
export enum DecentUsernameProblem {
    Undefined, // Text is not yet analysed
    Ok, // Nothing problematic found in text
    Banned, // A reserved has been found in variants
    Reserved, // A reserved has been found in variants
    MinLengthViolation, // Text is too short
    MaxLengthViolation, // Text is too long
}

/**
 * Main class of the project
 */
export class DecentUsername {
    // Minimum username length to respect
    public readonly minLength: number;
    // Maximum username length to respect
    public readonly maxLength: number;

    // Text to analyse
    private text: string;
    // List of possible variations of text
    public variants: string[] = [];

    // Problem that is found for the given text
    public problemType: DecentUsernameProblem;

    // Incriminated text
    public violationText: string;

    // List of special chars to remove
    public specialsChars: string[];
    // List of reserved words to detect
    public reservedWords: string[];
    // Letters to change by another
    public lettersMap: any;
    // List of banned words to detect
    public badWords: string[];

    /**
     * @param text - Text to analyse
     * @param minLength - Minimum length of text required
     * @param maxLength - Maximum length of text required
     */
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

    /**
     * Process the given text to find any banned ou reserved words inside.
     *
     * @remarks
     * Can return false-positive sometimes.
     *
     * @returns Return if a problem has been found
     */
    validate(): boolean {
        if (this.text.length < this.minLength) {
            this.violationText = this.text;
            this.problemType = DecentUsernameProblem.MinLengthViolation;
            return false;
        }

        if (this.text.length > this.maxLength) {
            this.violationText = this.text;
            this.problemType = DecentUsernameProblem.MaxLengthViolation;
            return false;
        }

        this.forChars(this.specialsChars, (i, c) => {
            this.text = this.text.replaceAll(c, '');
        });

        this.clearRepeat();
        this.variants = this.getVariations();

        for (const p of this.variants) {
            for (const r of this.reservedWords) {
                if (p == r) {
                    this.violationText = this.text;
                    this.problemType = DecentUsernameProblem.Reserved;
                    return false;
                }
            }

            let highlight = '';
            for (const b of this.badWords) {
                if (this.text.includes(b)) {
                    highlight = chalk.red(chalk.bold(chalk.underline(b)));
                    this.violationText = this.text.replaceAll(b, highlight);
                    this.problemType = DecentUsernameProblem.Banned;
                }
            }
        }

        return true;
    }

    /**
     * Replace all series of 3 letters or more by a only 2 letters maximum.
     * Example : "haapppyyyy" will be "haappyy"
     *
     * @returns Push in variants the cleaned version of text
     */
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

        this.variants.push(output.join(''));
    }

    /**
     * Get current text.
     * @returns Current text to analyse
     */
    get(): string {
        return this.text;
    }

    /**
     * Get if the analysed text is valid
     *
     * @returns true, text is decent, false it's not decent
     */
    isValid(): boolean {
        return this.problemType == DecentUsernameProblem.Ok;
    }

    /**
     * Returns the average of two numbers.
     *
     * @remarks
     * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
     *
     * @param x - The first input number
     * @param y - The second input number
     * @returns The arithmetic mean of `x` and `y`
     *
     * @beta
     */
    removeSpecialChars(text: string): string {
        return text;
    }

    /**
     * Get the list of variation from the lettersMap
     *
     * @remarks
     * Example : for text "b00ßs", variations will be "bo0ßs", "b00ßs", "booßs", "boobs", etc...
     * @returns A list of possible variations for the current text
     */
    private getVariations(): string[] {
        let output: string[] = [this.text];

        this.forChars(this.lettersMap, (mapLetter, char) => {
            const changedText = this.text.replaceAll(char, mapLetter);
            if (changedText != this.text) output.push(changedText);
        });

        return output;
    }

    /**
     * Iterate quickly your key: string object.
     *
     * @param input - Your object to iterate
     * @param callback - Callback for each iteration, i is the index of iteration and v the value
     */
    private forChars(
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
