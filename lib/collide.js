const collideBoundry = (point, w, h) => {
    if (point.position.x > w - point.radius) {
        point.position.x = w - point.radius;
        point.velocity.x *= -1;
        return true
    } else if (point.position.x < point.radius) {
        point.position.x = point.radius;
        point.velocity.x *= -1;
        return true
    } else if (point.position.y > h - point.radius) {
        point.position.y = h - point.radius;
        point.velocity.y *= -1;
        return true
    } else if (point.position.y < point.radius) {
        point.position.y = point.radius;
        point.velocity.y *= -1;
        return true
    }
    return false
}

const collideOther = (a, b) => {
    if (a == null || b == null) return false
    const { other, dV, dM } = b
    const minDistance = a.radius + other.radius;

    if (dM < minDistance) {
        const distanceCorrection = (minDistance - dM) / 2.0;
        const d = dV.copy();
        const correctionVector = d.normalize().mult(distanceCorrection);
        other.position.add(correctionVector);
        a.position.sub(correctionVector);

        const theta = dV.heading();
        const sine = sin(theta);
        const cosine = cos(theta);

        const bTemp = [new p5.Vector(), new p5.Vector()];

        bTemp[1].x = cosine * dV.x + sine * dV.y;
        bTemp[1].y = cosine * dV.y - sine * dV.x;

        const vTemp = [new p5.Vector(), new p5.Vector()];

        vTemp[0].x = cosine * a.velocity.x + sine * a.velocity.y;
        vTemp[0].y = cosine * a.velocity.y - sine * a.velocity.x;
        vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
        vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

        const vFinal = [new p5.Vector(), new p5.Vector()];

        vFinal[0].x = ((a.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (a.m + other.m);
        vFinal[0].y = vTemp[0].y;

        vFinal[1].x = ((other.m - a.m) * vTemp[1].x + 2 * a.m * vTemp[0].x) / (a.m + other.m);
        vFinal[1].y = vTemp[1].y;

        bTemp[0].x += vFinal[0].x;
        bTemp[1].x += vFinal[1].x;


        const bFinal = [new p5.Vector(), new p5.Vector()];

        bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
        bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
        bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
        bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

        other.position.x = a.position.x + bFinal[1].x;
        other.position.y = a.position.y + bFinal[1].y;

        a.position.add(bFinal[0]);

        let dF = p5.Vector.sub(a.position, other.position)
        let dMF = dF.mag()
        while (dMF < (a.radius + other.radius)) {
            a.position.add(bFinal[0]);
            other.position.add(bFinal[1]);
            dF = p5.Vector.sub(a.position, other.position)
            dMF = dF.mag()
        }


        a.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
        a.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
        other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
        other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;

        return true
    }
}