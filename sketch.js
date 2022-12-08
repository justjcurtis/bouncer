let w
let h
let qt
let points
let pointCount = 200
let lineDist

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
  lineDist = Math.max(w, h) / 10
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
    point.render(qt, lineDist)
    point.update(qt)
    qt.remove(point)
    qt.insert(point)
  }
  qt.join()

  textSize(10);
  fill(255);
  stroke(0);
  text((frameRate()).toFixed(2), 5, 10);
}