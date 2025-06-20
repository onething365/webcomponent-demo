const template = document.createElement('template')
template.innerHTML = `
  <style>
        button {
          background: red;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
        }
      </style>
      <button><slot></slot></button>
`
export default class MyComponent extends HTMLElement {
  constructor() {
    super()
    // 创建Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' })
    // 组件模板
    shadow.innerHTML = template.innerHTML
  }
  // 点击事件处理
  handleClick() {
    // 触发自定义事件
    const clickEvent = new CustomEvent('btn-click', {
      bubbles: true,
      composed: true,
      detail: {
        timestamp: Date.now(),
        buttonText: this.textContent,
      },
    })
    this.dispatchEvent(clickEvent)

    // 原生点击行为
    console.log('按钮被点击')
  }
  // 定义可观察属性
  static get observedAttributes() {
    return ['color']
  }

  // 属性变化回调
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color') {
      console.log('属性变化了', name, oldValue, newValue)
      this.shadowRoot.querySelector('button').style.background = newValue
    }
  }
  connectedCallback() {
    console.log('元素被添加到DOM')
    this.addEventListener('click', this.handleClick)
  }
  disconnectedCallback() {
    console.log('元素从DOM移除')
    this.removeEventListener('click', this.handleClick)
  }
  adoptedCallback() {
    console.log('元素被移动到新文档')
  }
}
