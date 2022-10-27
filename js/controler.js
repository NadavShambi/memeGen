let gElCanvas
let gCtx
let gLastPos

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    // resizeCanvas()
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

function resizeCanvas(imgH, imgW) {
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
    console.log('reader:', reader)

    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = onImageReady.bind(null, img.src)

    }
    console.log('ev.target.files[0]:', ev.target.files[0])
    reader.readAsDataURL(ev.target.files[0])
}

function onUploadNewImg(src) {
    const meme = createNewMeme(src);
    renderMeme(meme)
    renderMemeSettings(meme.lines[0])
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
    onChangeView('memes-gen')
    renderMemeSettings()
    renderMeme(meme)
}

function onStartNewMeme(ev) {
    img = getImgElement(ev.target.src)
    onChangeView('memes-gen')
    resizeCanvas(img.height, img.width)
    const meme = createNewMeme(ev.target.src);
    renderMeme(meme)
    renderMemeSettings(meme.lines[0])
}

function renderMeme(meme) {
    // console.log(meme);
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
    lines.forEach((line, idx) => {
        const { pos, size, color, txt } = line
        const width = writeText(pos.x, pos.y, size, color, txt)
        updateTextWidth(idx, width)
    })
}

function writeText(x, y, size, color, txt, font = 'Impact') {
    if (!txt) txt = 'Text Here!'

    gCtx.font = `600 ${size}px ${font}`
    gCtx.fillStyle = color
    gCtx.fillText(txt, x, y)
    gCtx.fillStyle = '#000000'
    gCtx.lineWidth = 1
    gCtx.strokeText(txt, x, y)
    return gCtx.measureText(txt).width
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
    const pos = getEvPos(ev)
    const meme = getCurrMeme()
    meme.lines.forEach((t, idx) => {
        if (!isTextClicked(pos, t)) return
        setChosenLine(idx)
        renderMemeSettings()
        setTextDrag(true, idx)
        gElCanvas.style.cursor = 'grabbing'
    })
    gStartPos = pos
}

function onMove(ev) {
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
    return (clickedPos.x >= pos.x && clickedPos.x <= pos.x + width && clickedPos.y <= pos.y && clickedPos.y >= pos.y - size)
}

function onMenu() {
    document.querySelector('body').classList.toggle('menu-open')
}

function closeMenu(){
    document.querySelector('body').classList.remove('menu-open')
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 1200) document.querySelector('body').classList.remove('menu-open')
})

function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")
  
    function onSuccess(uploadedImgUrl) {
      // Encode the instance of certain characters in the url
      const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
      console.log(encodedUploadedImgUrl)
      
      // Create a link that on click will make a post in facebook with the image we uploaded
      const link = `
      <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
      Share   
      </a>`
      openModal(link)
    }
    doUploadImg(imgDataUrl, onSuccess)
  }
  
  function openModal(link){
    document.querySelector('.modal').classList.add('open')
    document.querySelector('.user-msg').innerText = `Your photo is available here: `
    document.querySelector('.share-container').innerHTML = link
  }
  
  function closeModal(){
    document.querySelector('.modal').classList.remove('open')
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
  
      console.log('Got back live url:', url)
      onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
      console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
  }