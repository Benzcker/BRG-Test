window.onload = function() {

    const   DOMstart = document.getElementById('startWrapper'),
            DOMpruefung = document.getElementById('pruefungWrapper'),
            DOMauswertung = document.getElementById('auswertungWrapper'),
            DOMswitchToStart = document.getElementById('switchToStart'),
            DOMswitchToPruefung = document.getElementById('switchToPruefung'),
            DOMswitchToAuswertung = document.getElementById('switchToAuswertung'),
            DOMprevQuest = document.getElementById('prevQuest'),
            DOMnextQuest = document.getElementById('nextQuest');
    
    let selectedQuest = 0;        
    
    function switchTo(window = 'start') {
        DOMstart.hidden = DOMpruefung.hidden = DOMauswertung.hidden = true;
        DOMstart.classList.add('hidden');
        DOMpruefung.classList.add('hidden');
        DOMauswertung.classList.add('hidden');
        console.log(`switch to ${window}`);
        
        switch (window) {
            case 'start':
                DOMstart.hidden = false;
                DOMstart.classList.remove('hidden');
                break;
            case 'pruefung':
                DOMpruefung.hidden = false;
                DOMpruefung.classList.remove('hidden');
                gotoQuest(0);
                break;
            case 'auswertung':
                DOMauswertung.hidden = false;
                DOMauswertung.classList.remove('hidden');
                break;
        
            default:
                break;
        }
    }

    DOMswitchToStart.onclick = () => switchTo('start');
    DOMswitchToPruefung.onclick = () => switchTo('pruefung');
    DOMswitchToAuswertung.onclick = () => switchTo('auswertung');

    function gotoQuest(ind) {
        selectedQuest = ind;
        console.log(`Go to quest ${selectedQuest}`);
    }

    DOMprevQuest.onclick = () => gotoQuest(selectedQuest-1);
    DOMnextQuest.onclick = () => gotoQuest(selectedQuest+1);

    switchTo('start');
}