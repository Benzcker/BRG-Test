import { shuffle } from "./manipulation.js";

export default class Quest {
    constructor(text, answers, wrongAnswers) {
        this.text = text;
        this.answers = answers;
        this.wrongAnswers = wrongAnswers;
        this.shuffledAnswers = null;
        this.selected = null;
        this.setRight = null;
    }

    get correctAnswered() {
        return this.answers.includes(this.selected);
    }
    isPoint() {
        return typeof (this.setRight) === 'boolean' ? this.setRight : (this.setRight = this.correctAnswered);
    }

    reset() {
        this.selected = null;
        this.shuffledAnswers = null;
        this.setRight = null;
    }

    getTestHTMLText() {
        if (this.HTMLText) return this.HTMLText;
        let answersString = '';
        this.shuffledAnswers = this.shuffledAnswers || shuffle(this.wrongAnswers.concat(this.answers));
        for (const answer of this.shuffledAnswers) answersString += `
                <input type="radio" name="answer" id="answ_${answer}" value="${answer}" 
                ${this.selected == answer ? 'checked' : ''}> 
                <label for="answ_${answer}"><span><span></span></span>${answer}</label><br>`;

        return `<h1>${this.text}</h1><form id="answers">${answersString}</form>`;
    }

    getAuswertungHTMLText(ind, generateAuswertung) {
        const right = this.isPoint() ? 'right' : '';
        const correct = this.correctAnswered ? 'right' : '';
        let auswertungHTML = `
                    <div class="aQuestWrapper">
                        <div class="aQuest">${ind + 1}. ${this.text}</div>
                        <div class="aAnswer ${correct}">${this.selected ? this.selected : '&#10134;'}</div>
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