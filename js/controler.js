// const width = gCtx.measureText(txt).width


let gElCanvas
let gCtx
let gLastPos

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    renderGallery()
    addListeners()
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
    // console.log('ev:', ev)
    // console.log(ev.target);

}

// CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    // After we read the file
    console.log('reader:', reader)

    reader.onload = function (event) {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read

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
    // console.log(memes);
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
    if (!lines.length) return
    lines.forEach(line => {
        const { pos, size, color, txt } = line
        writeText(pos.x, pos.y, size, color, txt)
    })
}

function writeText(x, y, size, color, txt) {
    if (!txt) txt = 'Text Here!'

    gCtx.font = `600 ${size}px Courier New`
    gCtx.fillStyle = color
    gCtx.fillText(txt, x, y)
    gCtx.fillStyle = '#000000'
    gCtx.lineWidth = 3
    // const width = gCtx.measureText(txt).width
    gCtx.strokeText(txt, x, y)
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
    const meme = setFontSize(size)
    renderMeme(meme)
}

function onAddLine() {
    const meme = addLine()
    renderMemeSettings()
    renderMeme(meme)
}
function onDeleteLine() {
    const meme = deleteLine()
    renderMemeSettings()
    renderMeme(meme)
}

function onSetChosenLine() {
    const meme = setChosenLine()
    renderMemeSettings()
}

function onDeleteMeme() {
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
    const { lines, selectedLineIdx } = getCurrMeme()
    const line = lines[selectedLineIdx]

    const fontSize = document.querySelector('.font-size')
    const fontColor = document.querySelector('.font-color')
    const txt = document.querySelector('.meme-txt')

    if (line) {
        fontSize.value = line.size
        fontColor.value = line.color
        txt.value = line.txt
    } else {
        fontSize.value = 40
        fontColor.value = '#000000'
        txt.value = ''
    }

}

function getImgElement(src) {
    const img = new Image()
    img.src = src
    return img
}




// drag and drop


function addListeners() {
    addMouseListeners()
    addTouchListeners()
    //Listen for resize ev 

}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    // console.log('Im from onDown')
    //Get the ev pos from mouse or touch
    // console.log(ev);
    const pos = getEvPos(ev)
    // console.log('pos',pos);
    const meme = getCurrMeme()
    meme.lines.forEach((t, idx) => {
        // console.log(isTextClicked(pos, t),t);
        if (!isTextClicked(pos, t)) return
        setChosenLine(idx)
        renderMemeSettings()

        console.log(idx);
        setTextDrag(true)
        document.body.style.cursor = 'grabbing'
    })
    // console.log(ev);
    //Save the pos we start from 
    gStartPos = pos

}

function onMove(ev) {
    // console.log('Im from onMove')
    // const { isDrag } = getText()

    const meme = getCurrMeme()

    meme.lines.forEach(line => {
        if (!line.drag) return
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveText(dx, dy)
        gStartPos = pos
    })
    renderMeme(meme)
    //Calc the delta , the diff we moved
    //Save the last pos , we remember where we`ve been and move accordingly
    //The canvas is render again after every move

}

function onUp() {
    // console.log('Im from onUp')
    // console.log('clicked! UPPPP');

    const meme = getCurrMeme()
    meme.lines.forEach(line => {
        setTextDrag(false)
    })
    document.body.style.cursor = 'grab'


}


function getEvPos(ev) {

    //Gets the offset pos , the default pos
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}


function isTextClicked(clickedPos, t) {
    let { pos, size, txt } = t

    if (!txt) txt = 'Text Here!'

    return (clickedPos.x >= pos.x && clickedPos.x <= pos.x + txt.length * (size / 1.7) &&
        clickedPos.y <= pos.y && clickedPos.y >= pos.y - size)
}


