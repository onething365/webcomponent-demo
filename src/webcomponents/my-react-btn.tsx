import React, { useState } from 'react'
import { createRoot, Root } from 'react-dom/client'
const style = {
  background: 'red',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
}
type ReactBtnProps = {
  children?: React.ReactNode | string
  btnClick?: (param?: number) => void
  bgColor?: string
}
function ReactBtn({ children, btnClick, bgColor = 'red' }: ReactBtnProps) {
  const [count, setCount] = useState(1)
  const onClick = () => {
    const newCount = count + 1
    setCount(newCount)
    if (btnClick) {
      btnClick(newCount)
    }
  }
  return (
    <button style={{ ...style, background: bgColor }} onClick={onClick}>
      {children ? children : '点击我'}
      {count}
    </button>
  )
}

class MyReactButton extends HTMLElement {
  private _root: Root | null = null
  private _props: Record<string, any> = {}

  private _slotElement: HTMLSlotElement | null = null
  constructor() {
    super()
    // 创建Shadow DOM
    this.attachShadow({ mode: 'open' })
    this._root = null
    this._props = {
      bgColor: 'red',
    }
  }
  // 定义可观察属性
  static get observedAttributes() {
    return ['color', 'bgcolor']
  }

  // 属性变化回调
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('属性变化了', name, oldValue, newValue)
    if (name === 'bgcolor') {
      this._props.bgColor = newValue
      this._updateComponent()
    }
  }
  private _handleSlotChange = () => {
    this._updateComponent()
  }
  private _updateComponent() {
    // 获取slot分配的实际节点
    const assignedNodes = this._slotElement?.assignedNodes({ flatten: true }) || []

    const domToReact = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null
      }
      const element = node as HTMLElement
      const props: any = {
        key: Math.random().toString(36).substring(2, 9),
      }
      Array.from(element.attributes).forEach(attr => {
        props[attr.name] = attr.value
      })
      const children = Array.from(element.childNodes).map(domToReact).filter(Boolean)
      return React.createElement(
        element.tagName.toLowerCase(),
        props,
        children.length ? children : null,
      )
    }

    const reactChildren = assignedNodes.map(domToReact).filter(Boolean)

    const handleReactClick = (count?: number) => {
      this.dispatchEvent(
        new CustomEvent('btn-click', {
          detail: { count, message: `你点击了 ${count} 次`, element: this },
          bubbles: true,
          composed: true,
        }),
      )
    }

    if (this._root) {
      this._root.render(
        <ReactBtn btnClick={handleReactClick} bgColor={this._props.bgColor}>
          {reactChildren.length > 0 ? reactChildren : '点击我'}
        </ReactBtn>,
      )
    }
  }
  connectedCallback() {
    console.log('元素被添加到DOM')
    const mountPoint = document.createElement('div')
    this.shadowRoot?.appendChild(mountPoint)

    // 添加slot元素并监听变化
    this._slotElement = document.createElement('slot')
    this._slotElement.style.display = 'none' // 隐藏slot元素
    this.shadowRoot?.appendChild(this._slotElement)
    this._slotElement.addEventListener('slotchange', this._handleSlotChange)

    this._root = createRoot(mountPoint)
    this._updateComponent()
  }
  disconnectedCallback() {
    console.log('元素从DOM移除')
    this._slotElement?.removeEventListener('slotchange', this._handleSlotChange)
    this._slotElement = null
    this._root?.unmount()
    this._root = null
  }
  adoptedCallback() {
    console.log('元素被移动到新文档')
  }
}

export default MyReactButton
