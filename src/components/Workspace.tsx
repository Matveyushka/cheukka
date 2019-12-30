import * as React from 'react'
import { Canvas } from './Canvas'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, increaseScale, decreaseScale } from '../actions'
import { Store } from '../stores'
import { vhToPx, pxToVh, vwToPx, pxToVw } from '../utils'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const dispatch = useDispatch()

  const [ lastXMovement, setLastXMovement ] = React.useState<number>(0);
  const [ lastYMovement, setLastYMovement ] = React.useState<number>(0);

  const defaultCanvasVhHeight = 90
  const defaultCanvasVhWidth = 64
  const defaultXOffset = vwToPx(40 + pxToVw(vhToPx(defaultCanvasVhWidth)) / 2)
  const defaultYOffset = vhToPx(40 + defaultCanvasVhHeight / 2) + 25
  const scaleMultiplier = scale / 100

  const mouseMoveHandler = (event: any) => {
    if (event.buttons === 2) {
      setLastXMovement(event.movementX)
      setLastYMovement(event.movementY)
    }
  } 

  const preventContextMenu = (event: any) => {
    event.preventDefault()
    return false
  }

  const onWheelHandler = (event: any) => {
    if (event.ctrlKey) {
      event.preventDefault()
      const wheelDelta = Math.sign(event.deltaY)
      if (wheelDelta < 0) {
        dispatch(increaseScale(5))
      }
      else if (wheelDelta > 0) dispatch(decreaseScale(5))
    }
  }
  
  React.useEffect(() => {
    let thisElement = document.getElementsByClassName('workspace')[0]
    thisElement.scrollTop = defaultYOffset;
    thisElement.scrollLeft = defaultXOffset;
    thisElement.addEventListener("mousewheel", onWheelHandler, { passive: false });
  }, [])

  React.useEffect(() => {
    let thisElement = document.getElementsByClassName('workspace')[0]
    thisElement.scrollTop -= lastYMovement;
    thisElement.scrollLeft -= lastXMovement;
  }, [lastXMovement, lastYMovement])

  return (
  <div className="workspace" 
      onMouseMove={mouseMoveHandler} 
      onContextMenu={preventContextMenu}
    >
    <div className="workspace-scaler" style={{transform: `scale(${scaleMultiplier})`}}>
      <div className="canvas-wrapper" style={{
          height: defaultCanvasVhHeight + 'vh',
          width: defaultCanvasVhWidth + 'vh',
        }}>
        <Canvas>
        </Canvas>
      </div>
    </div>
  </div>)
}