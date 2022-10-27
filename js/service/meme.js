'use strict'

const IMAGES_KEY = 'imagesDB'
const MEMES_KEY = 'memeDB'

var gImgs = loadFromStorage(IMAGES_KEY) || _createImgs()
var gMemes = loadFromStorage(MEMES_KEY) || []
var gCurrMeme
var gCategories = createCategories()

function getFilteredCategories(txt=''){
  const categories = gCategories.filter(c=>c.includes(txt))
  return categories
}

function getFilteredImgs(categories){
  const imgs = gImgs.filter(img=>{
    return img.keywords.some(key=>categories.includes(key))
  })
  return imgs
}

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
        pos: { x: calcCenterBaseWidthX(360.05859375), y: 80 },
        color: '#ffffff',
        drag: false,
        width: 360.05859375
      },
      {
        txt: '',
        size: 60,
        pos: { x: calcCenterBaseWidthX(360.05859375), y: gElCanvas.height - 20 },
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
  const center = (gElCanvas.width / 2) - (width / 3)
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

function addLine(txt='') {
  const line = {
    txt,
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

function createCategories() {

  const categories = []
  gImgs.forEach(img => {
    img.keywords.forEach(word => {
      const isDup = categories.includes(word)
      if (!isDup) {
        categories.push(word)
      }
    })
  })
  return categories
}

function _createImgs() {
  return [
    { id: 1, url: './img/1.jpg', keywords: ['funny', 'woman', 'mountains'] },
    { id: 2, url: './img/2.jpg', keywords: ['funny', 'man', 'politics'] },
    { id: 3, url: './img/3.jpg', keywords: ['funny', 'dog', 'pet', 'cute'] },
    { id: 4, url: './img/4.jpg', keywords: ['funny', 'baby', 'cute'] },
    { id: 5, url: './img/5.jpg', keywords: ['funny', 'baby', 'dog', 'pet', 'cute'] },
    { id: 6, url: './img/6.jpg', keywords: ['funny', 'cat', 'pet', 'cute'] },
    { id: 7, url: './img/7.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 8, url: './img/8.jpg', keywords: ['funny', 'baby', 'LOL'] },
    { id: 9, url: './img/9.jpg', keywords: ['funny', 'man', 'point'] },
    { id: 10, url: './img/10.jpg', keywords: ['funny', 'man', 'WTF'] },
    { id: 11, url: './img/11.jpg', keywords: ['funny', 'man', 'moveis', 'LOL'] },
    { id: 12, url: './img/12.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 13, url: './img/13.jpg', keywords: ['funny', 'baby', 'dance', 'LOL'] },
    { id: 14, url: './img/14.jpg', keywords: ['funny', 'man', 'politics'] },
    { id: 15, url: './img/15.jpg', keywords: ['funny', 'baby', 'cute'] },
    { id: 16, url: './img/16.jpg', keywords: ['funny', 'dog', 'pet', 'cute'] },
    { id: 17, url: './img/17.jpg', keywords: ['funny', 'man', 'politics'] },
    { id: 18, url: './img/18.jpg', keywords: ['funny', 'man'] },
    { id: 19, url: './img/19.jpg', keywords: ['funny', 'man', 'movies', 'Cheers'] },
    { id: 20, url: './img/20.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 21, url: './img/21.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 22, url: './img/22.jpg', keywords: ['funny', 'woman', 'movies'] },
    { id: 23, url: './img/23.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 24, url: './img/24.jpg', keywords: ['funny', 'man', 'politics'] },
    { id: 25, url: './img/25.jpg', keywords: ['funny', 'man', 'movies'] },
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