
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


var colors = [
    "#ff3800",
    "#ff4700",
    "#ff5300",
    "#ff5d00",
    "#ff6500",
    "#ff6d00",
    "#ff7300",
    "#ff7900",
    "#ff7e00",
    "#ff8300",
    "#ff8912",
    "#ff8e21",
    "#ff932c",
    "#ff9836",
    "#ff9d3f",
    "#ffa148",
    "#ffa54f",
    "#ffa957",
    "#ffad5e",
    "#ffb165",
    "#ffb46b",
    "#ffb872",
    "#ffbb78",
    "#ffbe7e",
    "#ffc184",
    "#ffc489",
    "#ffc78f",
    "#ffc994",
    "#ffcc99",
    "#ffce9f",
    "#ffd1a3",
    "#ffd3a8",
    "#ffd5ad",
    "#ffd7b1",
    "#ffd9b6",
    "#ffdbba",
    "#ffddbe",
    "#ffdfc2",
    "#ffe1c6",
    "#ffe3ca",
    "#ffe4ce",
    "#ffe6d2",
    "#ffe8d5",
    "#ffe9d9",
    "#ffebdc",
    "#ffece0",
    "#ffeee3",
    "#ffefe6",
    "#fff0e9",
    "#fff2ec",
    "#fff3ef",
    "#fff4f2",
    "#fff5f5",
    "#fff6f8",
    "#fff8fb",
    "#fff9fd",
    "#fef9ff",
    "#fcf7ff",
    "#f9f6ff",
    "#f7f5ff",
    "#f5f3ff",
    "#f3f2ff",
    "#f0f1ff",
    "#eff0ff",
    "#edefff",
    "#ebeeff",
    "#e9edff",
    "#e7ecff",
    "#e6ebff",
    "#e4eaff",
    "#e3e9ff",
    "#e1e8ff",
    "#e0e7ff",
    "#dee6ff",
    "#dde6ff",
    "#dce5ff",
    "#dae4ff",
    "#d9e3ff",
    "#d8e3ff",
    "#d7e2ff",
    "#d6e1ff",
    "#d4e1ff",
    "#d3e0ff",
    "#d2dfff",
    "#d1dfff",
    "#d0deff",
    "#cfddff",
    "#cfddff",
    "#cedcff",
    "#cddcff",
    "#ccdbff",
    "#cbdbff",
    "#cadaff",
    "#c9daff",
    "#c9d9ff",
    "#c8d9ff",
    "#c7d8ff",
    "#c7d8ff",
    "#c6d8ff",
    "#c5d7ff",
    "#c4d7ff",
    "#c4d6ff",
    "#c3d6ff",
    "#c3d6ff",
    "#c2d5ff",
    "#c1d5ff",
    "#c1d4ff",
    "#c0d4ff",
    "#c0d4ff",
    "#bfd3ff",
    "#bfd3ff",
    "#bed3ff",
    "#bed2ff",
    "#bdd2ff",
    "#bdd2ff",
    "#bcd2ff",
    "#bcd1ff",
    "#bbd1ff",
    "#bbd1ff",
    "#bad0ff",
    "#bad0ff",
    "#b9d0ff",
    "#b9d0ff",
    "#b9cfff",
    "#b8cfff",
    "#b8cfff",
    "#b7cfff",
    "#b7ceff",
    "#b7ceff",
    "#b6ceff",
    "#b6ceff",
    "#b6cdff",
    "#b5cdff",
    "#b5cdff",
    "#b5cdff",
    "#b4cdff",
    "#b4ccff",
    "#b4ccff",
    "#b3ccff",
    "#b3ccff",
    "#b3ccff",
    "#b2cbff",
    "#b2cbff",
    "#b2cbff",
    "#b2cbff",
    "#b1cbff",
    "#b1caff",
    "#b1caff",
    "#b1caff",
    "#b0caff",
    "#b0caff",
    "#b0caff",
    "#afc9ff",
    "#afc9ff",
    "#afc9ff",
    "#afc9ff",
    "#afc9ff",
    "#aec9ff",
    "#aec9ff",
    "#aec8ff",
    "#aec8ff",
    "#adc8ff",
    "#adc8ff",
    "#adc8ff",
    "#adc8ff",
    "#adc8ff",
    "#acc7ff",
    "#acc7ff",
    "#acc7ff",
    "#acc7ff",
    "#acc7ff",
    "#abc7ff",
    "#abc7ff",
    "#abc7ff",
    "#abc6ff",
    "#abc6ff",
    "#aac6ff",
    "#aac6ff",
    "#aac6ff",
    "#aac6ff",
    "#aac6ff",
    "#aac6ff",
    "#a9c6ff",
    "#a9c5ff",
    "#a9c5ff",
    "#a9c5ff",
    "#a9c5ff",
    "#a9c5ff",
    "#a9c5ff",
    "#a8c5ff",
    "#a8c5ff",
    "#a8c5ff",
    "#a8c5ff",
    "#a8c4ff",
    "#a8c4ff",
    "#a8c4ff",
    "#a7c4ff",
    "#a7c4ff",
    "#a7c4ff",
    "#a7c4ff",
    "#a7c4ff",
    "#a7c4ff",
    "#a7c4ff",
    "#a6c4ff",
    "#a6c3ff",
    "#a6c3ff",
    "#a6c3ff",
    "#a6c3ff",
    "#a6c3ff",
    "#a6c3ff",
    "#a6c3ff",
    "#a5c3ff",
    "#a5c3ff",
    "#a5c3ff",
    "#a5c3ff",
    "#a5c3ff",
    "#a5c3ff",
    "#a5c2ff",
    "#a5c2ff",
    "#a5c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a4c2ff",
    "#a3c2ff",
    "#a3c2ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a3c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c1ff",
    "#a2c0ff",
    "#a2c0ff",
    "#a2c0ff",
    "#a2c0ff",
    "#a2c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a1c0ff",
    "#a0c0ff",
    "#a0c0ff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#a0bfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbfff",
    "#9fbeff",
    "#9fbeff",
    "#9fbeff",
    "#9fbeff",
    "#9fbeff",
    "#9fbeff",
    "#9fbeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9ebeff",
    "#9dbeff",
    "#9dbeff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9dbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbdff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9cbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff",
    "#9bbcff"];

