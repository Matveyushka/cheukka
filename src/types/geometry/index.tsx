export interface Point {
  x: number,
  y: number
}

export const newPoint = (x: number, y: number): Point => ({x, y})

export interface Segment {
  point1: Point,
  point2: Point
}

export const newSegment = (point1: Point, point2: Point) => ({point1, point2})