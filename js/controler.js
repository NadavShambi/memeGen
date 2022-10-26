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
    const options = ['gallery', 'memes']
    options.forEach(op => {
        if (view === op) {
            document.querySelector(`.${op}`).classList.remove('hide')
        } else {
            document.querySelector(`.${op}`).classList.add('hide')
        }
    })

}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onLastImg() {
    renderImg(gImg)
}

// DOWNLOAD

function downloadImg(elLink) {
    // image/jpeg the default format
    console.log(elLink);
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    console.log('imgContent:', imgContent)
    elLink.href = imgContent
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



function renderImg(img) {
    // Draw the img on the canvas
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}



//Gallery

function renderGallery() {
    const imgs = getImgs()
    const galleryHTML = imgs.map(img => {
        const { url, id } = img
        return `
      <img src=".${url}" onclick="onStartNewMeme(event)">
        `
    }).join('')
    document.querySelector('.gallery').innerHTML = galleryHTML
}

function onStartNewMeme(ev) {
    const meme = createNewMeme(ev.target)
    renderMeme(meme)
}

function renderMeme(meme){
    onChangeView('memes')
    // console.log(meme);
    renderImg(meme.img)
    renderLines(meme.lines)
}

function renderLines(lines){
    lines.forEach(line=>{
        console.log(line);
        const {pos,size,color,txt} = line
        writeText(pos.x,pos.y,size,color,txt)
    })
}
function writeText(x,y,size,color,txt){
    gCtx.font = `${size}px Ariel`
    gCtx.fillStyle = color
    gCtx.fillText(txt,x,y)
  }