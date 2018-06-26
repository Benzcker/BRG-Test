import Quest from "./Quest.js";
import { hashCode, constrain } from "./manipulation.js";

String.prototype.hashCode = hashCode;
window.onload = function() {
    
    const   DOMstart                    = document.getElementById('startWrapper'),
            DOMpruefung                 = document.getElementById('pruefungWrapper'),
            DOMauswertung               = document.getElementById('auswertungWrapper'),
            DOMswitchToStart            = document.getElementById('switchToStart'),
            DOMswitchToPruefung         = document.getElementById('switchToPruefung'),
            DOMswitchToAuswertung       = document.getElementById('switchToAuswertung'),
            DOMprevQuest                = document.getElementById('prevQuest'),
            DOMnextQuest                = document.getElementById('nextQuest'),
            DOMquestionHeader           = document.getElementById('questionHeader'),
            DOMquestion                 = document.getElementById('question'),
            DOMquestionNum              = document.getElementById('questionNum'),
            DOMauswertungsPsw           = document.getElementById('auswertungsPsw'),
            DOMoverview                 = document.getElementById('overview'),
            DOMendDescriptionReady      = document.getElementById('endDescriptionReady'),
            DOMendNotReady              = document.getElementById('endNotReady'),
            DOMauswQuests               = document.getElementById('auswQuests'),
            DOMevaluation               = document.getElementById('evaluation'),
            DOMresult                   = document.getElementById('result');
    
    let selectedQuest = 0;
    // Hier quests laden
    const quests = [
        new Quest('Was ist ein dummer Kuchen?',     ['Beton'],                      ['Erdbeere', 'Schokolade']),
        new Quest('Wann essen wir endlich?',        ['niemals'],                    ['8:00', '12:00', '18:00']),
        new Quest('Was macht ein echter Ritter?',   ['Kämpfen', 'Schminken'],       ['Tanzen', 'Singen', 'Lachen']),
        new Quest('Warum werde ich nicht fertig?',  ['Nicht genug Bemühung'],       ['Internet', 'Ablenkung', 'Schule']),
        new Quest('Welche Farbe hat d. Waffenrock?', ['Blau'],                      ['Rot', 'Grün', 'Schwarz']),
        new Quest('Wie lange dauert das noch?',     ['Für immer'],                  ['1h', '5h', '14.5 Tage']),
        new Quest('Was ist hier nicht richtig?',    ['Ich lerne nicht für Prüfungen'], ['Deine Frisur', 'Deine Antworten']),
    ];
    const maxFehler = 2;

    // Passwort, um Auswertung ansehen zu können
    let auswertungsPswHash = -2036676520;
    
    function switchTo(window = 'start', force=false) {
        if (window == 'auswertung' && auswertungsPswHash != DOMauswertungsPsw.value.hashCode() && !force) {
            DOMauswertungsPsw.value = '';
            DOMauswertungsPsw.classList.add('wrong');
            DOMauswertungsPsw.focus();
            setTimeout(() => {
                DOMauswertungsPsw.classList.remove('wrong');
            }, 750);
            return;
        }

        DOMstart.hidden = DOMpruefung.hidden = DOMauswertung.hidden = true;
        DOMstart.classList.add('hidden');
        DOMpruefung.classList.add('hidden');
        DOMauswertung.classList.add('hidden');
        
        switch (window) {
            case 'start':
                DOMstart.hidden = false;
                DOMstart.classList.remove('hidden');
                resetQuests();
                break;
            case 'pruefung':
                DOMpruefung.hidden = false;
                DOMpruefung.classList.remove('hidden');
                generateOverview();
                gotoQuest(0);
                break;
            case 'auswertung':
                DOMauswertung.hidden = false;
                DOMauswertung.classList.remove('hidden');
                DOMauswertungsPsw.value = '';
                generateAuswertung();
                break;
        
            default:
                break;
        }
    }

    DOMswitchToStart.onclick = () => switchTo('start');
    DOMswitchToPruefung.onclick = () => switchTo('pruefung');
    DOMswitchToAuswertung.onclick = () => switchTo('auswertung');


    window.gotoQuest = function(ind) {
        if(selectedQuest < quests.length) document.getElementById('overviewNr' + selectedQuest).classList.remove('selected');
        const answers = document.getElementsByName('answer');
        let selected;
        for(const elem of answers) {
            selected = elem.checked;
            if (selected) {
                quests[selectedQuest].selected = elem.value;
                break;
            }            
        }
        if (selected) {
            document.getElementById('overviewNr'+selectedQuest).classList.add('answered');
        }

        selectedQuest = constrain(ind, 0, quests.length);

        const switchParent = DOMswitchToAuswertung.parentNode;
        switchParent.hidden = selectedQuest < quests.length;
        if (!switchParent.hidden) {
            // Endscreen
            DOMquestion.innerHTML = '';
            DOMquestion.appendChild(switchParent);

            const answQuests = quests.filter(q => {return q.selected}).length;
            const allAnswered = answQuests == quests.length;
            const DOMbeantwFragen = switchParent.childNodes.item(1);
            const answQuestsString = allAnswered ? 'alle' : (`${answQuests} von ${quests.length}`);
            DOMbeantwFragen.innerText = `Du hast ${answQuestsString} Fragen beantwortet.`;
            DOMendDescriptionReady.hidden = !allAnswered;
            DOMendNotReady.hidden = !DOMendDescriptionReady.hidden;

            if (allAnswered) {
                DOMbeantwFragen.classList.add('alldone');
            } else {
                DOMbeantwFragen.classList.remove('alldone');
            }

            DOMnextQuest.classList.add('invisible');
            DOMquestionHeader.classList.add('invisible');
            
            DOMauswertungsPsw.focus();

            return;
        }
        
        // Noch bei den Fragen
        DOMnextQuest.classList.remove('invisible');
        DOMquestionHeader.classList.remove('invisible');
        document.getElementById('overviewNr' + (selectedQuest)).classList.add('selected');

        DOMquestion.innerHTML = quests[selectedQuest].getTestHTMLText();
        DOMquestionNum.innerText = selectedQuest + 1;

        if (selectedQuest == 0) {
            DOMprevQuest.classList.add('invisible');
        } else {
            DOMprevQuest.classList.remove('invisible');
        } 
    }

    DOMprevQuest.onclick = () => gotoQuest(selectedQuest-1);
    DOMnextQuest.onclick = () => gotoQuest(selectedQuest+1);
    DOMauswertungsPsw.onkeydown = evt => { if (evt.key == 'Enter') DOMswitchToAuswertung.click(); }

    window.generateOverview = function() {
        let questionsString = '';
        for (const i in quests) questionsString += `<li id="overviewNr${i}" onclick="gotoQuest(${i})">${quests[i].text}</li>`;
        DOMoverview.innerHTML = `<ol>${questionsString}</ol>`;
    }



    //////// AUSWERTUNG ///////////
    function generateAuswertung() {
        DOMauswQuests.innerHTML = '';
        let rightAnswered = 0;
        quests.forEach((quest, ind) => {
            auswQuests.innerHTML += quest.getAuswertungHTMLText(ind, generateAuswertung);
            rightAnswered += quest.isPoint() | 0; // "| 0" macht Boolean zu Integer (1 oder 0)
        });
        DOMevaluation.innerText = rightAnswered + '/' + quests.length;
        if(quests.length - rightAnswered <= maxFehler) {
            // Bestanden
            DOMresult.innerText = 'Bestanden!'
            DOMresult.classList.add('right');
        } else {
            // Nicht Bestanden
            DOMresult.innerText = 'Nicht bestanden!'
            DOMresult.classList.remove('right');
        }
    }

    function resetQuests() {
        for(const quest of quests) {
            quest.reset();
        }
    }



    //////// INITIALISIERUNG ///////////
    switchTo('start');
    // switchTo('pruefung', true);
    // switchTo('auswertung', true);
}