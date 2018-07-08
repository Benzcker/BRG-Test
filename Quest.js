import { shuffle } from "./manipulation.js";

export class Quest {
    constructor(text, type='not defined') {
        this.text = text;
        this.type = type;
    }
    get maxPoints() { return 1; }
    get correctAnswered() { return false; }
    getPoints() { console.error("No Questtype defined! Returning 0 Points..."); return 0; }
    get isAnswered() { console.error("No Questtype defined! Returning not answered..."); return false; }
    reset() {  }
    getTestHTMLText() {
        return `<h1>${this.text}</h1> Kein Questtype festgelegt!`;
    }
    getAuswertungHTMLText(ind, generateAuswertung) {
        let auswertungHTML = `
                    <div class="aQuestWrapper">
                        <div class="aQuest">${ind + 1}. ${this.text}</div>
                        <div class="aAnswer">Kein Questtype festgelegt!</div>
                        <div class="aTrue"></div>
                        <div class="aRight" onclick="correctQuest${ind}()"></div>
                    </div>`;
        window['correctQuest' + ind] = () => {
            this.setRight = !this.setRight;
            generateAuswertung();
        }
        return auswertungHTML;
    }
}







export class FieldQuest extends Quest{
    constructor(text, fieldAmount=1) {
        super(text, 'field');
        this.fieldAmount = fieldAmount;
        
        this.reset();
    }

    reset() {
        // Standart

        // FieldQuest
        this.answers = [];
        this.rights = new Array(this.fieldAmount);
        this.rights.fill(false);
    }
    get maxPoints() { return this.fieldAmount; }
    getPoints() {
        return this.rights.reduce((points, r) => { return points + (r |0); });
    }
    get isAnswered() { return this.answers.every(answ => {return answ != '' && answ != false}) }

    getTestHTMLText(ind) {
        let inputFields = '';
        for (let i = 0; i < this.fieldAmount; ++i) inputFields += `<input type="text" class="fieldQuestInput" id="fieldQuestInputQ${ind}A${i}" value="${i < this.answers.length ? this.answers[i] : ''}"></input><br>`;
        return `<h1>${this.text}</h1>${inputFields}`;
    }

    getAuswertungHTMLText(ind, generateAuswertung) {
        let answerString = '';
        for (const i in this.answers) answerString += `<div class="${this.rights[i] ? 'right' : ''}">${parseInt(i)+1}. ${this.answers[i]}</div>`;
        let rightString = '';
        for(const r in this.rights) {
            rightString += `<div class="${this.rights[r] ? 'right' : ''}" onclick="correctQuest${ind}R${r}()">${parseInt(r)+1}. ${this.rights[r] ? '&#10004;' : '&#10008;'}</div>`;
            window['correctQuest' + ind + 'R' + r] = () => {
                this.rights[r] = !this.rights[r];
                generateAuswertung();
            }
        };
        let auswertungHTML = `
                    <div class="aQuestWrapper">
                        <div class="aQuest">${ind + 1}. ${this.text}</div>
                        <div class="aAnswer">${answerString}</div>
                        <div class="aTrue"></div>
                        <div class="aRight">${rightString}</div>
                    </div>`;
        
        return auswertungHTML;
    }
}

export class RadioQuest extends Quest {
    constructor(text, answers, wrongAnswers) {
        super(text, 'radio');

        this.answers = answers;
        this.wrongAnswers = wrongAnswers;
        this.shuffledAnswers = null;
        this.selected = null;
        this.setRight = null;
    }

    get correctAnswered() {
        return this.answers.includes(this.selected);
    }
    getPoints() {
        // Wenn setRight Boolean ist, dann return setRight; sonst setze setRight auf correctAnswered und return das dann
        // Zum Schluss |0 um aus dem Boolean 0 oder 1 zu machen
        return (typeof (this.setRight) === 'boolean' ? this.setRight : (this.setRight = this.correctAnswered)) |0;
    }
    get isAnswered() { return ((this.selected && this.selected.length) |0) > 0 }

    reset() {
        // Standart
        
        // RadioQuest
        this.setRight = null;
        this.selected = null;
        this.shuffledAnswers = null;
    }

    getTestHTMLText() {
        // if (this.HTMLText) return this.HTMLText;
        let answersString = '';
        this.shuffledAnswers = this.shuffledAnswers || shuffle(this.wrongAnswers.concat(this.answers));
        for (const answer of this.shuffledAnswers) answersString += `
                <input type="radio" name="answer" id="answ_${answer}" value="${answer}" 
                ${this.selected == answer ? 'checked' : ''}> 
                <label for="answ_${answer}"><span><span></span></span>${answer}</label><br>`;

        return `<h1>${this.text}</h1><form id="answers">${answersString}</form>`;
    }

    getAuswertungHTMLText(ind, generateAuswertung) {
        const right = this.getPoints() > 0 ? 'right' : '';
        let auswertungHTML = `
                    <div class="aQuestWrapper">
                        <div class="aQuest">${ind + 1}. ${this.text}</div>
                        <div class="aAnswer ${right}">${this.selected ? this.selected : '&#10134;'}</div>
                        <div class="aTrue">${this.getAuswertungTrues()}</div>
                        <div class="aRight ${right}" onclick="correctQuest${ind}()">${right ? '&#10004;' : '&#10008;'}</div>
                    </div>`;
        window['correctQuest' + ind] = () => {
            this.setRight = !this.setRight;
            generateAuswertung();
        }
        return auswertungHTML;
    }

    getAuswertungTrues() {
        let str = '';
        for (const ind in this.answers) str += this.answers[ind] + (ind < this.answers.length - 1 ? ', ' : '');
        return str;
    }
}