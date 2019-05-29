/// <reference path="./random.ts">

const Alphabet : string[] = []

for (let i = 0; i < 26; i++) {
  Alphabet[i] = String.fromCharCode(97 + i);  
}

const Vowel : string[] = ["a", "e", "i", "o", "u"];

const Consonant : string[] = Alphabet.filter(function (v, i, a) {return (Vowel.indexOf(v) == -1)});

class Suffix {
    public readonly suffix : string;
    public readonly optional : string;

    constructor(suffix: string, optional: string) {
        this.suffix = suffix;
        this.optional = optional;
    }
}

class Noun {
    public readonly base : string;
    
    public readonly plural : boolean;
    public readonly genitive : boolean;
    
    public readonly adjectives : string[];

    constructor(base: string, plural: boolean, genitive: boolean, adjectives: string[]) {
        this.base = base;
        this.plural = plural;
        this.genitive = genitive;
        this.adjectives = adjectives;
    }
}

class Language {
    public static capitalize(word: string) : string {
        let restOfWord : string = word.slice(1);
        return word.charAt(0).toUpperCase() + restOfWord;
    }

    public static toTitle(sentence: string) : string {
      return sentence.split(' ').map(Language.capitalize).join(' ');
    }

    private static getSuffix() : Suffix {
        let optional : string = Random.choice(Vowel);

        let suffix : string = Random.choice(Consonant) + Random.choice(Vowel);

        return new Suffix(suffix, optional);
    }

    private static addSuffix(word: string, suffix: Suffix) : string {
        if (Consonant.indexOf(word[word.length-1]) > -1) {
            word += suffix.optional;
        }
        word += suffix.suffix;

        return word;
    }

    private readonly plural : Suffix;
    private readonly genitive : Suffix;
    private readonly adjective : Suffix;

    private readonly adjectivePolicy : Language.Position;

    private translations : Object;

    constructor() {
        this.plural = Language.getSuffix();
        this.genitive = Language.getSuffix();
        this.adjective = Language.getSuffix();

        if (Random.chance(0.5)) {
            this.adjectivePolicy = Language.Position.Before;
        }
        else {
            this.adjectivePolicy = Language.Position.After;
        }

        this.translations = {};
    }

    translate(sentence: Noun[]) : string {
        let sentenceTranslated : string[] = [];
        
        for (let word of sentence) {
            let wordTranslated : string = this.translateWord(word.base);

            if (word.plural) wordTranslated = Language.addSuffix(wordTranslated, this.plural);
            if (word.genitive) wordTranslated = Language.addSuffix(wordTranslated, this.genitive);

            let adjectives : string[] = []
            for (let adj of word.adjectives) {
                let adjTranslated = this.translateWord(adj);

                adjTranslated = Language.addSuffix(adjTranslated, this.adjective);

                adjectives.push(adjTranslated);
            }

            if (this.adjectivePolicy == Language.Position.Before) {
                sentenceTranslated = sentenceTranslated.concat(adjectives);
            }

            sentenceTranslated.push(wordTranslated);

            if (this.adjectivePolicy == Language.Position.After) {
                sentenceTranslated = sentenceTranslated.concat(adjectives);
            }
        }

        return sentenceTranslated.join(" ");
    }

    private translateWord(word: string) {
        // First split word into phonemes.
        let phonemes : string[] = [];

        let currentPhoneme : string = "";

        for (let letter of word.split('')) {
            if (currentPhoneme.length > 0) {
                let lastLetter = currentPhoneme[currentPhoneme.length - 1];

                if (Vowel.indexOf(lastLetter) > -1) {
                    phonemes.push(currentPhoneme);
                    currentPhoneme = "";
                }
                else if ((Consonant.indexOf(lastLetter) > -1) && (Consonant.indexOf(letter) > -1)) {
                    if (lastLetter != letter) {
                        phonemes.push(currentPhoneme);
                        currentPhoneme = "";
                    }
                }
            }

            currentPhoneme += letter;
        }

        if (currentPhoneme.length > 0) phonemes.push(currentPhoneme);

        // Translate each phoneme.
        let wordTranslated : string = "";

        for (let p of phonemes) {
            wordTranslated += this.translatePhoneme(p);
        }

        return wordTranslated;
    }

    private translatePhoneme(phoneme: string) {
        if (!this.translations.hasOwnProperty(phoneme)) {
            let t : string = "";

            for (let letter of phoneme.split('')) {
                if (Consonant.indexOf(letter) > -1) t += Random.choice(Consonant);
                else t += Random.choice(Vowel);
            }

            this.translations[phoneme] = t;
        }

        return this.translations[phoneme];
    }
}

namespace Language {
    export enum Position {
        Before = "Before",
        After = "After",
    }
}