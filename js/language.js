/// <reference path="./random.ts">
var Alphabet = [];
for (var i = 0; i < 26; i++) {
    Alphabet[i] = String.fromCharCode(97 + i);
}
var Vowel = ["a", "e", "i", "o", "u"];
var Consonant = Alphabet.filter(function (v, i, a) { return (Vowel.indexOf(v) == -1); });
var Suffix = /** @class */ (function () {
    function Suffix(suffix, optional) {
        this.suffix = suffix;
        this.optional = optional;
    }
    return Suffix;
}());
var Noun = /** @class */ (function () {
    function Noun(base, plural, genitive, adjectives) {
        this.base = base;
        this.plural = plural;
        this.genitive = genitive;
        this.adjectives = adjectives;
    }
    return Noun;
}());
var Language = /** @class */ (function () {
    function Language() {
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
    Language.capitalize = function (word) {
        var restOfWord = word.slice(1);
        return word.charAt(0).toUpperCase() + restOfWord;
    };
    Language.toTitle = function (sentence) {
        return sentence.split(' ').map(Language.capitalize).join(' ');
    };
    Language.getSuffix = function () {
        var optional = Random.choice(Vowel);
        var suffix = Random.choice(Consonant) + Random.choice(Vowel);
        return new Suffix(suffix, optional);
    };
    Language.addSuffix = function (word, suffix) {
        if (Consonant.indexOf(word[word.length - 1]) > -1) {
            word += suffix.optional;
        }
        word += suffix.suffix;
        return word;
    };
    Language.prototype.translate = function (sentence) {
        var sentenceTranslated = [];
        for (var _i = 0, sentence_1 = sentence; _i < sentence_1.length; _i++) {
            var word = sentence_1[_i];
            var wordTranslated = this.translateWord(word.base);
            if (word.plural)
                wordTranslated = Language.addSuffix(wordTranslated, this.plural);
            if (word.genitive)
                wordTranslated = Language.addSuffix(wordTranslated, this.genitive);
            var adjectives = [];
            for (var _a = 0, _b = word.adjectives; _a < _b.length; _a++) {
                var adj = _b[_a];
                var adjTranslated = this.translateWord(adj);
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
    };
    Language.prototype.translateWord = function (word) {
        // First split word into phonemes.
        var phonemes = [];
        var currentPhoneme = "";
        for (var _i = 0, _a = word.split(''); _i < _a.length; _i++) {
            var letter = _a[_i];
            if (currentPhoneme.length > 0) {
                var lastLetter = currentPhoneme[currentPhoneme.length - 1];
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
        if (currentPhoneme.length > 0)
            phonemes.push(currentPhoneme);
        // Translate each phoneme.
        var wordTranslated = "";
        for (var _b = 0, phonemes_1 = phonemes; _b < phonemes_1.length; _b++) {
            var p = phonemes_1[_b];
            wordTranslated += this.translatePhoneme(p);
        }
        return wordTranslated;
    };
    Language.prototype.translatePhoneme = function (phoneme) {
        if (!this.translations.hasOwnProperty(phoneme)) {
            var t = "";
            for (var _i = 0, _a = phoneme.split(''); _i < _a.length; _i++) {
                var letter = _a[_i];
                if (Consonant.indexOf(letter) > -1)
                    t += Random.choice(Consonant);
                else
                    t += Random.choice(Vowel);
            }
            this.translations[phoneme] = t;
        }
        return this.translations[phoneme];
    };
    return Language;
}());
(function (Language) {
    var Position;
    (function (Position) {
        Position["Before"] = "Before";
        Position["After"] = "After";
    })(Position = Language.Position || (Language.Position = {}));
})(Language || (Language = {}));
