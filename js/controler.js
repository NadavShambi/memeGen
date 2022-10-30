let gElCanvas
let gCtx
let gCurrImg

let gStartPos


const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
    renderCategories()
    addListeners()
}

function onChangeView(view) {
    closeMenu()
    const options = ['gallery-container', 'memes-gen', 'memes']
    options.forEach(op => {
        if (view === op) {
            document.querySelector(`.${op}`).classList.remove('hide')
        } else {
            document.querySelector(`.${op}`).classList.add('hide')
        }
    })

    if (view === 'memes') renderSavedMemes()
}

function resizeCanvas(imgH = gCurrImg.height, imgW = gCurrImg.width) {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = imgH * gElCanvas.width / imgW
}


//UPLOAD

function onImgInp(ev) {
    onChangeView('memes-gen')
    loadImageFromInput(ev, onUploadNewImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = onImageReady.bind(null, img.src)

    }
    reader.readAsDataURL(ev.target.files[0])
}

function onUploadNewImg(src) {
    const img = getImgElement(src)
    gCurrImg = img
    resizeCanvas(img.height, img.width)
    const meme = createMeme(src);
    renderMeme(meme)
    renderMemeSettings()
}

function onActive(active) {
    const options = ['mem', 'gal']
    options.forEach(option => {
        if (option === active) {
            document.querySelector(`.${option}`).classList.add('active')
        } else {
            document.querySelector(`.${option}`).classList.remove('active')
        }
    })
}

//Gallery

function renderGallery(filtered) {
    onChangeView('gallery-container')
    let imgs = getImgs()
    if (filtered) imgs = filtered
    const galleryHTML = imgs.map(img => {
        const { url } = img
        return `
      <img src="${url}" onclick="onStartNewMeme(event);onActive()">
        `
    }).join('')
    document.querySelector('.gallery').innerHTML = galleryHTML
}

function renderCategories(input = '') {
    const categories = getFilteredCategories(input)
    const imgs = getFilteredImgs(categories)
    const datalist = document.querySelector('#category')
    const catHTML = categories.map(cat => {
        return `
        <option value="${cat}"></option>
        `
    }).join('')
    datalist.innerHTML = catHTML
    renderGallery(imgs)
}

function renderSavedMemes() {
    const memes = getMemes()
    let memesHTML
    if (!memes.length) {
        memesHTML = `
        <div class="no-memes full">
        <img src ="./icon/oops.png">
        <h1>There are no saved memes yet</h1>
        <h2>Back to <a onclick="onChangeView('gallery-container');onActive('gal')">Gallery</a></h2>
        </div>
        `
    } else {
        memesHTML = memes.map(meme => {
            return `
            <img src="${meme.result}" class="img" onclick="onEditMeme('${meme.id}')">
            
            `
        }).join('')
    }
    document.querySelector('.memes').innerHTML = memesHTML
}

// Letsss memememmemeiittttout!

function onEditMeme(id) {
    const meme = setCurrMeme(id)
    const img = getImgElement(meme.img)
    gCurrImg = img
    onActive()

    onChangeView('memes-gen')
    resizeCanvas(img.height, img.width)
    renderMemeSettings()
    renderMeme(meme)
}

function onStartNewMeme(ev) {
    const img = getImgElement(ev.target.src)
    gCurrImg = img
    onChangeView('memes-gen')
    resizeCanvas(img.height, img.width)
    const meme = createMeme(ev.target.src);
    renderMeme(meme)
    renderMemeSettings()
}

function renderMeme(meme, save = '') {
    renderImg(meme.img)
    renderLines(meme.lines, save)
    setMemeResult()
}

