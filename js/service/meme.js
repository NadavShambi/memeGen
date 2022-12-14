'use strict'

const IMAGES_KEY = 'imagesDB'
const MEMES_KEY = 'memeDB'

var gImgs = loadFromStorage(IMAGES_KEY) || _createImgs()
var gMemes = loadFromStorage(MEMES_KEY) || []
var gCurrMeme
var gCategories = createCategories()

function getFilteredCategories(txt = '') {
  const categories = gCategories.filter(c => c.includes(txt))
  return categories
}

function getFilteredImgs(categories) {
  const imgs = gImgs.filter(img => {
    return img.keywords.some(key => categories.includes(key))
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

function createMeme(img) {

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
        color: ['#ffffff', '#999999', '#ffffff'],
        drag: false,
        width: 360.05859375,
        font: 'impact'
      },
      {
        txt: '',
        size: 60,
        pos: { x: calcCenterBaseWidthX(360.05859375), y: gElCanvas.height - 20 },
        color: ['#ffffff', '#999999', '#ffffff'],
        drag: false,
        width: 360.05859375,
        font: 'impact'
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

function setColor(color, idx) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].color[idx] = color
  return gCurrMeme
}

function setFontSize(size) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].size = +size
  return gCurrMeme
}

function setChosenLine(idx) {
  if (!isNaN(idx)) {
    gCurrMeme.selectedLineIdx = idx
    return
  }
  gCurrMeme.selectedLineIdx++
  if (gCurrMeme.selectedLineIdx === gCurrMeme.lines.length) gCurrMeme.selectedLineIdx = 0
  return gCurrMeme
}

function setMemeResult() {
  gCurrMeme.result = getCanvasImgLink()
  saveMemes()
}

function addLine(txt = '') {
  const line = {
    txt,
    size: 80,
    pos: { x: calcCenterBaseWidthX(360.05859375), y: gElCanvas.height / 2 + 20 },
    color: ['#eeeeee', '#999999', '#eeeeee'],
    drag: false,
    width: 360.05859375,
    font: 'Impact'
  }
  gCurrMeme.lines.push(line)
  gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1
  return gCurrMeme
}

function changeFont(font) {
  if (!gCurrMeme.lines) return
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].font = font
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
    { url: './img/png1.png', keywords: ['funny', 'woman', 'baby', 'choises'] },
    { url: './img/png2.png', keywords: ['funny', 'cartoons', 'truth'] },
    { url: './img/png3.png', keywords: ['funny', 'man'] },
    { url: './img/png4.png', keywords: ['funny', 'man', 'LOL'] },
    { url: './img/png6.png', keywords: ['funny', 'baby'] },
    { url: './img/png7.png', keywords: ['funny', 'man'] },
    { url: './img/26.jpg', keywords: ['funny', 'man', 'drake', 'choises'] },
    { url: './img/png8.png', keywords: ['funny', 'man'] },
    { url: './img/png9.png', keywords: ['funny', 'man'] },
    { url: './img/png10.png', keywords: ['funny', 'woman'] },
    { id: 28, url: './img/28.jpg', keywords: ['funny', 'man', 'woman'] },
    { id: 29, url: './img/29.jpg', keywords: ['funny', 'cartoons'] },
    { id: 30, url: './img/30.jpg', keywords: ['funny', 'man', 'game'] },
    { id: 31, url: './img/31.jpg', keywords: ['funny', 'car', 'choises'] },
    { id: 32, url: './img/32.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 33, url: './img/33.jpg', keywords: ['funny', 'man', 'prove'] },
    { id: 34, url: './img/34.jpg', keywords: ['funny', 'man', 'movies', 'cartoons'] },
    { url: './img/png5.png', keywords: ['funny', 'man', 'LOL'] },
    { id: 35, url: './img/35.jpg', keywords: ['funny', 'man'] },
    { id: 36, url: './img/36.jpg', keywords: ['funny', 'man', 'movies', 'cartoons', 'superhero'] },
    { id: 37, url: './img/37.jpg', keywords: ['funny', 'brain'] },
    { id: 38, url: './img/38.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 39, url: './img/39.jpg', keywords: ['funny', 'button', 'choises'] },
    { id: 40, url: './img/40.jpg', keywords: ['funny', 'baby', 'its fine'] },
    { id: 41, url: './img/41.jpg', keywords: ['funny', 'cat', 'woman', 'LOL'] },
    { id: 42, url: './img/42.jpg', keywords: ['funny', 'man', 'movies', 'thinking'] },
    { id: 43, url: './img/43.jpg', keywords: ['funny', 'cartoons', 'movies'] },
    { id: 44, url: './img/44.jpg', keywords: ['funny', 'man', 'woman'] },
    { id: 45, url: './img/45.jpg', keywords: ['funny', 'man', 'movies', 'cartoons'] },
    { id: 46, url: './img/46.jpg', keywords: ['funny', 'cartoons', 'movies'] },
    { id: 47, url: './img/47.jpg', keywords: ['funny', 'man'] },
    { id: 48, url: './img/48.jpg', keywords: ['funny', 'woman'] },
    { id: 49, url: './img/49.jpg', keywords: ['funny', 'man', 'thinking', 'cartoons'] },
    { id: 50, url: './img/50.jpg', keywords: ['funny', 'man', 'fail'] },
    { id: 51, url: './img/51.jpg', keywords: ['funny', 'man'] },
    { id: 51, url: './img/52.jpg', keywords: ['funny', 'man'] },
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
    { id: 14, url: './img/14.jpg', keywords: ['funny', 'man', 'politics', 'LOL'] },
    { id: 15, url: './img/15.jpg', keywords: ['funny', 'baby', 'cute'] },
    { id: 16, url: './img/16.jpg', keywords: ['funny', 'dog', 'pet', 'cute'] },
    { id: 17, url: './img/17.jpg', keywords: ['funny', 'man', 'politics', 'LOL'] },
    { id: 18, url: './img/18.jpg', keywords: ['funny', 'man'] },
    { id: 19, url: './img/19.jpg', keywords: ['funny', 'man', 'movies', 'Cheers'] },
    { id: 20, url: './img/20.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 21, url: './img/21.jpg', keywords: ['funny', 'man', 'movies'] },
    { id: 22, url: './img/22.jpg', keywords: ['funny', 'woman', 'movies'] },
    { id: 23, url: './img/23.jpg', keywords: ['funny', 'man', 'movies', 'LOL'] },
    { id: 24, url: './img/24.jpg', keywords: ['funny', 'man', 'politics'] }
  ]
}

function saveMemes() {
  saveToStorage(MEMES_KEY, gMemes)
}

function moveText(dx, dy) {
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x += dx
  gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.y += dy
  return gCurrMeme
}

function setTextDrag(isDrag, idx) {
  gCurrMeme.lines[idx].drag = isDrag
}

function getSelectedLine() {
  return gCurrMeme.lines[gCurrMeme.selectedLineIdx]
}