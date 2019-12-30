import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../stores'

export interface CanvasProps { }

export const Canvas = (props: CanvasProps) => {
  const scale = useSelector((state: Store) => state.scale)

  return (
    <div className="diagram-canvas">
    </div>
  )
}