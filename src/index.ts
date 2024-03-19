/* Import all required ressources */
// Characters to remove from input
import specialsChars from './ressources/specialschars.js';
// Safe words but reserved by the system
import reservedWords from './ressources/reserved.js';
// Json of mapped letters, transform some specific char to another
import lettersMap from './ressources/lettersMap.js';
// Banned words, like injures etc...
import badWords from './ressources/badWords.js';

/**
 * Type of problem (or not) that the algorithm found
 */
export enum DecentUsernameProblem {
    Undefined, // Text is not analysed yet
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
    private readonly alphabet: string[];

    // Minimum username length to respect
    public readonly minLength: number;
    // Maximum username length to respect
    public readonly maxLength: number;

    // Text to analyse
    private text: string;
    // List of possible variations of text
    public variants: string[] = [];

    // Problem that is found for the given text
    public problemType: DecentUsernameProblem = DecentUsernameProblem.Undefined;

    // Incriminated text
    public violationText: string;
    // Incriminated word's position in string
    public violationPosition: number[];

    // List of special chars to remove, can be changed if needed
    public specialsChars: string[];
    // List of reserved words to detect, can be changed if needed
    public reservedWords: string[];
    // Letters to change by another, can be changed if needed
    public lettersMap: any;
    // List of banned words to detect, can be changed if needed
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

        this.text = text.trim().toLocaleLowerCase();
        this.problemType = DecentUsernameProblem.Ok;
        this.specialsChars = specialsChars;
        this.reservedWords = reservedWords;
        this.lettersMap = lettersMap;
        this.badWords = badWords;

        // Get alphabet
        const alpha = Array.from(Array(26)).map((e, i) => i + 97);
        this.alphabet = alpha.map((x) => String.fromCharCode(x));
    }

    /**
     * Get current text.
     * @returns Current text to analyse
     */
    public get(): string {
        return this.text;
    }

    /**
     * Get if the analysed text is valid
     *
     * @returns true, text is decent, false it's not decent
     */
    public isValid(): boolean {
        if (this.problemType == DecentUsernameProblem.Undefined)
            throw 'Cannot get output of DecentUsername, please use validate() function before';
        return this.problemType == DecentUsernameProblem.Ok;
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
        // Length check
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

        // Main text process
        this.removeSpecialChars();

        // Get all possibles variation of text
        this.variants = [this.text, this.reMapLetters(this.text)];
        this.variants = [...this.variants, ...this.clearRepeat(this.variants)];

        // Remove duplications
        this.variants = this.variants.filter(function (value, index, array) {
            return array.indexOf(value) === index;
        });

        // Variations validation
        for (const v of this.variants) {
            for (const r of this.reservedWords) {
                if (v == r) {
                    this.violationText = this.text;
                    this.problemType = DecentUsernameProblem.Reserved;
                    return false;
                }
            }

            let position: number[] = [];
            for (const b of this.badWords) {
                if (v.includes(b)) {
                    // Get violation word's position
                    position[0] = v.indexOf(b);
                    position[1] = position[0] + v.length;

                    this.violationPosition = position;
                    this.violationText = v;
                    this.problemType = DecentUsernameProblem.Banned;
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Remove all simple specials chars found in this.specialsChars
     *
     * @remarks
     * Manipulate this.text directly
     *
     * @returns void
     */
    public removeSpecialChars(): void {
        this.forChars(this.specialsChars, (i, c) => {
            this.text = this.text.replaceAll(c, '');
            return true;
        });
    }

    /**
     * Remap all special letters in another to avoid homoglyph tries
     *
     * @remarks
     * Letters can be found in ./ressources/lettersMap.js
     *
     * @returns string
     */
    public reMapLetters(text: string): string {
        this.forChars(this.lettersMap, (mapLetter, char) => {
            text = text.replaceAll(char, mapLetter);
            return true;
        });

        return text;
    }

    /**
     * Replace all series of repeating letters by only one.
     * Example : "haapppyyyy" will be :
     *      [happpyyyy, happyyyy, hapyyyy, hapyyyy, etc..]
     *
     * @returns New variants of text
     */
    public clearRepeat(inputs: string[]): string[] {
        const variants = [];

        for (let input of inputs) {
            let repetition = false;
            let change = '';

            // For every letters of the alphabet
            for (const letter of this.alphabet) {
                // Clear all repeatition until no one left
                do {
                    repetition = false;
                    change = input.replace(letter.repeat(2), letter);

                    if (change != input) {
                        repetition = true;
                        // Add it in variations
                        variants.push(change);
                        input = change;
                    }
                } while (repetition);
            }
        }

        return variants;
    }

    /**
     * Iterate quickly your key: string object.
     *
     * @param input - Your object to iterate
     * @param callback - Callback for each iteration, i is the index of iteration and v the value
     */
    private forChars(
        input: any,
        callback: (i: string, v: string, line: string) => boolean
    ): void {
        const keys = Object.keys(input);
        let output = true;

        for (const key of keys) {
            const values = Reflect.get(input, key);

            for (const value of values) {
                output = callback(key, value, values);
                if (!output) break;
            }
            if (!output) break;
        }
    }
}
