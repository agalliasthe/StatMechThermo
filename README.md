Explanation of general algortithm:
(1) initialize
(2) equilibrate
(3) animate
  (3.1) move each particle one step of length dt
  (3.2) update graph according to routine

Each of these are specific to the routine and are contained within a
<script>JavaScript</script> section of the html file.

All functions that the routine depends on are in external JavaScript
files, dynamics.js, plot.js and animate.js
--dynamics.js contains all functions pertaining to the motion of the
bodies (velocity verlet steps, calling energy/forces)
--plot.js contains all functions pertaining to any of the plots (temperature
histograms, number of particles, etc)
--jquery.js is external library of functions. The functions in plot.js make
use of this library.

Adjustible parameters:


Comments on each of the routines:
---MB distribution
Initializes all particles with random velocity (and radius) in the box.
Plot tracks temperature (total kinetic energy) in time.

---Left side of box
Initializes all particles on the left side of the box.
Plot tracks the number of particles on each side as a function of time.

---Heat Flux
Source and sink. Kinetic energy is increased when the particle enters a hot
zone. Decreases when enters the cold zone.
Plot tracks temperature (kinetic energy) as a function of position in the box.

---


------------------------------------
Other notes:
All functions modify local variables only. They make use of some global parameters (like
xmax, dt, temperature), but all "dynamic" global variables should be redefined after the
function is called.

Generally, the local variables within a function are labeled without numbers (i.e. x, xa,
xb, bodies, etc), while global variables have a number attached (bodies1, etc)

------------------------------------
List of variables:
parameters:

variables:
scalars:

arrays:

-------------------------------------
Notes on the class file (style.css):
The animation will not run if there are not enough bodies in the style file. Add additional
bodies:
#body51 {
    background-color: #FFFFFF;
    top: -25%;
    left: -25%;
    width:3%;
    height:10%;
}
Number them sequentially (e.g. #body51, #body52). Additionally, place the bodies in
the html file:
    <div class="ball" id="body0"></div>
inside of the container at the top of the <body> section.
The class file places all bodies off the canvas and brings them in according to the needs
of the routine. I haven't yet resolved the issue of cloning the particles to appear
on both sides of the box at the same time.

-------------------------------------
To do:
clones
mouse clicks
Add statement to pbc that prevents from bouncing in the wall. -xi/abs(xi)*vxi
Langevin
Play with units
