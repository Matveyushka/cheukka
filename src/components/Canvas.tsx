import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../stores'

export interface CanvasProps { }

export const Canvas = (props: CanvasProps) => {
  const Scale = useSelector((state: Store) => state.Scale)

  return (
    <div className="diagram-canvas">
      <div id="b1"></div>
      <div id="b2"></div>
      <div id="b3"></div>
    </div>
  )
}