const RENDER_TO_DOM = Symbol('render to dom')

export function createElement (type, attrs, ...children) {
  let e;
  if(typeof type === 'string') {
    e = new ElementWrapper(type)
  } else {
    e = new type
  }

  for (const key in attrs) {
    e.setAttribute(key, attrs[key])
  }
  let insertChild = (children) => {
    for (const child of children) {
      if(typeof child == 'string') {
        child = new TextWrapper(child)
      }
      if(child === null) {
        continue
      }
      if(Object.prototype.toString.call(child) == "[object Array]") {
        insertChild(child)
      } else e.appendChild(child)
      
    }
  }
  insertChild(children)
  return e
}



class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    // 匹配以on开头的事件
    if(name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
    } else {
      if(name === 'className') {
        this.root.setAttribute('class', value)
      } else this.root.setAttribute(name, value)
    }
  }
  appendChild(component) {
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    
    component[RENDER_TO_DOM](range)
  }
  [RENDER_TO_DOM] (range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
  
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM] (range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.props      = Object.create(null)
    this.children   = []
    this._root      = null
    this._range     = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  /**
   *    创建Component 传一个Element 位置不够精确 不一定在最后查一个Component
   *    所以用range API 有起始点的插入
   *    不再用root
   *    从 取一个元素 变成 渲染进一个 Range
   */
  [RENDER_TO_DOM] (range) {
    this._range = range
    this.render()[RENDER_TO_DOM](range)
  }
  /**
   * 重新绘制
   */

  rerender() {
    let oldRange = this._range
    let range = document.createRange()
    range.setStart(this._range.startContainer, this._range.startOffset)
    range.setEnd(this._range.startContainer, this._range.startOffset)
    this[RENDER_TO_DOM](range)
    
    oldRange.setStart(range.endContainer, range.endOffset)
    oldRange.deleteContents()


  }

  setState (newState) {
    if(this.state === null || typeof this.state !== "object") {
      this.state = newState
      this.rerender()
      return
    }
    let merge = (oldState, newState) => {
      for(let p in newState) {
        if(oldState[p] === null || typeof oldState[p] !== "object") {
          oldState[p] = newState[p]
        } else {
          merge(oldState[p], newState[p])
        }
      }
    }
    
    merge(this.state, newState)
    this.rerender()
  }
}

export function render(component, parentElement) {
  let range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[RENDER_TO_DOM](range)
}