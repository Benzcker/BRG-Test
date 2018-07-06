import { RadioQuest, FieldQuest } from "./Quest.js";

export function extractPruefungen(jsonData={}) {
    const pruefungen = {};
    for (const name in jsonData) {
        pruefungen[name] = [];
        for (const question of jsonData[name]) {
            switch (question['type']) {
                case 'radio':
                    pruefungen[name].push(
                        new RadioQuest(
                            question['text'],
                            question['answers'],
                            question['wrongAnswers']
                        )
                    );
                    break;
                case 'field':
                    pruefungen[name].push(
                        new FieldQuest(
                            question['text'],
                            question['fieldAmount']
                        )
                    );
                    break;

                default:
                    break;
            }
        }
    }

    return pruefungen;
}