window.onload = function() {

    const   DOMstart = document.getElementById('start'),
            DOMpruefung = document.getElementById('pruefung'),
            DOMauswertung = document.getElementById('auswertung'),
            DOMswitchToStart = document.getElementById('switchToStart'),
            DOMswitchToPruefung = document.getElementById('switchToPruefung'),
            DOMswitchToAuswertung = document.getElementById('switchToAuswertung');
            
    function switchTo(window = 'start') {
        DOMstart.hidden = DOMpruefung.hidden = DOMauswertung.hidden = true;
        DOMstart.classList.add('hid');
        DOMpruefung.classList.add('hid');
        DOMauswerung.classList.add('hid');
        console.log(`switch to ${window}`);
        
        switch (window) {
            case 'start':
                DOMstart.hidden = false;
                DOMstart.classList.remove('hid');
                break;
            case 'pruefung':
                DOMpruefung.hidden = false;
                DOMpruefung.classList.remove('hid');
                break;
            case 'auswertung':
                DOMauswertung.hidden = false;
                DOMauswertung.classList.remove('hid');
                break;
        
            default:
                break;
        }
    }

    DOMswitchToStart.onclick = () => switchTo('start');
    DOMswitchToPruefung.onclick = () => switchTo('pruefung');
    DOMswitchToAuswertung.onclick = () => switchTo('auswertung');

}