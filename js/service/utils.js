
function getRandomId(num = 6) {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = ''
    for (var i = 0; i < num; i++) {
        const idx = getRandomInt(0, letters.length)
        id += letters.charAt(idx)
    }
    return id
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

