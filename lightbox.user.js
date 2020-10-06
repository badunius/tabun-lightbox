// ==UserScript==
// @name         Tabun Lightbox
// @include      https://tabun.everypony.*
// @version      0.1.2
// @description  limit images size to 50vh, adds lightbox
// @author       badunius
// @match        https://tampermonkey.net/index.php?version=4.8&ext=dhdg&updated=true
// @grant        none
// @downloadURL  https://github.com/badunius/tabun-lightbox/raw/main/lightbox.user.js
// @updateURL    https://github.com/badunius/tabun-lightbox/raw/main/lightbox.user.js
// @run-at       document-end
// ==/UserScript==


const rule = [
  '.text img { max-height: 50vh; width: auto; }',
  '.text a img { max-height: initial; }',
  'img.full { max-height: 92vh; max-width: 92vw; cursor: zoom-out; }',
  'div.lightbox {position: fixed; background: #333a; width: 100vw; height: 100vh; top: 0; left: 0; z-index: 1000; display: grid; place-content: center; }',
]
const style = document.createElement('style')
document.body.appendChild(style)
rule.forEach(item => style.sheet.insertRule(item))
// console.log(style)

const cel = (tag, parent) => {
  const el = document.createElement(tag)
  const host = !!parent
  ? parent
  : document.body
  host.appendChild(el)
  return el
}

const isResized = (img) => {
  const {
    clientHeight,
    naturalHeight
  } = img
  return clientHeight !== naturalHeight
}

isTarget = (element) => {
  return element.matches('.text img') && !element.matches('.spoiler-title img') && !element.matches('a img')
}

const showLightbox = (img) => {
  const host = cel('div')
  host.className = 'lightbox'
  host.onclick = () => host.remove()

  const zoomed = cel('img', host)
  zoomed.className = 'full'
  zoomed.src = img.src
  zoomed.style.cursor = 'zoom-out'

  console.log(host)
}

onHover = (evt) => {
  const { target } = evt
  if (!isTarget(target)) return

  target.style.cursor = isResized(target)
    ? 'zoom-in'
  : 'inherited'
}

onClick = (evt) => {
  const { target } = evt
  if (!isTarget(target)) return

  if (isResized(target)) {
    console.log('ZOOMING')
    showLightbox(target)
  }
}

document.addEventListener('mouseover', onHover)
document.addEventListener('click', onClick)
