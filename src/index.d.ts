declare module 'decent-username' {
    export class DecentUsername {
        // List of possible variations of text

        variants: string[];
        problemType: DecentUsernameProblem;
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
         * Get current text.
         * @returns Current text to analyse
         */
        public get(): string;

        /**
         * Get if the analysed text is valid
         *
         * @returns true, text is decent, false it's not decent
         */
        public isValid(): boolean;

        /**
         * Process the given text to find any banned ou reserved words inside.
         *
         * @remarks
         * Can return false-positive sometimes.
         *
         * @returns Return if a problem has been found
         */
        validate(): boolean;

        /**
         * Remove all specials chars found in this.specialsChars
         *
         * @remarks
         * Manipulate this.text directly
         *
         * @returns void
         */
        public removeSpecialChars(): void;

        /**
         * Remap all special letters in another to avoid homoglyph tries
         *
         * @remarks
         * Letters can be found in ./ressources/lettersMap.js
         *
         * @returns string
         */
        public reMapLetters(text: string): string;

        /**
         * Replace all series of repeating letters by only one.
         * Example : "haapppyyyy" will be :
         *      [happpyyyy, happyyyy, hapyyyy, hapyyyy, etc..]
         *
         * @returns New variants of text
         */
        private clearRepeat(inputs: string[]): string[];
    }

    export enum DecentUsernameProblem {
        Undefined, // Text is not analysed yet
        Ok, // Nothing problematic found in text
        Banned, // A reserved has been found in variants
        Reserved, // A reserved has been found in variants
        MinLengthViolation, // Text is too short
        MaxLengthViolation, // Text is too long
    }
}

export default module;
