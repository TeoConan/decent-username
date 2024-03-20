# decent-username

`decent-username` is a library to check if a username doesn't contain offensive or bad words.

Unlike `leo-profanity` package, `decent-username`transform all **homoglyph** in a real letter, replace special characters and supress char repetition

## Installation

You can install `decent-username` from `npm`

```shell
npm install decent-username
```

## Example

The `decent-username` package contains a `DecentUsername`class to check your username, here an example
More details in `src/example.ts` file

```typescript
// Import JS module with :
import { DecentUsername, DecentUsernameProblem } from 'decent-username';

const username = 'iamnâZｉｉｉt';
// Even if it looks like, the "ｉ" is a special char not equals to "i"

console.log(`Let's validate '${username}' !`);

// Test if your username is decent !
const decentUsername = new DecentUsername(username);
// Validate it in a second time, if you want to change somes settings before validation
decentUsername.validate();

// Check if your username is decent
if (decentUsername.isValid()) {
    console.log('This username is decent, you can use it !');
} else {
    console.log('This username is not decent !');
}
```

## Customize

You can add your own word librairy very quickly, in the future, another languages than english will be available

### Add your own dictionary

If you look at `src/index.ts` comments, you can see this :

```typescript
// List of special chars to remove, can be changed if needed
public specialsChars: string[];
// List of reserved words to detect, can be changed if needed
public reservedWords: string[];
// Letters to change by another, can be changed if needed
public lettersMap: any;
// List of banned words to detect, can be changed if needed
public badWords: string[];
```

So to change some dictionary for a custom usage you can do it with :

```typescript
const decentUsername = new DecentUsername(username);
decentUsername.specialsChars = ['$', '*', '`', ' ', '#']; // etc...
decentUsername.reservedWords = ['settings', 'home']; // etc...
decentUsername.lettersMap = {
    a: 'ÀÁÂÃÄÅâãα@',
    b: 'ΒВЬＢｂ8',
    c: 'Ｃｃ',
    d: 'ĎďĐđԁժⅾＤｄ',
}; // etc...
// Example for french
decentUsername.badWords = ['idiot', 'tueur', 'crétin', 'abruti']; // etc...
decentUsername.validate();
```

## Commands

There is few command to use to "play" and use `decent-username`

-   `npm start` : Basic start, just run the example
-   `npm run build` : For contributing, build the Typescript package
-   `npm run dev`: For contributing, it just run `tsc -w` that compile Typescript when a file change
-   `npm run postinstall`: For package deployment only

## Reported bug

### False positive

Unfortunately, there sometimes some false-positive (around 9.5%), this algorithm can be tricked

## Contributing

For contributing, nothing easier !

```shell
git clone # Url of your fork
cd decent-username
npm run dev # Watch files changes
npm start # To run example file that you can modify
```

And after you changes are done, you'll be able to do a `pull request` to the main `repository`