function renderImg(imgSrc) {
    // Draw the img on the canvas
    const elImg = getImgElement(imgSrc)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderLines(lines, save = '') {
    const meme = getCurrMeme()

    if (!lines.length) return
    lines.forEach((l, idx) => {
        const { pos, size, color, txt, font } = l
        const width = writeText(pos.x, pos.y, size, color, txt, font)
        updateTextWidth(idx, width)
        if (idx === meme.selectedLineIdx && !save) drawBorder(l)
    })
}

function onChangeFont(font) {
    const meme = changeFont(font)
    renderMeme(meme)
}

function writeText(x, y, size, color, txt, font) {
    if (!txt) txt = 'Text Here!'
    const gradient = gCtx.createLinearGradient(x, y, x + gCtx.measureText(txt).width, y - size);
    gradient.addColorStop("0", color[0]);
    gradient.addColorStop("0.5", color[1]);
    gradient.addColorStop("1.0", color[2]);
    gCtx.fillStyle = gradient
   
    gCtx.setLineDash([]);

    if(x + gCtx.measureText(txt).width >= gElCanvas.width){
        const meme = getCurrMeme()
        const {lines,selectedLineIdx} = meme
        lines[selectedLineIdx].pos.x = x - 50
        renderMeme(meme)
        return
    }

    gCtx.font = `${size}px ${font}`
    gCtx.lineWidth = 1
    gCtx.strokeStyle = '#000'
    gCtx.letterSpacing = '3px'
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
    return gCtx.measureText(txt).width
}

function onChangeText(text) {
    const meme = changeText(text)
    renderMeme(meme)
}

function onSetColor(color, idx) {
    const meme = setColor(color, idx)
    color = meme.lines[meme.selectedLineIdx].color
    renderColorRange(color)
    renderMeme(meme)
}

function renderColorRange(color) {
    const range = document.querySelector('.color-range')
    range.style.background = `linear-gradient(to right,${color[0]},${color[1]},${color[2]})`
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
function onAddEmoji(txt) {
    const meme = addLine(txt.innerText)
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
    renderMeme(meme)
}
function onAlignLeft() {
    const meme = alignLeft()
    renderMeme(meme)
}
function onAlignRight() {
    const meme = alignRight()
    renderMeme(meme)
}
function onAlignCenter() {
    const meme = alignCenter()
    renderMeme(meme)
}

function onDeleteMeme() {
    deleteMeme()

    onActive('mem')
    onChangeView('memes')
}

function downloadImg(elLink) {
    // image/jpeg the default format
    const meme = getCurrMeme()
    renderMeme(meme, true)
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
    const fontColor0 = document.querySelector('.font-color0')
    const fontColor1 = document.querySelector('.font-color1')
    const fontColor2 = document.querySelector('.font-color2')
    const txt = document.querySelector('.meme-txt')
    const font = document.querySelector('.font-family')

    if (line) {
        fontSize.value = line.size
        fontColor0.value = line.color[0]
        fontColor1.value = line.color[1]
        fontColor2.value = line.color[2]
        txt.value = line.txt
        font.value = line.font
    } else {
        fontSize.value = 40
        fontColor0.value = '#ffffff'
        fontColor1.value = '#999999'
        fontColor2.value = '#ffffff'
        txt.value = ''
        font.value = 'impact'

    }
    renderColorRange(line.color)

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
    addWindowListeners()
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

function addWindowListeners() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1200) document.querySelector('body').classList.remove('menu-open')
        if (!gCurrImg) return
        resizeCanvas()
        const meme = getCurrMeme()
        if(!meme)return
        renderMeme(meme)
    })
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const meme = getCurrMeme()
    meme.lines.forEach((l, idx) => {
        if (!isTextClicked(pos, l)) return
        setChosenLine(idx)
        renderMemeSettings()
        setTextDrag(true, idx)
        gElCanvas.style.cursor = 'grabbing'
    })
    gStartPos = pos

}

function onMove(ev) {
    const meme = getCurrMeme()
    // pos.x - 5, pos.y - size - 5, width + 15, size + 15

    meme.lines.forEach(line => {
        if (!line.drag) return
        let { pos, width, size } = line

        const curPos = getEvPos(ev)

        let dx = curPos.x - gStartPos.x
        let dy = curPos.y - gStartPos.y
        // if (pos.x < 5 || pos.x + width > gElCanvas.width - 5) 

        if (pos.x < 7.5) dx = 1
        else if (pos.x + width > gElCanvas.width - 7.5) dx = -1

        if (pos.y > gElCanvas.height - 7.5) dy = -1
        else if (pos.y - size < 7.5) dy = 1

        moveText(dx, dy)
        gStartPos = curPos
    })
    renderMeme(meme)
}

function onUp() {
    const meme = getCurrMeme()
    meme.lines.forEach((line, idx) => {
        setTextDrag(false, idx)
    })
    gElCanvas.style.cursor = 'grab'
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isTextClicked(clickedPos, t) {
    let { pos, size, width } = t
    return (clickedPos.x >= pos.x - 5 && clickedPos.x <= pos.x + width + 15 && clickedPos.y <= pos.y - 5 && clickedPos.y >= pos.y - size - 15)
}

function onMenu() {
    document.querySelector('body').classList.toggle('menu-open')
}

function closeMenu() {
    document.querySelector('body').classList.remove('menu-open')
}

function drawBorder(line) {
    const { pos, width, size } = line
    gCtx.setLineDash([18,18]);
    gCtx.lineWidth = 5
    gCtx.strokeStyle = '#ffffff'
    gCtx.strokeRect(pos.x - 5, pos.y - size - 5, width + 15, size + 15)
    gCtx.closePath()
}

function uploadImg() {
    const meme = getCurrMeme()
    renderMeme(meme, true)
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")

    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        // Create a link that on click will make a post in facebook with the image we uploaded
        const link = `
      <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
      <img src="./icon/facebook.png" >
      </a>`
        openModal(link)
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function openModal(link) {
    document.querySelector('.modal').classList.add('open')
    const img = getCurrMeme()
    renderModal(img.result, link)
    // document.querySelector('.share-container').innerHTML = link
}

function closeModal() {
    document.querySelector('.modal').classList.remove('open')
}

function renderModal(result, link) {
    const innerHTML = `
    <div class="flex col align-center" onclick="muhahaha(event)">
        <img class="modal-img" src="${result}" alt="">
        <div class="social-share flex space-around">
            ${link}
            <a  title="coming soon"><img src="./icon/whatsapp.png" ></a>
            <a  title="coming soon"><img src="./icon/linkedin.png" ></a>
            <a  title="coming soon"><img src="./icon/twitter.png"></a>
         </div>
        <small></small>
    </div>
    `
    document.querySelector('.user-msg').innerHTML = innerHTML
    // document.querySelector('.share-container').innerHTML = link
}

function muhahaha(e) {
    e.stopPropagation()
}

function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {

        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR

        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

