const maxVel = 2
class Point {
    constructor(x, y, r = 4) {
        this.position = createVector(x, y)
        this.radius = r
        this.velocity = p5.Vector.random2D()
        this.velocity.mult(maxVel)
        this.collider = null
        this.m = this.radius
    }


    checkBoundaryCollision(w, h) {
        if (this.position.x > w - this.radius) {
            this.position.x = w - this.radius;
            this.velocity.x *= -1;
        } else if (this.position.x < this.radius) {
            this.position.x = this.radius;
            this.velocity.x *= -1;
        } else if (this.position.y > h - this.radius) {
            this.position.y = h - this.radius;
            this.velocity.y *= -1;
        } else if (this.position.y < this.radius) {
            this.position.y = this.radius;
            this.velocity.y *= -1;
        }
    }

    checkOtherCollision(collider) {
        if (collider == null) return
        const { other, dV, dM } = collider
        const minDistance = this.radius + other.radius;

        if (dM < minDistance) {
            const distanceCorrection = (minDistance - dM) / 2.0;
            const d = dV.copy();
            const correctionVector = d.normalize().mult(distanceCorrection);
            other.position.add(correctionVector);
            this.position.sub(correctionVector);

            const theta = dV.heading();
            const sine = sin(theta);
            const cosine = cos(theta);

            const bTemp = [new p5.Vector(), new p5.Vector()];

            bTemp[1].x = cosine * dV.x + sine * dV.y;
            bTemp[1].y = cosine * dV.y - sine * dV.x;

            const vTemp = [new p5.Vector(), new p5.Vector()];

            vTemp[0].x = cosine * this.velocity.x + sine * this.velocity.y;
            vTemp[0].y = cosine * this.velocity.y - sine * this.velocity.x;
            vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
            vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

            const vFinal = [new p5.Vector(), new p5.Vector()];

            vFinal[0].x = ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (this.m + other.m);
            vFinal[0].y = vTemp[0].y;

            vFinal[1].x = ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + other.m);
            vFinal[1].y = vTemp[1].y;

            bTemp[0].x += vFinal[0].x;
            bTemp[1].x += vFinal[1].x;

            const bFinal = [new p5.Vector(), new p5.Vector()];

            bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
            bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            other.position.x = this.position.x + bFinal[1].x;
            other.position.y = this.position.y + bFinal[1].y;

            if (dM < this.radius) {
                if (this.position.x <= other.position.x) {
                    this.position.x -= this.radius
                    other.position.x += other.radius
                }
                if (this.position.x > other.position.x) {
                    this.position.x += this.radius
                    other.position.x -= other.radius
                }
                if (this.position.y <= other.position.y) {
                    this.position.y -= this.radius
                    other.position.y += other.radius
                }
                if (this.position.y > other.position.y) {
                    this.position.y += this.radius
                    other.position.y -= other.radius
                }
            }
            this.position.add(bFinal[0]);

            this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
            this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
            other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
        }
    }


    update(qt) {
        this.checkBoundaryCollision(qt.w, qt.h)
        this.checkOtherCollision(this.collider)
        this.collider = null
        this.position.add(this.velocity)
    }

    render(qt, lineDist) {
        noStroke()
        fill(255)
        circle(this.position.x, this.position.y, this.radius * 2)
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
}