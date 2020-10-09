// ==UserScript==
// @name         Tabun Lightbox
// @include      https://tabun.everypony.*
// @version      0.2.1
// @description  limit images size to 50vh, adds lightbox
// @author       badunius
// @match        https://tampermonkey.net/index.php?version=4.8&ext=dhdg&updated=true
// @grant        none
// @downloadURL  https://github.com/badunius/tabun-lightbox/raw/main/lightbox.user.js
// @updateURL    https://github.com/badunius/tabun-lightbox/raw/main/lightbox.user.js
// @run-at       document-end
// ==/UserScript==

const app = {
	title: null,
  current: null,
  image: null,
  origin: null,
  next: null,
  prev: null,
}

const rule = [
  '.text img { max-height: 50vh; }',
  '.text img[width] { max-height: unset; }',
  '.text a img { max-height: initial; }',
  'img.full { max-height: 92vh; max-width: 92vw; cursor: zoom-out; }',
  'div.lightbox {position: fixed; background: #333a; width: 100%; height: 100vh; top: 0; left: 0; z-index: 1000; display: grid; grid-template-columns: 4vmin auto 4vmin; color: #fff; }',
  'div.lightbox .side { font-size: 4vmin; font-weight: 900; cursor: pointer; user-select: none; }',
  'div.lightbox .side:hover { background: #fff6; text-shadow: 0 0 2vmin #000; }',
  'div.lightbox .main { font-size: 2vmin; font-weight: 500; display: grid; grid-template-rows: 4vmin auto 4vmin; }',
  'div.lightbox .main { font-size: 2vmin; font-weight: 500; display: grid; grid-template-rows: 4vmin auto 4vmin; }',
  'div.lightbox .item { display: grid; place-content: center; }',
  'div.lightbox a.item { color: #fff; }',
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

const isTarget = (element) => {
  return element.matches('.text img') && !element.matches('.spoiler-title img') && !element.matches('a img')
}

const findImages = () => [...(document.querySelectorAll('.text img'))]
const currentIndex = (list = findImages()) => list.findIndex(img => img === app.current)

const onUpdate = () => {
	app.image.src = app.current.src
  
  // title
  const list = findImages()
  const index = currentIndex(list)
  app.title.textContent = `${index + 1}/${list.length}`
  
  // origin link
  const {
    naturalWidth,
    naturalHeight
  } = app.current
  app.origin.innerHTML = `${naturalWidth}&times;${naturalHeight}`
  app.origin.href = app.current.src
}

const onNext = () => {
	const list = findImages()
  let index = currentIndex(list)
  index = (index + 1 + list.length) % list.length
  app.current = list[index]
  onUpdate()
}

const onPrev = () => {
	const list = findImages()
  let index = currentIndex(list)
  index = (index - 1 + list.length) % list.length
  app.current = list[index]
  onUpdate()
}

const onScroll = (evt) => {
  	evt.preventDefault()
    const { deltaY = 0 } = evt
    
    switch(true) {
      case deltaY > 0: {
        onNext()
        return
      }
      case deltaY < 0: {
        onPrev()
        return
      }
    }
  }

const showLightbox = (img) => {
  const host = cel('div')
  host.className = 'lightbox'
  // host.onclick = () => host.remove()

  const prev = cel('div', host)
  prev.innerHTML = '&lang;'
  prev.className = 'side item'
  prev.onclick = onPrev
  
  const main = cel('div', host)
  main.className = 'main'
  
  const next = cel('div', host)
  next.innerHTML = '&rang;'
  next.className = 'side item'
  next.onclick = onNext
  
  
  const title = cel('div', main);
  title.className = 'item'
  title.textContent = '7/12'
  
  const container = cel('div', main)
  container.className = 'item'
  container.onwheel = onScroll
  
  const zoomed = cel('img', container)
  zoomed.className = 'full'
  zoomed.src = img.src
  zoomed.style.cursor = 'zoom-out'
  zoomed.onclick = () => host.remove()
  
  const original = cel('a', main)
  original.className = 'item'
  original.textContent = 'link'
  original.setAttribute('target', '_blank')
  
  app.title = title
  app.current = img
  app.image = zoomed
  app.origin = original
  app.next = next
  app.prev = prev

  onUpdate()
  
  console.log(app)
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
    showLightbox(target)
  }
}

document.addEventListener('mouseover', onHover)
document.addEventListener('click', onClick)
