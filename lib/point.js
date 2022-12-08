const maxVel = 2
const lineDist = 150
class Point {
    constructor(x, y, r = 8) {
        this.x = x
        this.y = y
        this.r = r
        this.v = { x: random(-maxVel, maxVel), y: random(-maxVel, maxVel) }
        this.nextv = null
    }

    update(qt) {
        if (this.nextv != null) {
            this.v = this.nextv
            this.nextv = null
        }
        this.x += this.v.x
        this.y += this.v.y
        if ((this.y - this.r / 2 <= 0 && this.v.y < 0) || (this.y + this.r / 2 >= qt.h && this.v.y > 0)) this.v.y *= -1
        if ((this.x - this.r / 2 <= 0 && this.v.x < 0) || (this.x + this.r / 2 >= qt.w && this.v.x > 0)) this.v.x *= -1
        const nearby = qt.retrieve(this.x, this.y, this.r)
        if (nearby.length > 0) this.nextv = this.v
        for (let i = 0; i < nearby.length; i++) {
            const n = nearby[i]
            const d = getDistance(n.x, n.y, this.x, this.y)
            if (d == 0 || d > this.r) continue
            this.v.x *= -1
            this.v.y *= -1
            break
        }
    }

    render(qt) {
        color('white')
        noStroke()
        circle(this.x, this.y, this.r)
        const nearby = qt.retrieve(this.x, this.y, lineDist)
        for (let i = 0; i < nearby.length; i++) {
            const n = nearby[i]
            const d = getDistance(n.x, n.y, this.x, this.y)
            const a = (((lineDist - d) / lineDist) * 255) / 2
            if (d == 0 || a < 0.5) continue
            stroke(255, 255, 255, a)
            strokeWeight(1)
            line(this.x, this.y, n.x, n.y)
        }
    }
}