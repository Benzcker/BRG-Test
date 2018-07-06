export function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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

export function hashCode() {
    let hash = 0;
    if (this.length === 0) return hash;
    for (const chr of this) {
        hash = ((hash << 5) - hash) + chr.charCodeAt(0);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export function constrain(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

export function loadJSON(url) {
    return fetch(url)
        .then(r => r.json());
}