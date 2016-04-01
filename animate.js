var canvas_dim = [];
var container_dim = [];
var plotspace_dim = [];
var frametop_dim = [];
var framebottom_dim = [];
var frameleft_dim = [];
var frameright_dim = [];
var plot_bodies = [];

function getDimensions () {
    // [width, height, position.left, position.top] in px
    canvas_dim[0] = $(window).width();
    canvas_dim[1] = Math.floor(canvas_dim[0] * 0.5625); // 16:9 aspect ratio
    canvas_dim[2] = 0;
    canvas_dim[3] = 0;

    container_dim[0] = Math.floor(canvas_dim[0] * 0.95);
    container_dim[1] = Math.floor(container_dim[0] * 0.3); // fixed 10:3 aspect ratio
    container_dim[2] = Math.floor(canvas_dim[0] * 0.025);
    container_dim[3] = Math.floor(canvas_dim[0] * 0.025);

    plotspace_dim[0] = Math.floor(canvas_dim[0] * 0.95);
    plotspace_dim[1] = Math.floor(canvas_dim[1] * 0.85 - container_dim[1]);
    plotspace_dim[2] = Math.floor(canvas_dim[0] * 0.025);
    plotspace_dim[3] = Math.floor(canvas_dim[1] * 0.1 + container_dim[1]);

    frametop_dim[0] = Math.floor(canvas_dim[0]);
    frametop_dim[1] = Math.floor(canvas_dim[0] * 0.025);
    frametop_dim[2] = Math.floor(0);
    frametop_dim[3] = Math.floor(0);

    framebottom_dim[0] = Math.floor(canvas_dim[0]);
    framebottom_dim[1] = Math.floor(canvas_dim[0] * 0.05 + plotspace_dim[1]);
    framebottom_dim[2] = Math.floor(0);
    framebottom_dim[3] = Math.floor(canvas_dim[0] * 0.025 + container_dim[1]);

    frameleft_dim[0] = Math.floor(canvas_dim[0] * 0.025);
    frameleft_dim[1] = Math.floor(container_dim[1]);
    frameleft_dim[2] = Math.floor(0);
    frameleft_dim[3] = Math.floor(canvas_dim[0] * 0.025);

    frameright_dim[0] = Math.floor(canvas_dim[0] * 0.025);
    frameright_dim[1] = Math.floor(container_dim[1]);
    frameright_dim[2] = Math.floor(canvas_dim[0] * 0.025 + container_dim[0]);
    frameright_dim[3] = Math.floor(canvas_dim[0] * 0.025);
}

