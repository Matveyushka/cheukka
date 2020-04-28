import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale } from '../../utils'
import { setTextSettings } from '../../actions'
import { START_SCALE } from '../../constants'
import { TextSettings } from '../../types/Settings/TextSettings'

export interface EntityContentEditorProps {
  x: number;
  y: number;
  width: number;
  height: number;
  initContent: string;
  finishEdit: (newContent: string) => void
}

export const EntityContentEditor = (props: EntityContentEditorProps) => {
  const [
    scale,
    defaultSettings,
    textSettings
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.defaultTextSettings,
    state.textSettings
  ])
  const dispatch = useDispatch()

  const relativeScale = scale / getScale(START_SCALE)

  const editorRef = React.useRef<HTMLDivElement>(null)
  const [ prevInnerText, setPrevInnerText ] = React.useState<string>(
    (() => {
      const textExtracter = document.createElement('div')
      textExtracter.innerHTML = props.initContent
      return textExtracter.innerText
    })()
  )

  const isInTag = (element: Element, tagName: string): boolean => {
    if (element.tagName === 'DIV') return false
    if (element.tagName === tagName) return true
    return isInTag(element.parentElement, tagName)
  }

  const getFontFace = (element: Element): string => {
    if (element.tagName === 'DIV') return null
    return element.getAttribute('face') ?? getFontFace(element.parentElement)
  }
 
  const applyTextSettings = (settings: TextSettings) => {
    document.execCommand("fontSize", false, "7")
    Array.from(document.getElementsByTagName("font")).forEach((element) => {
      if (element.size == "7") {
        element.removeAttribute("size")
        element.style.fontSize = settings.fontSize + "px"
      }
    })
    document.execCommand("fontName", false, settings.fontFamily)
    if (settings.bold) document.execCommand("bold", false, '')
    if (settings.italic) document.execCommand("italic", false, '')
    if (settings.underline) document.execCommand("underline", false, '')
    document.execCommand('foreColor', false, textSettings.color);
  }

  // document.onselectstart = () => updateSettings
  document.onselectionchange = () => updateSettings()

  const updateSettings = () => {
    const selectedElement = document.getSelection().anchorNode.parentElement
    if (selectedElement.tagName === 'DIV' || selectedElement.tagName === 'foreignObject') {
      dispatch(setTextSettings(defaultSettings))
      applyTextSettings(defaultSettings)
    } else {
      const fontSize = window.getComputedStyle(selectedElement, null).getPropertyValue('font-size')
      const fontFamily = getFontFace(selectedElement)
      console.log(fontFamily)
      const color = window.getComputedStyle(selectedElement, null).getPropertyValue('color')
      const bold = isInTag(selectedElement, 'B')
      const italic = isInTag(selectedElement, 'I')
      const underline = isInTag(selectedElement, 'U')
      dispatch(setTextSettings({ fontSize: parseInt(fontSize), fontFamily, color,bold, italic, underline }))
    }
  }

  React.useEffect(() => {
    editorRef.current.innerHTML = props.initContent
    editorRef.current.focus()
    document.execCommand('selectall', null);
  }, [])

  return (
    <div
      contentEditable='true'
      className='entity-content-editor block-content'
      ref={editorRef}
      style={{
        left: props.x,
        top: props.y,
        minWidth: props.width,
        minHeight: props.height,
        transform: `scale(${relativeScale}) translate(-${50 / relativeScale}%, -${50 / relativeScale}%)`
      }}
      onInput={(e: any) => {
        if (prevInnerText.length !== editorRef.current.innerText.length) {
          Array.from(document.getElementsByTagName("font")).forEach((element) => {
            if (element.size == "7") {
              element.removeAttribute("size")
              element.style.fontSize = "" + textSettings.fontSize + "px"
            }
          })
        }
        setPrevInnerText(editorRef.current.innerText)
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onBlur={() => props.finishEdit(editorRef.current.innerHTML)}
    />
  )
}