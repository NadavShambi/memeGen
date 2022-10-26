let gElCanvas
let gCtx
let gLastPos
let gImg

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    renderGallery()
}

function onChangeView(view) {
    const options = ['gallery', 'memes-gen', 'memes']
    options.forEach(op => {
        if (view === op) {
            document.querySelector(`.${op}`).classList.remove('hide')
        } else {
            document.querySelector(`.${op}`).classList.add('hide')
        }
    })

    if (view === 'memes') renderSavedMemes()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}




//UPLOAD

function onImgInp(ev) {
    loadImageFromInput(ev, renderImg)
    console.log('ev:', ev)
    console.log(ev.target);

}

// CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    // After we read the file
    console.log('reader:', reader)

    reader.onload = function (event) {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        gImg = img
        // Run the callBack func, To render the img on the canvas
        img.onload = onImageReady.bind(null, img)
        // Can also do it this way:
        // img.onload = () => onImageReady(img)

    }
    console.log('ev.target.files[0]:', ev.target.files[0])
    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}


//Gallery

function renderGallery() {
    onChangeView('gallery')
    const imgs = getImgs()
    const galleryHTML = imgs.map(img => {
        const { url } = img
        return `
      <img src="${url}" onclick="onStartNewMeme(event)">
        `
    }).join('')
    document.querySelector('.gallery').innerHTML = galleryHTML
}

function renderSavedMemes() {
    const memes = getMemes()
    console.log(memes);
    const memesHTML = memes.map(meme => {
        return `
        <img src="${meme.result}" class="img" onclick="onEditMeme('${meme.id}')">
        
        `
    }).join('')
    document.querySelector('.memes').innerHTML = memesHTML
}

// Letsss memememmemeiittttout!

function onEditMeme(id) {
    const meme = setCurrMeme(id)
    renderMemeSettings()
    renderMeme(meme)
}

function onStartNewMeme(ev) {
    const meme = createNewMeme(ev.target.src);
    renderMeme(meme)
    renderMemeSettings(meme.lines[0])
}



function renderMeme(meme) {
    onChangeView('memes-gen')
    // console.log(meme);
    renderImg(meme.img)
    renderLines(meme.lines)
    setMemeResult()
}

function renderImg(img) {
    // Draw the img on the canvas
    img = getImgElement(img)
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderLines(lines) {
    if(!lines.length) return
    lines.forEach(line => {
        const { pos, size, color, txt } = line
        writeText(pos.x, pos.y, size, color, txt)
    })
}

function writeText(x, y, size, color, txt) {
    if (!txt) txt = 'Text Here!'
    gCtx.font = `${size}px Ariel`
    gCtx.fillStyle = color
    gCtx.fillText(txt, x, y)
}

function onChangeText(text) {
    const meme = changeText(text)
    renderMeme(meme)
}

function onSetColor(color) {
    const meme = setColor(color)
    renderMeme(meme)
}

function onSetFontSize(size) {
    const meme =setFontSize(size)
    renderMeme(meme)
}

function onAddLine(){
    const meme = addLine()
    renderMemeSettings()
    renderMeme(meme)
}
function onDeleteLine(){
    const meme = deleteLine()
    renderMemeSettings()
    renderMeme(meme)
}

function onSetChosenLine() {
    const meme = setChosenMeme()
    renderMemeSettings()
}

function onDeleteMeme(){
    deleteMeme()
    renderGallery()
}

function downloadImg(elLink) {
    // image/jpeg the default format
    console.log(elLink);
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function getCanvasImgLink() {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    return imgContent
}



function renderMemeSettings() {
    const {lines,selectedLineIdx} = getCurrMeme()
    const line = lines[selectedLineIdx]

    const fontSize = document.querySelector('.font-size')
    const fontColor = document.querySelector('.font-color')
    const txt = document.querySelector('.meme-txt')

    if(line){
        fontSize.value = line.size
        fontColor.value = line.color
        txt.value = line.txt
    }else{
        fontSize.value = 40
        fontColor.value = '#000000'
        txt.value = ''
    }

}

function getImgElement(src){

const img = new Image()

img.src = src


return img

}