/* Import all required ressources */
// Characters to remove from input
import specialsChars from './ressources/specialschars.json' assert { type: 'json' };
// Safe words but reserved by the system
import reservedWords from './ressources/reserved.json' assert { type: 'json' };
// Json of mapped letters, transform some specific char to another
import lettersMap from './ressources/lettersMap.json' assert { type: 'json' };
// Banned words, like injures etc...
import badWords from './ressources/badWords.json' assert { type: 'json' };

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
    public problemType: DecentUsernameProblem;

    // Incriminated text
    public violationText: string;
    // Incriminated word's position in string
    public violationPosition: number[];

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
        this.variants = this.clearRepeat(this.text);

        // Variations processing
        this.variants = [...this.variants, ...this.getVariations(this.text)];

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
     * Replace all series of repeating letters by only one.
     * Example : "haapppyyyy" will be :
     *      [happpyyyy, happyyyy, hapyyyy, hapyyyy, etc..]
     *
     * @returns New variants of text
     */
    private clearRepeat(input: string): string[] {
        const variants = [input];
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

        return variants;
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
    public removeSpecialChars(): void {
        this.forChars(this.specialsChars, (i, c) => {
            this.text = this.text.replaceAll(c, '');
        });
    }

    /**
     * Get the list of variation from the lettersMap
     *
     * @remarks
     * Example : for text "b00ßs", variations will be "bo0ßs", "b00ßs", "booßs", "boobs", etc...
     * @returns A list of possible variations for the current text
     */
    private getVariations(text: string): string[] {
        let output: string[] = [text];

        this.forChars(this.lettersMap, (mapLetter, char) => {
            let changedText = text.replace(char, mapLetter);

            if (changedText != text) {
                // Recursive changes
                output = [...output, ...this.getVariations(changedText)];
            }
        });

        // Remove lines duplications
        output = output.filter(function (value, index, array) {
            return array.indexOf(value) === index;
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
    ): void {
        const keys = Object.keys(input);

        for (const key of keys) {
            const values = Reflect.get(input, key);

            for (const value of values) {
                callback(key, value, values);
            }
        }
    }
}
