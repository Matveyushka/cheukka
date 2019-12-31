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

  const defaultCanvasVhHeight = 90
  const defaultCanvasVhWidth = 64
  const scaleMultiplier = scale / 100
  const prevScaleMultiplier = prevScale / 100

  const defaultXEmpty = vwToPx(60)
  const defaultYEmpty = vhToPx(60)
  const defaultXOffset = vwToPx(10) + vhToPx(defaultCanvasVhWidth) / 2
  const defaultYOffset = vhToPx(10) + vhToPx(defaultCanvasVhHeight) / 2 + 25

  const [lastXMovement, setLastXMovement] = React.useState<number>(0);
  const [lastYMovement, setLastYMovement] = React.useState<number>(0);
  const [mouseXPosition, setMouseXPosition] = React.useState<number>(0);
  const [mouseYPosition, setMouseYPosition] = React.useState<number>(0);
  const [offsetX, setOffsetX] = React.useState<number>(defaultXOffset);
  const [offsetY, setOffsetY] = React.useState<number>(defaultYOffset);

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

  const scrollHandler = (event: any) => {
    let thisElement = document.getElementsByClassName('workspace')[0]
    setOffsetX(thisElement.scrollLeft)
    setOffsetY(thisElement.scrollTop)
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
      else if (wheelDelta > 0) {
        dispatch(decreaseScale(5))
      }
    }
  }

  React.useEffect(() => {
    let thisElement = document.getElementsByClassName('workspace')[0]

    setOffsetX(thisElement.scrollLeft)
    setOffsetY(thisElement.scrollTop)
    thisElement.scrollTop -= lastYMovement;
    thisElement.scrollLeft -= lastXMovement;

  }, [lastXMovement, lastYMovement])

  React.useEffect(() => {
    let thisElement = document.getElementsByClassName('workspace')[0]

    const mfxo = mouseXPosition + offsetX
    const mfyo = mouseYPosition - 18 + offsetY

    const wid = vhToPx(defaultCanvasVhWidth) * scaleMultiplier + defaultXEmpty * 2
    const hei = vhToPx(defaultCanvasVhHeight) * scaleMultiplier + defaultYEmpty * 2

    const prevwid = vhToPx(defaultCanvasVhWidth) * prevScaleMultiplier + defaultXEmpty * 2
    const prevhei = vhToPx(defaultCanvasVhHeight) * prevScaleMultiplier + defaultYEmpty * 2

    const mfxn = (mfxo - defaultXEmpty) * (wid - defaultXEmpty * 2) / (prevwid - defaultXEmpty * 2) + defaultXEmpty
    const mfyn = (mfyo - defaultYEmpty) * (hei - defaultYEmpty * 2) / (prevhei - defaultYEmpty * 2) + defaultYEmpty

    const ofX = mfxn - mouseXPosition
    const ofY = mfyn - mouseYPosition + 18

    setOffsetX(ofX)
    setOffsetY(ofY)
    thisElement.scrollLeft = ofX;
    thisElement.scrollTop = ofY;
  }, [scale])

  React.useEffect(() => {
    let thisElement = document.getElementsByClassName('workspace')[0]
    thisElement.addEventListener("mousewheel", onWheelHandler, { passive: false });
  }, [])

  return (
    <div className="workspace"
      onMouseEnter={mouseEnterHandler}
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
      onScroll={scrollHandler}
    >
      <div className="canvas-wrapper" style={{
        height: defaultCanvasVhHeight + 'vh',
        width: defaultCanvasVhWidth + 'vh',
        borderRight: defaultXEmpty / scaleMultiplier + 'px solid transparent',
        borderLeft: defaultXEmpty / scaleMultiplier + 'px solid transparent',
        borderTop: defaultYEmpty / scaleMultiplier + 'px solid transparent',
        borderBottom: defaultYEmpty / scaleMultiplier + 'px solid transparent',
        transform: `scale(${scaleMultiplier})`,
        transformOrigin: `0 0`,
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}