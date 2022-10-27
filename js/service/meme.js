'use strict'

const IMAGES_KEY = 'imagesDB'
const MEMES_KEY = 'memeDB'

// var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

var gImgs = loadFromStorage(IMAGES_KEY) || _createImgs()

var gMemes = loadFromStorage(MEMES_KEY) || []

var gCurrMeme
// MVC IMGS


function getImgs() {
  return gImgs
}
function getMemes() {
  return gMemes
}

function setCurrMeme(id) {
  const meme = gMemes.find(meme => meme.id === id)
  gCurrMeme = meme
  return gCurrMeme
}

function uploadImg() {
  const imgDataUrl = gElCanvas.toDataURL("image/jpeg")// Gets the canvas content as an image format

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    // Encode the instance of certain characters in the url
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    console.log(encodedUploadedImgUrl)
    document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`
    // Create a link that on click will make a post in facebook with the image we uploaded
    document.querySelector('.share-container').innerHTML = `
          <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
             Share   
          </a>`
  }
  // Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
  // Pack the image for delivery
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  // Send a post req with the image to the server
  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    // If the request is not done, we have no business here yet, so return
    if (XHR.readyState !== XMLHttpRequest.DONE) return
    // if the response is not ok, show an error
    if (XHR.status !== 200) return console.error('Error uploading image')
    const { responseText: url } = XHR
    // Same as:
    // const url = XHR.responseText

    // If the response is ok, call the onSuccess callback function, 
    // that will create the link to facebook using the url we got
    console.log('Got back live url:', url)
    onSuccess(url)
  }
  XHR.onerror = (req, ev) => {
    console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
  }
  XHR.open('POST', '//ca-upload.com/here/upload.php')
  XHR.send(formData)
}


function createNewMeme(img) {
 
  const meme = {
    id: getRandomId(),
    img,
    selectedLineIdx: 0,
    result: '',
    lines: [
      {
        txt: '',
        size: 60,
        pos: { x: calcCenterBaseWidthX(360.05859375), y: 100 },
        color: '#ffffff',
        drag: false,
        width: 360.05859375
      },
      {
        txt: '',
        size: 60,
        pos: { x: calcCenterBaseWidthX(360.05859375), y: gElCanvas.height - 100 },
        color: '#ffffff',
        drag: false,
        width: 360.05859375
      },
    ]
  }
  gCurrMeme = meme
  gMemes.push(meme)
  saveMemes()
  return meme
}

function updateTextWidth(idx, width) {
  gCurrMeme.lines[idx].width = width
}

function calcCenterBaseWidthX(width) {
  const center = (gElCanvas.width / 2) - (width / 2)
  return center
}

function getCurrMeme() {
  return gCurrMeme
}

function changeText(text) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt = text
  return gCurrMeme
}

function setColor(color) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].color = color
  return gCurrMeme
}

function setFontSize(size) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].size = size
  return gCurrMeme
}

function setChosenLine(idx) {
  if (!isNaN(idx)) {
    gCurrMeme.selectedLineIdx = idx
    return
  }
  console.log('here');
  gCurrMeme.selectedLineIdx++
  if (gCurrMeme.selectedLineIdx === gCurrMeme.lines.length) gCurrMeme.selectedLineIdx = 0
  return gCurrMeme
}

function setMemeResult() {
  gCurrMeme.result = getCanvasImgLink()
  saveMemes()
}

function addLine() {
  const line = {
    txt: '',
    size: 80,
    pos: { x: calcCenterBaseWidthX(360.05859375), y: gElCanvas.height / 2 + 20 },
    color: '#ffffff',
    drag: false,
    width: 360.05859375
  }
  gCurrMeme.lines.push(line)
  gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1
  return gCurrMeme
}

function deleteLine() {
  gCurrMeme.lines.splice(gCurrMeme.selectedLineIdx, 1)
  gCurrMeme.selectedLineIdx = 0
  return gCurrMeme
}


function deleteMeme() {
  const idx = gMemes.findIndex(meme => meme === gCurrMeme)
  gMemes.splice(idx, 1)
  gCurrMeme = undefined
}

function alignLeft() {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x = 20
  return gCurrMeme
}
function alignRight() {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x = gElCanvas.width - (gCurrMeme.lines[gCurrMeme.selectedLineIdx].width + 20)
  return gCurrMeme
}

function alignCenter() {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x = gElCanvas.width / 2 - (gCurrMeme.lines[gCurrMeme.selectedLineIdx].width / 2)
  return gCurrMeme

}

function _createImgs() {
  return [
    { id: 1, url: './img/1.jpg', keywords: ['funny', 'man'] },
    { id: 2, url: './img/2.jpg', keywords: ['funny', 'dog'] },
    { id: 3, url: './img/3.jpg', keywords: ['funny', 'dog', 'baby'] },
    { id: 4, url: './img/4.jpg', keywords: ['funny', 'cat'] },
    { id: 5, url: './img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: './img/6.jpg', keywords: ['funny', 'man'] },
    { id: 7, url: './img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: './img/8.jpg', keywords: ['funny', 'man'] },
    { id: 9, url: './img/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: './img/10.jpg', keywords: ['funny', 'man'] },
    { id: 11, url: './img/11.jpg', keywords: ['funny', 'man'] },
    { id: 12, url: './img/12.jpg', keywords: ['funny', 'man'] },
    { id: 13, url: './img/13.jpg', keywords: ['funny', 'man'] },
    { id: 14, url: './img/14.jpg', keywords: ['funny', 'man'] },
    { id: 15, url: './img/15.jpg', keywords: ['funny', 'man'] },
    { id: 16, url: './img/16.jpg', keywords: ['funny', 'man'] },
    { id: 17, url: './img/17.jpg', keywords: ['funny', 'man'] },
    { id: 18, url: './img/18.jpg', keywords: ['funny', 'man'] },
    { id: 19, url: './img/19.jpg', keywords: ['funny', 'man'] },
    { id: 20, url: './img/20.jpg', keywords: ['funny', 'man'] },
    { id: 21, url: './img/21.jpg', keywords: ['funny', 'man'] },
    { id: 22, url: './img/22.jpg', keywords: ['funny', 'woman'] },
    { id: 23, url: './img/23.jpg', keywords: ['funny', 'man'] },
    { id: 24, url: './img/24.jpg', keywords: ['funny', 'man'] },
    { id: 25, url: './img/25.jpg', keywords: ['funny', 'man'] },
  ]
}


function saveMemes() {
  saveToStorage(MEMES_KEY, gMemes)
}


function moveText(dx, dy) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x += dx
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.y += dy
}

function setTextDrag(isDrag, idx) {
  gCurrMeme.lines[idx].drag = isDrag

}