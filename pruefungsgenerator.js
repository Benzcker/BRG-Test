import { RadioQuest, FieldQuest, Quest } from "./Quest.js";

export function extractPruefungen(jsonData={}) {
    const pruefungen = {};
    
    for (const name in jsonData) {
        pruefungen[name] = {};
        pruefungen[name]['maxMistakes'] = jsonData[name]['maxMistakes'];
        pruefungen[name]['quests'] = [];
        console.log(pruefungen);
        for (const question of jsonData[name]['quests']) {
            pruefungen[name]['quests'].push( generateQuestion(question) );
        }
    }
    return pruefungen;

    // return { novize: { maxMistakes: 2, quests: [new RadioQuest('Wann essen wir endlich?', ['niemals'], ['8:00', '12:00', '18:00']), new FieldQuest('Nenne 3 Tugenden der Ritter.', 3)] } };
}

        //     'novize': [
        //         new RadioQuest('Was ist ein dummer Kuchen?', ['Beton'], ['Erdbeere', 'Schokolade']),
        //         new RadioQuest('Wann essen wir endlich?', ['niemals'], ['8:00', '12:00', '18:00']),
        //         new FieldQuest('Nenne 3 Tugenden der Ritter.', 3),
        //         new RadioQuest('Was macht ein echter Ritter?', ['Kämpfen', 'Schminken'], ['Tanzen', 'Singen', 'Lachen']),
        //         new RadioQuest('Warum werde ich nicht fertig?', ['Nicht genug Bemühung'], ['Internet', 'Ablenkung', 'Schule']),
        //         new RadioQuest('Welche Farbe hat d. Waffenrock?', ['Blau'], ['Rot', 'Grün', 'Schwarz']),
        //         new RadioQuest('Wie lange dauert das noch?', ['Für immer'], ['1h', '5h', '14.5 Tage']),
        //         new RadioQuest('Was ist hier nicht richtig?', ['Ich lerne nicht für Prüfungen'], ['Deine Frisur', 'Deine Antworten']),
        //     ]
        // };

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