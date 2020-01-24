interface Point {
  x: number;
  y: number;
}

export const getTheClosestSegmentPointToFreePoint = (freePoint: Point, segmentBegin: Point, segmentEnd: Point) => {
  const p1 = segmentBegin
  const p2 = segmentEnd
  const xc1 = p1.y - p2.y
  const yc1 = p2.x - p1.x
  const fc1 = p1.x * p2.y - p2.x * p1.y

  const xc2 = -yc1
  const yc2 = xc1
  const fc2 = -(xc1 * freePoint.y - yc1 * freePoint.x)

  const crossX = (fc1 * yc2 - fc2 * yc1) / (yc1 * xc2 - xc1 * yc2)

  const leftBorder = p1.x < p2.x ? p1.x : p2.x
  const rightBorder = p1.x > p2.x ? p1.x : p2.x

  const topBorder = p1.y < p2.y ? p1.y : p2.y
  const bottomBorder = p1.y > p2.y ? p1.y : p2.y

  const desiredX = crossX < leftBorder ? leftBorder : crossX > rightBorder ? rightBorder : crossX
  const desiredY = (yc1 === 0) ? 
  (freePoint.y < topBorder ? topBorder : freePoint.y > bottomBorder ? bottomBorder : freePoint.y) 
  : ((-xc1 * desiredX - fc1) / yc1)

  console.log('****************')
  console.log(xc1)
  console.log(yc1)
  console.log(fc1)
  console.log('=' + (xc1 * p1.x + yc1 * p1.y + fc1))
  console.log('=' + (xc1 * p2.x + yc1 * p2.y + fc1))

  console.log(xc2)
  console.log(yc2)
  console.log(fc2)
  console.log('=' + (xc2 * freePoint.x + yc2 * freePoint.y + fc2))

  console.log(crossX)

  console.log(freePoint)
  console.log(segmentBegin)
  console.log(segmentEnd)
  console.log(desiredX)
  console.log(desiredY)
  console.log('----------------------')

  return { x: desiredX, y: desiredY }
}