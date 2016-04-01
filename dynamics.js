
function bmt() {
    // Box-Muller Transform
    var a;
    var b;
    var c;
    var rad;
    do {
        a = Math.random() * 2 - 1;
        b = Math.random() * 2 - 1;
        rad = a*a + b*b;
    }
    while (rad == 0 || rad > 1);
    c = Math.sqrt(-2 * Math.log(rad) / rad);
    return a * c;
}

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function NewBody(ri,xi,yi) {
    var dum1;
    var dum2;
    var vxi;
    var vyi;
    this.r = ri;
    this.x = xi;
    this.y = yi;
    dum1 = bmt()+temp;
    dum2 = Math.random() * 2 * Math.PI;
    vxi = dum1 * Math.cos(dum2);
    vyi = dum1 * Math.sin(dum2);
    this.vx = vxi;
    this.vy = vyi;
    this.ax = 0.0;
    this.ay = 0.0;
    this.mass = ri * ri;
    this.color = getcolor(vxi,vyi);
}

function getcolor (vx, vy) {
    var vel;
    var idum;
    vel = Math.sqrt(vx*vx+vy*vy);
    idum = (vel - tempmin) / (tempmax - tempmin);
    idum = Math.floor(idum * colors.length);
    if (idum >= colors.length) {idum = colors.length-1}
    if (idum < 0) {idum = 0}
    return colors[idum];
}

function wrap (z,zmax) {
    // Wraps coordinate z to new position.
    // Assumes that (0,0) is the center. Whole
    // length is 2 * zmax
    z -= sign(z)*zmax*2;
    return z;
}

function ljForce (r) {
    // Returns LJ force given distance r
    var req6;
    var r6;
    var r13;
    var dum;
    req6 = Math.pow(req,6);
    r6 = Math.pow(r,6);
    r13 = r6*r6*r;
    dum = r6 - req6;
    dum = dum * 12 * epsilon * req6;
    dum = -dum / r13;
    return dum;
}

function ljStep (bodies) {
    // Advances bodies forward one step according to
    // Velocity Verlet algorithm with a Lennard Jones Potential
    // calculate acceleration at begining of step
    for (i = 0; i < bodies.length; i++) {
        xi = bodies[i].x;
        yi = bodies[i].y;
        vxi = bodies[i].vx;
        vyi = bodies[i].vy;
        axi = 0;
        ayi =0;
        for (j = 0; j < bodies.length; j++) {
            xj = bodies[j].x;
            yj = bodies[j].y;
            vxj = bodies[j].vx;
            vyj = bodies[j].vy;
            dx = xi - xj;
            if (Math.abs(dx) > xmax) {xj = wrap(xj,xmax)}
            dx = xi - xj;
            dy = yi - yj;
            if (Math.abs(dy) > ymax) {yj = wrap(yj,ymax)}
            dy = yi - yj;
            dist = Math.pow(dx,2);
            dist += Math.pow(dy,2);
            dist = Math.sqrt(dist);
            if (dist < rcut) {
                if (i != j) {
                    axi += ljForce(dist) * dx / dist;
                    ayi += ljForce(dist) * dy / dist;
                }
            }
        }
        bodies[i].ax = axi / bodies[i].mass;
        bodies[i].ay = ayi / bodies[i].mass;
    }
    // calculate position at end of step and velocity at middle of step
    for (i = 0; i < bodies.length; i++) {
        xi = bodies[i].x;
        yi = bodies[i].y;
        vxi = bodies[i].vx;
        vyi = bodies[i].vy;
        axi = bodies[i].ax;
        ayi = bodies[i].ay;
        bodies[i].vx = vxi + 0.5 * axi * dt;
        bodies[i].vy = vyi + 0.5 * ayi * dt;
        bodies[i].x = xi + bodies[i].vx * dt;
        bodies[i].y = yi + bodies[i].vy * dt;
        if (Math.abs(bodies[i].x) > xmax) {bodies[i].x = wrap(bodies[i].x,xmax)}
        if (Math.abs(bodies[i].y) > ymax) {bodies[i].y = wrap(bodies[i].y,ymax)}
    }
    // calculate acceleration at end of step
    for (i = 0; i < bodies.length; i++) {
        xi = bodies[i].x;
        yi = bodies[i].y;
        vxi = bodies[i].vx;
        vyi = bodies[i].vy;
        axi = 0;
        ayi =0;
        for (j = 0; j < bodies.length; j++) {
            xj = bodies[j].x;
            yj = bodies[j].y;
            vxj = bodies[j].vx;
            vyj = bodies[j].vy;
            dx = xi - xj;
            if (Math.abs(dx) > xmax) {xj = wrap(xj,xmax)}
            dx = xi - xj;
            dy = yi - yj;
            if (Math.abs(dy) > ymax) {yj = wrap(yj,ymax)}
            dy = yi - yj;
            dist = Math.pow(dx,2);
            dist += Math.pow(dy,2);
            dist = Math.sqrt(dist);
            if (dist < rcut) {
                if (i != j) {
                    axi += ljForce(dist) * dx / dist;
                    ayi += ljForce(dist) * dy / dist;
                }
            }
        }
        bodies[i].ax = axi / bodies[i].mass;
        bodies[i].ay = ayi / bodies[i].mass;
    }
    // calculate velocity at end of step
    for (i = 0; i < bodies.length; i++) {
        xi = bodies[i].x;
        yi = bodies[i].y;
        vxi = bodies[i].vx;
        vyi = bodies[i].vy;
        axi = bodies[i].ax;
        ayi = bodies[i].ay;
        bodies[i].vx = vxi + 0.5 * axi * dt;
        bodies[i].vy = vyi + 0.5 * ayi * dt;
    }
    for (i = 0; i < bodies.length; i++) {
        bodies[i].color = getcolor(bodies[i].vx,bodies[i].vy);
    }
    return bodies;
}

