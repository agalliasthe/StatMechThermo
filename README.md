Explanation of general algorithm:

1 Initialize bodies -- position them equally throughout the box, give them random velocities pulled from a normal distribution at a given temperature in a random direction.

2 Equilibrate -- take just a couple of steps before the animation starts to mix them up from the initial configuration.

3 Simulate

3.1 Move each particle one step of length dt. Within the function "frame" in the html file, there are two lines: one for elastic collisions (still a little buggy), the other for Lennard-Jones interactions (does pretty well). Comment one of these.

3.2 Call newStyle to update bodies to their new positions in the animation.

3.3 Update plot data according to routine. When the quantity if tracked in time, the routine splices the earliest data point and renumbers all remaining data from zero.

3.4 Use flot to update the plot in the animation.


The initial conditions and parameters of each of these are specific to the routine and are contained within a <script>JavaScript</script> section of the html file.

All functions that the routine depends on are in external JavaScript files, dynamics.js, plot.js and animate.js

--dynamics.js contains all functions pertaining to the motion of the bodies (velocity verlet steps, calling energy/forces) and all functions pertaining to any of the plots (temperature histograms, number of particles, etc)

--animate.js contains the file used to animate the bodies (newStyle function, colors vector, etc)

--jquery.js and jquery.flot.js are external libraries of functions. The functions in plot.js make use of these libraries.


Additional comments on each of the files:

--SomeProgress.html is a file to play with routine parameters and the plot style. The plot data is just random numbers.

--scratchwork.js is a js file to debug functions with the command line

Simulations:

--(done) Left side of box: Initializes all particles on the left side of the box. Tracks the number of particles on each side as a function of time.

--(almost done) MB distribution: Plots a histogram of kinetic energy of the particles for each frame. Histogram contains data from the last n time steps.

--(working on it...) MB temp: Initializes all particles with random velocity (and radius) in the box. Tracks temperature (total kinetic energy) in time.

--(working on it...) Heat Flux: Source and sink. Kinetic energy increases when the particle enters a hot zone. Decreases when enters the cold zone. Plots temperature as a function of position in the box.

------------------------------------
Other notes:

All functions in dynamics.js and plot.js modify local variables only. They make use of some global parameters (like xmax, dt, temperature), but all "dynamic" global variables should be redefined after the function is called.

Generally, the local variables within a function are labeled without numbers (i.e. x, xa, xb, bodies, etc), while global variables have a number attached (bodies1, etc)

------------------------------------
List of variables:

parameters:

--rmax = Maximum radius of a body. If random radius is assigned, the radius can be anywhere from rmax/2 to rmax. Random radii can be assigned by uncommenting the r0 = Math.random() line in the initialization do-loops.

--req = Lennard-Jones equilibrium radius. For now all bodies have same r_eq. Working on generalizing this.

--epsilon = Lennard-Jones depth of potential well at req.

--rcut = LJ forces include bodies that are within this distance. All other bodies are considered non-interacting. Shouldn't be more than half the length of the box.

--xmax = length of the box in the x-dimension. The algorithm assumes the center of the box is (0,0), so the total length of the box is 2 * xmax.

--ymax = length of the box in the y-dimension. The algorithm assumes the center of the box is (0,0), so the total height of the box is 2 * ymax.

--temp = Temperature. Velocities are pulled from a normal distribution centered around this value.

--tempmin/tempmax = Minimum and maximum values for the temperature. These have little impact on anything except for assigning the temperature. In actuality, velocities can go above or below these values. They just seemed to be appropriate limits to make the colors make sense.

--dt = Timestep

--periodicbc = Periodic boundary conditions are on if this is set to 1. They are off if it is set to 0. (This is not fully implemented yet... for now pbc are always on)

--initialspace = Initial spacing for the bodies when they are put in the box. Make sure it is big enough. It will wig out if it is too small given the req or rmax.

--ndata = number of time steps included in the data. In the plots that track a quantity in time, the flot plot splices the initial value to maintain a total length of ndata. In this histogram plots, the data vector is comprised of a sum of data from the last ndata time steps.

--nframe = number of time steps between plot updates

--nstep = number of time steps in a loop

variables:

--bodies1[] = vector containing the bodies. Each bodies is an object with keys describing the position, velocity, acceleration, mass, radius, and color.

--data1[] = vector with ndata x 2 elements. data[0] has 0..ndata. data[1] has the actual data in it. Feed this to flot to plot the data in the graph.

-------------------------------------
Notes on the class file (style.css):

The animation will not run if there are not enough bodies in the style file. Add additional bodies to style.css and number them sequentially (e.g. #body51, #body52). Additionally, place the bodies in the html file inside of the container at the top of the <body> section. The class file places all bodies off the canvas and brings them in according to the current position of the bodies in the simulation.

I haven't yet implemented cloning the particles to appear on both sides of the box at the same time. Elements frametop, framebottom, frameleft, frameright cover the edges of the box so that the bodies are covered when they exit the box.

It would be ideal to define the dimensions of the container in the canvas with percentages, but flot requires the dimensions to be in pixels. That's why there is a function getDimensions to resize each of the elements in the window every time newStyle is called. I'm going to change this to only call when the window is resized, but I need to set up a listener for that...

-------------------------------------
To do:

mouse clicks. event listener for window resize

MB-temp simulation

MB-distribution simulation

Heat flux simulation

Finish PBC. Add statement to pbc that prevents from bouncing in the wall. -xi/abs(xi)*vxi

Add statement to prevent balls from sticking together after an elastic collision. This happens when the step doesn't step far enough out of the boundaries of the circle

Langevin

Play with units

generalize to handle different r_eq for different bodies

clones


