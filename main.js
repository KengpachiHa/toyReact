function createElement (tagName, attrs, ...childElements) {
  const e = document.createElement(tagName)
  for (const key in attrs) {
    e[key] = attrs[key]
  }
  for (const child of childElements) {
    e.appendChild(child)
  }
  return e
}



window.a = 
<div id="gg" class="dd">
  <div></div>
  <div></div>
  <div></div>
</div>
