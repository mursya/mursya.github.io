class Card {
    constructor({ word, translation, options, description }) {
        this._word = word;
        this._translation = translation;
        this._options = options;
        this._description = description;
    }

    isCorrect(n) {
        return  this._translation === this._options[n];
    }

    getCorrect() {
        return this._options.reduce((res, option, i) => {
            if (option === this._translation) res = i;

            return res;
        } ,0);
    }
}

class Deck {
    constructor({ words }) {
        this._words = words;
        this._index = 0;
        this._stats = {
            correct: 0
        };
    }

    getNext() {
        if (this._index >= this._getSize()) return null;

        let cardData = this._words[this._index];

        this._currentCard = new Card({
            word: cardData[0],
            translation: cardData[2],
            options: this._getRandomOptions(this._index),
            description: cardData[1],
        });

        this._index++;

        return this._currentCard;
    }

    validateOption(n) {
        let result = this._currentCard.isCorrect(n);

        if (result) {
            this._stats.correct += 1;
        }

        return result;
    }

    _getRandomOptions(index) {
        let indexes = [index];

        while (indexes.length < 4) {
            let newIndex = getRandom(this._getSize());

            if (!indexes.includes(newIndex)) {
                indexes.push(newIndex);
            }
        }

        return shuffle(indexes).map(index => this._getTranslation(index));
    }

    _getSize() {
        return this._words.length;
    }

    _getTranslation(index) {
        return this._words[index][2];
    }

    getStats() {
        return {
            correct: this._stats.correct,
            incorrect: this._words.length - this._stats.correct
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let deck;
    window.deck = deck;
    let q = document.querySelector.bind(document);

    showAction('start');

    function showAction(action) {
        switch(action) {
            case 'start': {
                let data = q('.data').value;
                let words = data.trim().split('\n').map(row => {
                    let arr = parseRow(row);
                    if (arr.length === 3) return arr;

                    throw Error('can\'t parse: ' + row);
                });
                deck = new Deck({ words: shuffle(words).splice(0, 30) });

                let $deck = q('.deck');
                $deck.innerHTML = '<form action="/" class="deck__form"><button value="next">Start</button></form>';

                q('.deck__form').addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log(e.target);
                    if (e.target && e.target.tagName === 'BUTTON') {
                        let action = e.target.value;

                        showAction(action);
                    }
                });
            }
            case 'next': {
                let card = deck.getNext();

                if (card) {
                    q('.deck__form').innerHTML = `<div class="card">
                        <div class="card__word"><span class="card__word-inner">${card._word.toLowerCase()}</span></div>
                        <div class="card__desc">&nbsp;</div>
                        <div class="card__options">
                            <button class="card__option" type="submit" value="chose0">${card._options[0].toLowerCase()}</button>
                            <button class="card__option" type="submit" value="chose1">${card._options[1].toLowerCase()}</button>
                            <button class="card__option" type="submit" value="chose2">${card._options[2].toLowerCase()}</button>
                            <button class="card__option" type="submit" value="chose3">${card._options[3].toLowerCase()}</button>
                        </div>
                    </div>
                    `;
                } else {
                    let stats = deck.getStats();
                    q('.deck__form').innerHTML = `
                        <div class="deck__results">
                            correct: ${stats.correct}(${(stats.correct / deck._getSize() * 100).toFixed(2)}%)<br> 
                            incorrect: ${stats.incorrect}(${(stats.incorrect / deck._getSize() * 100).toFixed(2)}%)</div>
                        <button class="deck__start" value="start">start</button>
                    `;
                }

                break;
            }

            case 'chose0': {
                let card = deck._currentCard;
                deck.validateOption(0);

                q('.deck__form').innerHTML = getResult({ card: card, selected: 0, correct: card.getCorrect() });

                break;
            }
            case 'chose1': {
                let card = deck._currentCard;
                let res = deck.validateOption(1);

                q('.deck__form').innerHTML = getResult({ card: card, selected: 1, correct: card.getCorrect() });

                break;
            }
            case 'chose2': {
                let card = deck._currentCard;
                let res = deck.validateOption(2);

                q('.deck__form').innerHTML = getResult({ card: card, selected: 2, correct: card.getCorrect() });

                break;
            }
            case 'chose3': {
                let card = deck._currentCard;
                let res = deck.validateOption(3);

                q('.deck__form').innerHTML = getResult({ card: card, selected: 3, correct: card.getCorrect() });

                break;
            }
        }

        function getResult({ card, correct, selected }) {
            function getCorrectOrSelected(row) {
                if (correct == row)
                    return 'card__option--correct';

                if (selected == row)
                    return 'card__option--selected';

                return '';
            }

            return `<div class="card">
                        <div class="card__word"><span class="card__word-inner">${card._word.toLowerCase()}</span></div>
                        <div class="card__desc">${card._description.toLowerCase() && '&nbsp;'}</div>
                        <div class="card__options">
                            <button disabled class="card__option ${getCorrectOrSelected(0)}">${card._options[0].toLowerCase()}</button>
                            <button disabled class="card__option ${getCorrectOrSelected(1)}">${card._options[1].toLowerCase()}</button>
                            <button disabled class="card__option ${getCorrectOrSelected(2)}">${card._options[2].toLowerCase()}</button>
                            <button disabled class="card__option ${getCorrectOrSelected(3)}">${card._options[3].toLowerCase()}</button>
                        </div>
                        <button class="deck__next" value="next">next</button>
                </div>
                `
        }
    }
});

const words = [
    ['bla', 'bla desc', 'ру бла'],
    ['bla1', '', 'ру бла1'],
    ['bla2', 'bla desc2', 'ру бла2'],
    ['bla3', '', 'ру бла3'],
    ['bla4', 'bla desc4', 'ру бла4'],
];


/* ======================================================================== */
function getRandom(n) {
    return Math.trunc(Math.random() * n);
}
function shuffle(orig_array) {
    var array = orig_array.slice();
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function parseRow(row) {
    var res = [];
    var str = row;
    var index;

    while (res.length != 3) {
        if (str[0] === '"') {
            index = str.indexOf('"', 1);
            if (index == -1) index = str.length;
            res.push(str.substring(1, index));
            str = str.substring(index + 2);
        } else {
            index = str.indexOf(',');
            if (index == -1) index = str.length;
            res.push(str.substring(0, index));
            str = str.substring(index + 1);
        }
    }
    return res;
}