var temp = 4;
var rmax = 3.0;
var req = 7.5; // for now all bodies have same r_eq
var epsilon = 2.0;
var rcut = req * 2;
var bodies1 = [];
var xmax = 50;
var ymax = 15;
var tempmin = 2;
var tempmax = 8;
var nstep = 100;
var dt = 0.01;
var periodicbc = 1;
var initialspace = 15; // make sure that not too close given the req or rmax.
var iframe;

x0 = -xmax + rmax;
y0 = -ymax + rmax;
r0 = rmax;
ibody = 0;
do {
    do {
        //r0 = Math.random() * (rmax - 0.5) + 0.5;
        bodies1[ibody] = new NewBody(r0,x0,y0);
        y0 += initialspace;//2 * rmax;
        ibody += 1;
    } while (y0 < ymax - rmax);
    y0 = -ymax + rmax;
    x0 += initialspace;//2 * rmax;
} while (x0 < xmax - rmax);

//console.log(bodies1);
//console.log(countBodies(bodies1));

var data = [];
var tdData = [];
var ndata = 5;
var nbin = 25;

for (idata = 0; idata < ndata; idata++) {
    tdData.push([]);
    for (ibin = 0; ibin < nbin; ibin++) {
        tdData[idata].push(0);
    }
}
for (ibin = 0; ibin < nbin; ibin++) {
    data.push([]);
    data[ibin].push(ibin);
    data[ibin].push(0);
}

function MBhist(bodies) {
    var histodum = [];
    var dumx;
    var dumy;
    var dum;
    histodum.splice(0,histodum.length);
    for (ibin = 0; ibin < nbin; ibin++) {
        histodum.push(0);
    }
    for (ibody = 0; ibody < bodies.length; ibody++) {
        dumx = bodies[ibody].vx;
        dumy = bodies[ibody].vy;
        dum = Math.sqrt(dumx*dumx+dumy*dumy);
        ibin = (dum - tempmin) * nbin / (tempmax - tempmin) + 0.5;
        ibin = Math.round(dum)-1;
        if (dum >= 0 && dum < nbin) {
            histodum[ibin] += 1;
        }
    }
    return histodum;
}

for (istep = 0; istep < nstep; istep++) {
    bodies1 = ljStep(bodies1);

}

tdData.push([]);
idata = tdData.length - 1;
for (ibin = 0; ibin < nbin; ibin++) {
    tdData[idata].push(histodum[ibin]);
}
tdData.splice(0,1);
for (ibin = 0; ibin  < nbin; ibin++) {
    sum = 0;
    for (idata = 0; idata < tdData.length; idata++) {
        sum += tdData[idata][ibin];
    }
    data[ibin][1] = sum;
}
