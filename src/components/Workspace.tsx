import * as React from 'react'
import { Canvas } from './Canvas'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, increaseScale, decreaseScale } from '../actions'
import { Store } from '../stores'
import { vhToPx, pxToVh, vwToPx, pxToVw } from '../utils'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const prevScale = useSelector<Store, number>((state: Store) => state.prevScale)
  const dispatch = useDispatch()

  const [lastXMovement, setLastXMovement] = React.useState<number>(0);
  const [lastYMovement, setLastYMovement] = React.useState<number>(0);
  const [mouseXPosition, setMouseXPosition] = React.useState<number>(0);
  const [mouseYPosition, setMouseYPosition] = React.useState<number>(0);

  const defaultCanvasVhHeight = 90
  const defaultCanvasVhWidth = 64
  const defaultXOffset = vwToPx(40 + pxToVw(vhToPx(defaultCanvasVhWidth)) / 2)
  const defaultYOffset = vhToPx(40 + defaultCanvasVhHeight / 2) + 25
  const scaleMultiplier = scale / 100
  const prevScaleMultiplier = prevScale / 100

  const mouseMoveHandler = (event: any) => {
    setMouseXPosition(event.clientX)
    setMouseYPosition(event.clientY)
    if (event.buttons === 2) {
      setLastXMovement(event.movementX)
      setLastYMovement(event.movementY)
    }
  }

  const mouseEnterHandler = (event: any) => {
    setMouseXPosition(event.clientX)
    setMouseYPosition(event.clientY)
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

  React.useEffect(() => {
    let thisElement = document.getElementsByClassName('workspace')[0]
    const deltaScale = scale - prevScale

    const canvasXBegin = vwToPx(90) - thisElement.scrollLeft;
    const canvasXEnd = canvasXBegin + vhToPx(defaultCanvasVhWidth) * prevScaleMultiplier
    const canvasWidth = vhToPx(defaultCanvasVhWidth) * prevScaleMultiplier

    const k = (mouseXPosition - canvasXBegin) / canvasWidth

    console.log(deltaScale)
    console.log(canvasXBegin)
    console.log(canvasXEnd)
    console.log(canvasWidth)
    console.log(k)

    //thisElement.scrollTop += deltaScale / 100 * vhToPx(defaultCanvasVhHeight) * (mouseYPosition - yCanvasPosition) / vhToPx(defaultCanvasVhHeight)

    console.log(thisElement.scrollLeft)
    thisElement.scrollLeft += deltaScale / 100 * canvasWidth * k
    console.log(thisElement.scrollLeft)
  }, [scale])

  return (
    <div className="workspace"
      onMouseEnter={mouseEnterHandler}
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
    >
      <div className="debug">
        x: {mouseXPosition} <br/>
        y: {mouseYPosition} <br/>
      </div>
      <div className="canvas-wrapper" style={{
        height: defaultCanvasVhHeight * scaleMultiplier + 'vh',
        width: defaultCanvasVhWidth * scaleMultiplier + 'vh',
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}