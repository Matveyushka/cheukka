import { saveSvgAsPng } from "save-svg-as-png"
import { getTrimmedSvg } from '../SvgTrimmer' 

export const saveAsPng = (name: string, zoom: number, setBackground: boolean) => {
  const scale = (zoom > 0) ? (zoom / 100) : 1

  var svg = getTrimmedSvg()
  var bbox = svg.getBBox();

  saveSvgAsPng(svg, name, {
    backgroundColor: (setBackground ? "white" : "transparent"),
    scale,
    top: bbox.y - 1,
    left: bbox.x - 1,
  })

  svg.parentNode.removeChild(svg)
}