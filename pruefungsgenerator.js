import { RadioQuest, FieldQuest, Quest } from "./Quest.js";

export function extractPruefungen(jsonData={}) {
    const pruefungen = {};
    
    for (const name in jsonData) {
        pruefungen[name] = {};
        pruefungen[name]['maxMistakes'] = jsonData[name]['maxMistakes'];
        pruefungen[name]['quests'] = [];
        for (const question of jsonData[name]['quests']) {
            pruefungen[name]['quests'].push( generateQuestion(question) );
        }
    }
    return pruefungen;
}


function generateQuestion(questionJSON={}) {
    switch (questionJSON['type']) {
        case 'radio':
            return new RadioQuest(
                    questionJSON['text'],
                    questionJSON['answers'],
                    questionJSON['wrongAnswers']
                );
        case 'field':
            return new FieldQuest(
                    questionJSON['text'],
                    questionJSON['fieldAmount']
                );
        default:
            return new Quest(questionJSON['text'] || 'Diese Frage wurde nicht definiert.');
    }
}

export function generateMainMenuButton(name, pruefung) {
    return `<button type="button" class="nextButton" onclick="switchToPruefung${name}()">${name}</button>`;
}
