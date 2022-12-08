const maxVel = 2
class Point {
    constructor(x, y, r = 8) {
        this.x = x
        this.y = y
        this.r = r
        this.v = { x: random(-maxVel, maxVel), y: random(-maxVel, maxVel) }
        this.nextv = null
        this.colliders = []
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
        this.nextv = this.v
        while (this.colliders.length) {
            const { n, d } = this.colliders.pop()
            if (n == this) continue
            if (d < this.r) {
                if (this.x <= n.x) this.x -= 2
                if (this.y <= n.y) this.y -= 2
                if (this.x > n.x) this.x += 2
                if (this.y > n.y) this.y += 2
            }
            this.nextv.x *= -1
            this.nextv.y *= -1
            break
        }
        this.colliders = []
    }

    render(qt, lineDist) {
        noStroke()
        fill(255)
        circle(this.x, this.y, this.r)
        const nearby = qt.retrieve(this.x, this.y, lineDist)
        for (let i = 0; i < nearby.length; i++) {
            const n = nearby[i]
            const d = getDistance(n.x, n.y, this.x, this.y)
            const a = Math.min((((lineDist - d) / lineDist) * 255) * 2, 255)
            if (n == this || d >= lineDist) continue
            if (d < this.r) this.colliders.push({ n, d })
            stroke(255, 255, 255, a)
            strokeWeight(1)
            beginShape() // TODO: raise issue with p5js on github, line functions performance on mobile is broken.
            vertex(this.x, this.y)
            vertex(n.x, n.y)
            endShape(CLOSE);
        }
    }
}