import { hashCode, constrain, loadJSON } from "./manipulation.js";
import { extractPruefungen } from "./pruefungsgenerator.js";
import { RadioQuest, FieldQuest, Quest } from "./Quest.js";

String.prototype.hashCode = hashCode;
window.onload = function() {
    loadJSON('./pruefungen.json?'+Date.now())
    .then( pruefungsDaten => {

        const   DOMstart                    = document.getElementById('startWrapper'),
                DOMpruefung                 = document.getElementById('pruefungWrapper'),
                DOMauswertung               = document.getElementById('auswertungWrapper'),
                DOMadmin                    = document.getElementById('adminWrapper'),
                DOMadminlink                = document.getElementById('adminlink'),
                DOMadminlinkPsw             = document.getElementById('adminlinkPsw'),
                DOMswitchToStart            = document.getElementsByClassName('switchToStart'),
                DOMswitchToPruefung         = document.getElementById('switchToPruefungNovize'),
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
        // unten
        const pruefungen = extractPruefungen(pruefungsDaten);
        let selectedQuest = 0;
        // Wenn er auf button drückt quests und maxFehler setzen
        const quests = pruefungen['novize']['quests'];
        const maxFehler = pruefungen['novize']['maxMistakes'];

        // Passwort, um Auswertung ansehen zu können
        let auswertungsPswHash = -2036676520;
        
        function switchTo(nextWindow = 'start') {
            if (nextWindow == 'auswertung' && auswertungsPswHash != DOMauswertungsPsw.value.hashCode()) {
                DOMauswertungsPsw.value = '';
                DOMauswertungsPsw.classList.add('wrong');
                DOMauswertungsPsw.focus();
                setTimeout(() => {
                    DOMauswertungsPsw.classList.remove('wrong');
                }, 750);
                return;
            } else if (nextWindow == 'admin' && auswertungsPswHash != DOMadminlinkPsw.value.hashCode()) {
                DOMadminlinkPsw.value = '';
                DOMadminlinkPsw.classList.add('wrong');
                DOMadminlinkPsw.focus();
                setTimeout(() => {
                    DOMadminlinkPsw.classList.remove('wrong');
                }, 750);
                return;
            }

            DOMadminlinkPsw.value = '';

            // DOMstart.hidden = DOMpruefung.hidden = DOMauswertung.hidden = DOMadmin.hidden = true;
            // DOMstart.classList.add('hidden');
            // DOMpruefung.classList.add('hidden');
            // DOMauswertung.classList.add('hidden');
            // DOMadmin.classList.add('hidden');
            for(const elem of [DOMstart, DOMpruefung, DOMauswertung, DOMadmin]) {
                elem.hidden = true;
                elem.classList.add('hidden');
            }

            switch (nextWindow) {
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
                case 'admin':
                    DOMadmin.hidden = false;
                    DOMadmin.classList.remove('hidden');
                    break;
            
                default:
                    break;
            }
        }

        // onclicks setzen
        for (const b of DOMswitchToStart) { b.onclick = () => switchTo('start'); };
        DOMswitchToPruefung.onclick = () => switchTo('pruefung');
        DOMswitchToAuswertung.onclick = () => switchTo('auswertung');
        DOMadminlink.onclick = () => switchTo('admin');

        window.gotoQuest = function(ind) {
            const isAQuest = selectedQuest < quests.length;
            if(isAQuest) {
                document.getElementById('overviewNr' + selectedQuest).classList.remove('selected');
                if (quests[selectedQuest].type == 'radio') {
                    let selected;
                    const answers = document.getElementsByName('answer');
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
                } else if (quests[selectedQuest].type == 'field') {
                    let complete = true;
                    quests[selectedQuest].answers = [];
                    for (let i = 0; i < quests[selectedQuest].fieldAmount; ++i) {
                        const nextInp = document.getElementById(`fieldQuestInputQ${selectedQuest}A${i}`).value;
                        quests[selectedQuest].answers.push(nextInp);
                        if(nextInp == '' || typeof(nextInp) != 'string') complete = false;
                    }
                    if (complete) document.getElementById('overviewNr' + selectedQuest).classList.add('answered');
                }
            }

            selectedQuest = constrain(ind, 0, quests.length);

            const switchParent = DOMswitchToAuswertung.parentNode;
            switchParent.hidden = selectedQuest < quests.length;
            if (!switchParent.hidden) {
                // Endscreen
                DOMquestion.innerHTML = '';
                DOMquestion.appendChild(switchParent);

                const answQuests = quests.filter(q => {return q.isAnswered}).length;
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

            DOMquestion.innerHTML = quests[selectedQuest].getTestHTMLText(selectedQuest);
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
        DOMadminlinkPsw.onkeydown = evt => { if (evt.key == 'Enter') DOMadminlink.click(); }

        window.generateOverview = function() {
            let questionsString = '';
            for (const i in quests) questionsString += `<li id="overviewNr${i}" onclick="gotoQuest(${i})">${quests[i].text}</li>`;
            DOMoverview.innerHTML = `<ol>${questionsString}</ol>`;
        }



        //////// AUSWERTUNG ///////////
        function generateAuswertung() {
            DOMauswQuests.innerHTML = '';
            let rightAnswered = 0;
            let maxPoints = 0;
            quests.forEach((quest, ind) => {
                auswQuests.innerHTML += quest.getAuswertungHTMLText(ind, generateAuswertung);
                rightAnswered += quest.getPoints();
                maxPoints += quest.maxPoints;
            });
            DOMevaluation.innerText = rightAnswered + '/' + maxPoints;
            if(maxPoints - rightAnswered <= maxFehler) {
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
    });
}