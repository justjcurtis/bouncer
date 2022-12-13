const maxVel = 2
class Point {
    constructor(x, y, r = 4) {
        this.position = createVector(x, y)
        this.radius = r
        this.velocity = p5.Vector.random2D()
        this.velocity.mult(maxVel)
        this.collider = null
        this.m = this.radius
        this.red = 0
        this.heat = 0
    }

    handleHeat(didCollide, colliderVelocityMag) {
        if (didCollide) this.heat = Math.min(((this.velocity.mag() + colliderVelocityMag) / 10) * 255, 255)
        if (this.heat > 0) {
            this.red += this.red > 245 ? 255 - this.red : 10
            this.heat -= 10
        } else {
            if (this.red > 0) {
                const speed = this.velocity.mag()
                this.red -= speed > this.red ? this.red : speed
            }
        }
    }

    update(qt) {
        const boundryCollision = collideBoundry(this, qt.w, qt.h)
        const otherCollision = collideOther(this, this.collider)
        if (otherCollision) this.collider.other.heat = Math.min(((this.collider.other.velocity.mag() + this.velocity.mag()) / 10) * 255, 255)
        const didCollide = boundryCollision || otherCollision
        this.handleHeat(didCollide, otherCollision ? this.collider.other.velocity.mag() : 0)
        if (this.collider) {
            this.collider.collider = null
            this.collider = null
        }
        if (!didCollide) this.position.add(this.velocity)
    }

    renderLines(qt, lineDist) {
        const nearby = qt.query(this.position.x, this.position.y, lineDist)
        let minDist = Infinity
        for (let i = 0; i < nearby.length; i++) {
            const n = nearby[i]
            const dV = p5.Vector.sub(n.position, this.position)
            const dM = dV.mag()
            const a = Math.min((((lineDist - dM) / lineDist) * 255) * 2, 255)
            if (n == this || dM >= lineDist) continue
            if (dM <= this.radius * 2) {
                if (dM < minDist) {
                    minDist = dM
                    this.collider = { other: n, dV, dM }
                }
            }
            stroke(255, 255, 255, a)
            strokeWeight(1)
            beginShape() // TODO: raise issue with p5js on github, line functions performance on mobile is broken.
            vertex(this.position.x, this.position.y)
            vertex(n.position.x, n.position.y)
            endShape(CLOSE);
        }
    }
    renderPoint() {
        noStroke()
        fill(255, 255 - this.red, 255 - this.red)
        circle(this.position.x, this.position.y, this.radius * 2)
    }
}