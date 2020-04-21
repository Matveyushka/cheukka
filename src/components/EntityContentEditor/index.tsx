import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { getScale } from '../../utils'

export interface EntityContentEditorProps {
  x: number;
  y: number;
  width: number;
  height: number;
  initContent: string;
  finishEdit: (newContent: string) => void
}

export const EntityContentEditor = (props: EntityContentEditorProps) => {
  const scale = useSelector((state: Store) => getScale(state.scaleLevel))

  const editorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    editorRef.current.innerHTML = props.initContent
    editorRef.current.focus()
    document.execCommand('selectall',null);
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
        fontSize: 0.2 * scale + 'em',
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onBlur={() => props.finishEdit(editorRef.current.innerHTML)}
    />
  )
}