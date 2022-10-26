'use strict'

const IMAGES_KEY = 'imagesDB'
const MEMES_KEY = 'memeDB'

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

var gImgs = loadFromStorage(IMAGES_KEY) || _createImgs()

var gMemes = loadFromStorage(MEMES_KEY) || []

var gCurrMeme
// MVC IMGS


function getImgs() {
  return gImgs
}
function getMemes(){
  return gMemes
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
    id:getRandomId(),
    img,
    selectedLineIdx: 0,
    lines: [
      {
        txt:'',
        size: 40,
        pos: {x:calcCenterBaseTextX('top text', 40),y:100},
        color: '#000000',
        isDarg: false
      },
      {
        txt:'',
        size: 30,
        pos: {x:calcCenterBaseTextX('top text', 40),y:500},
        color: '#0000ff',
        isDarg: false
      },
    ]
  }
  gCurrMeme = meme
  return meme
}


function saveMeme(){
  gMemes.push(gCurrMeme)
  saveToStorage(MEMES_KEY, gMemes)
}

function calcCenterBaseTextX(txt, size) {
  const center = (gElCanvas.width / 2) - (txt.length * (size / 5))
  return center
}

function getCurrMeme(){
  return gCurrMeme
}





function _createImgs() {
  return [
    { id: 1, url: './img1/1.jpg', keywords: ['funny', 'man'] },
    { id: 2, url: './img1/2.jpg', keywords: ['funny', 'dog'] },
    { id: 3, url: './img1/3.jpg', keywords: ['funny', 'dog', 'baby'] },
    { id: 4, url: './img1/4.jpg', keywords: ['funny', 'cat'] },
    { id: 5, url: './img1/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: './img1/6.jpg', keywords: ['funny', 'man'] },
    { id: 7, url: './img1/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: './img1/8.jpg', keywords: ['funny', 'man'] },
    { id: 9, url: './img1/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: './img1/10.jpg', keywords: ['funny', 'man'] },
    { id: 11, url: './img1/11.jpg', keywords: ['funny', 'man'] },
    { id: 12, url: './img1/12.jpg', keywords: ['funny', 'man'] },
    { id: 13, url: './img1/13.jpg', keywords: ['funny', 'man'] },
    { id: 14, url: './img1/14.jpg', keywords: ['funny', 'man'] },
    { id: 15, url: './img1/15.jpg', keywords: ['funny', 'man'] },
    { id: 16, url: './img1/16.jpg', keywords: ['funny', 'man'] },
    { id: 17, url: './img1/17.jpg', keywords: ['funny', 'man'] },
    { id: 18, url: './img1/18.jpg', keywords: ['funny', 'man'] },
    // { id: 19, url: './img1/19.jpg', keywords: ['funny', 'man'] },
    // { id: 20, url: './img1/20.jpg', keywords: ['funny', 'man'] },
    // { id: 21, url: './img1/21.jpg', keywords: ['funny', 'man'] },
    // { id: 22, url: './img1/22.jpg', keywords: ['funny', 'woman'] },
    // { id: 23, url: './img1/23.jpg', keywords: ['funny', 'man'] },
    // { id: 24, url: './img1/24.jpg', keywords: ['funny', 'man'] },
    // { id: 25, url: './img1/25.jpg', keywords: ['funny', 'man'] },
  ]
}