function newStyle (bodies) {
    getDimensions ();
    var dumx;
    var dumy;

    var cssElement = document.getElementById("canvas");
    cssElement.style.width = canvas_dim[0] + 'px';
    cssElement.style.height = canvas_dim[1] + 'px';
    cssElement.style.left = canvas_dim[2] + 'px';
    cssElement.style.top = canvas_dim[3] + 'px';

    cssElement = document.getElementById("container");
    cssElement.style.width = container_dim[0] + 'px';
    cssElement.style.height = container_dim[1] + 'px';
    cssElement.style.left = container_dim[2] + 'px';
    cssElement.style.top = container_dim[3] + 'px';

    cssElement = document.getElementById("plotspace");
    cssElement.style.width = plotspace_dim[0] + 'px';
    cssElement.style.height = plotspace_dim[1] + 'px';
    cssElement.style.left = plotspace_dim[2] + 'px';
    cssElement.style.top = plotspace_dim[3] + 'px';

    cssElement = document.getElementById("frametop");
    cssElement.style.width = frametop_dim[0] + 'px';
    cssElement.style.height = frametop_dim[1] + 'px';
    cssElement.style.left = frametop_dim[2] + 'px';
    cssElement.style.top = frametop_dim[3] + 'px';

    cssElement = document.getElementById("framebottom");
    cssElement.style.width = framebottom_dim[0] + 'px';
    cssElement.style.height = framebottom_dim[1] + 'px';
    cssElement.style.left = framebottom_dim[2] + 'px';
    cssElement.style.top = framebottom_dim[3] + 'px';

    cssElement = document.getElementById("frameleft");
    cssElement.style.width = frameleft_dim[0] + 'px';
    cssElement.style.height = frameleft_dim[1] + 'px';
    cssElement.style.left = frameleft_dim[2] + 'px';
    cssElement.style.top = frameleft_dim[3] + 'px';

    cssElement = document.getElementById("frameright");
    cssElement.style.width = frameright_dim[0] + 'px';
    cssElement.style.height = frameright_dim[1] + 'px';
    cssElement.style.left = frameright_dim[2] + 'px';
    cssElement.style.top = frameright_dim[3] + 'px';

    for (ibody = 0; ibody < bodies.length; ibody++) {
        plot_bodies.push( [] );
        plot_bodies[ibody].push(bodies[ibody].r); // this is in coordinate space
        dumx = bodies[ibody].x - bodies[ibody].r;
        plot_bodies[ibody].push(zToPercent (dumx,xmax)); // percent of container
        dumy = bodies[ibody].y - bodies[ibody].r;
        plot_bodies[ibody].push(zToPercent (dumy,ymax)); // percent of container
        plot_bodies[ibody].push(bodies[ibody].color);
//        dumx = Math.abs(bodies[ibody].x)+bodies[ibody].r;
//        if (dumx > xmax) {
//            plot_bodies.push( [] );
//            plot_bodies[ibody].push(bodies[ibody].r);
//            dumx = wrap(bodies[ibody].x,xmax);
//            dumx -= bodies[ibody].r;
//            plot_bodies[ibody].push(zToPercent (dumx,xmax));
//            dumy = bodies[ibody].y - bodies[ibody].r;
//            plot_bodies[ibody].push(zToPercent (dumy,ymax));
//            plot_bodies[ibody].push(bodies[ibody].color);
//        }
//        dumy = Math.abs(bodies[ibody].y)+bodies[ibody].r;
//        if (dumy > ymax) {
//            plot_bodies.push( [] );
//            plot_bodies[ibody].push(bodies[ibody].r);
//            dumx = bodies[ibody].x - bodies[ibody].r;
//            plot_bodies[ibody].push(zToPercent (dumx,xmax));
//            dumy = wrap(bodies[ibody].y,ymax);
//            dumy -= bodies[ibody].r;
//            plot_bodies[ibody].push(zToPercent (dumy,ymax));
//            plot_bodies[ibody].push(bodies[ibody].color);
//        }
//        dumx = Math.abs(bodies[ibody].x)+bodies[ibody].r;
//        dumy = Math.abs(bodies[ibody].y)+bodies[ibody].r;
//        if (dumx > xmax && dumy > ymax) {
//            plot_bodies.push( [] );
//            plot_bodies[ibody].push(bodies[ibody].r);
//            dumx = wrap(bodies[ibody].x,xmax);
//            dumx -= bodies[ibody].r;
//            plot_bodies[ibody].push(zToPercent (dumx,xmax));
//            dumy = wrap(bodies[ibody].y,ymax);
//            dumy -= bodies[ibody].r;
//            plot_bodies[ibody].push(zToPercent (dumy,ymax));
//            plot_bodies[ibody].push(bodies[ibody].color);
//        }
    }

    for (ibody = 0; ibody < plot_bodies.length; ibody++) {
        dumstring = "body" + ibody;
        cssElement = document.getElementById(dumstring);
        cssElement.style.left = plot_bodies[ibody][1] + '%';
        cssElement.style.top = plot_bodies[ibody][2] + '%';
        cssElement.style.background = plot_bodies[ibody][3];
        cssElement.style.height = plot_bodies[ibody][0]/ymax * 100 + '%';
        cssElement.style.width = plot_bodies[ibody][0]/xmax * 100 + '%';
    }
    plot_bodies.splice(0,plot_bodies.length);
}

function zToPercent (z,zmax) {
    z += zmax;
    return z/(zmax*2)*100;
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