function elasticStep (bodies) {
    for (i = 0; i < bodies.length; i++) {
        coll=0;
        xi = bodies[i].x;
        yi = bodies[i].y;
        ri = bodies[i].r;
        mi = bodies[i].mass;

        for (j = i+1; j < bodies.length; j++) {
            xj = bodies[j].x;
            yj = bodies[j].y;
            rj = bodies[j].r;
            mj = bodies[j].mass;

            dx = xi - xj;
            if (Math.abs(dx) > xmax) {
                xj = wrap(xj, xmax)
            }
            dx = xi - xj;
            dy = yi - yj;
            if (Math.abs(dy) > ymax) {
                yj = wrap(yj, ymax)
            }
            dy = yi - yj;
            rsq = Math.pow(dx, 2) + Math.pow(dy, 2);
            if (rsq < Math.pow(ri + rj, 2)) {
                dvx = bodies[i].vx - bodies[j].vx;
                dvy = bodies[i].vy - bodies[j].vy;

                mui = 2*mj/(mi+mj)/rsq;
                muj = 2*mi/(mi+mj)/rsq;
                bodies[i].vx -= mui * (dvx * dx * dx + dvy * dx * dy);
                bodies[i].vy -= mui * (dvy * dy * dy + dvx * dy * dx);
                bodies[j].vx += muj * (dvx * dx * dx + dvy * dx * dy);
                bodies[j].vy += muj * (dvy * dy * dy + dvx * dy * dx);
            }
        }

        xi += bodies[i].vx * dt;
        yi += bodies[i].vy * dt;

        if (periodicbc === 1) {
            if (Math.abs(xi) > xmax) {
                xi = wrap(xi, xmax);
            }
            if (Math.abs(yi) > ymax) {
                yi = wrap(yi, ymax);
            }
        }

        bodies[i].x = xi;
        bodies[i].y = yi;
    }
    for (i = 0; i < bodies.length; i++) {
        bodies[i].color = getcolor(bodies[i].vx,bodies[i].vy);
    }
    return bodies;
}

function calcKE (bodies) {
    var sum;
    var dum;
    sum = 0;
    dum = 0;
    for (ibody = 0; ibody < bodies.length; ibody++) {
        dum = bodies[ibody].vx * bodies[ibody].vx;
        dum += bodies[ibody].vy * bodies[ibody].vy;
        sum += 0.5 * bodies[ibody].mass * dum;
    }
    return sum;
}

function calcPE (bodies) {
    var sum;
    var dum;
    var r6;
    var r12;
    var r06;
    var r012;
    sum = 0;
    r06 = Math.pow(req,6);
    r012 = Math.pow(r06,2);
    for (i = 0; i < bodies.length; i++) {
        xi = bodies[i].x;
        yi = bodies[i].y;
        vxi = bodies[i].vx;
        vyi = bodies[i].vy;
        for (j = 0; j < bodies.length; j++) {
            xj = bodies[j].x;
            yj = bodies[j].y;
            vxj = bodies[j].vx;
            vyj = bodies[j].vy;
            dx = xi - xj;
            if (Math.abs(dx) > xmax) {xj = wrap(xj,xmax)}
            dx = xi - xj;
            dy = yi - yj;
            if (Math.abs(dy) > ymax) {yj = wrap(yj,ymax)}
            dy = yi - yj;
            dist = Math.pow(dx,2);
            dist += Math.pow(dy,2);
            dist = Math.sqrt(dist);
            if (dist < rcut) {
                if (i != j) {
                    r6 = Math.pow(dist,6);
                    r12 = Math.pow(dist,2);
                    dum = r012 / r12 - 2 * r06 / r6;
                    dum = dum * epsilon;
                    sum += dum;
                }
            }
        }
    }
    return sum;
}

function countBodies (bodies) {
    n = 0;
    for (ibody = 0; ibody < bodies.length; ibody++) {
        if (bodies[ibody].x < 0) n += 1
    }
    return n;
}

function velDist(tdData,bodies) {
    return tdData;
}

