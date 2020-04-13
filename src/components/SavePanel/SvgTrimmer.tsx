export const getTrimmedSvg = () => {
  const SVGDomElement = document.getElementsByTagName("svg")[0]
  const clone: any = SVGDomElement.cloneNode(true)

  const blocks: any = clone.getElementsByClassName("block")

  Array.from(blocks).forEach((block: any) => block.removeChild(block.children[0]))

  SVGDomElement.parentElement.append(clone)

  const safeZone = 1

  var bbox = clone.getBBox();
  var viewBox = [bbox.x - safeZone, bbox.y - safeZone, bbox.width + safeZone * 2, bbox.height + safeZone * 2].join(" ");
  clone.setAttribute("viewBox", viewBox);
  clone.setAttribute("width", bbox.width + safeZone * 2 + "px")
  clone.setAttribute("height", bbox.height + safeZone * 2 + "px")

  return clone
}