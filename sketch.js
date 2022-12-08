let w
let h
let qt
let points
let pointCount = 200

const xRandomPoints = (x, w, h) => {
  let p = []
  for (let i = 0; i < x; i++) {
    p.push(new Point(random(0, w), random(0, h)))
  }
  return p
}

function setup() {
  w = window.innerWidth
  h = window.innerHeight
  points = xRandomPoints(pointCount, w, h)
  qt = new QuadTree(w, h)
  for (let i = 0; i < points.length; i++) {
    qt.insert(points[i])
  }
  createCanvas(w, h)
  background(0)
}

function draw() {
  background(0)
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    point.render(qt)
    point.update(qt)
    qt.remove(point)
    qt.insert(point)

  }
  qt.join()
}