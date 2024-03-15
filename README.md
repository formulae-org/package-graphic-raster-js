# package-graphic-raster-js

Raster graphics package for the [Fōrmulæ](https://formulae.org) programming language.

Fōrmulæ is also a software framework for visualization, edition and manipulation of complex expressions, from many fields. The code for an specific field —i.e. arithmetics— is encapsulated in a single unit called a Fōrmulæ **package**.

This repository contains the source code for the **raster graphics package**. It contains reduction to create

The GitHub organization [formulae-org](https://github.com/formulae-org) encompasses the source code for the rest of packages, as well as the [web application](https://github.com/formulae-org/formulae-js).

<!--
Take a look at this [tutorial](https://formulae.org/?script=tutorials/Complex) to know the capabilities of the Fōrmulæ arithmetic package.
-->

### Capabilities ###

* Creation of a blank image
* Creation of a image from a file
* Retrieving the dimensions of an image
* Duplication of an image
* Pixel operations
    Set/Get the color of a single pixel
* Line operations
    * From position to position
    * From position to offset
    * From last position to position
    * From last position to offset
* Rectangle operations
    * Draw from corner to corner
    * Draw from corner to size
    * Fill from corner to corner
    * Fill from corner to size
* Circle/ellipse operations
    * Draw from corner to corner
    * Draw from corner to size
    * Draw given center and radius
    * Fill from corner to corner
    * Fill from corner to size
    * Fill given center and radius
* Arc operations
    * Draw from corner to corner
    * Draw from corner to size
    * Draw given center and radius
    * Fill from corner to corner
    * Fill from corner to size
    * Fill given center and radius
* Insert image into image
* Text operations
    * Retrieve size of text when drawing
    * Draw text
* Turtle graphics
    * Set/get/offset current position
    * Set/get current angle
    * Forward with/without drawing
    * Turn
* Coordinate system operations
    * Reset coordinates
    * Add translation
    * Add scaling
    * Add rotation
    * Set a coordinate system given coordinates of corners
* Set state of painting
    * Set/retrieve current color
    * Set/retrieve stroke width
    * Set whether stroke is affected by scale or not
    * Set mode
       * Normal (paint mode)
       * XOR mode
    * Set drawing arc
       * Open
       * Closed (as pie)

### Gallery

Visit [this Pinterest galley](https://www.pinterest.com/formulae_org/_created/) of images created with Fōrmulæ, using the raster graphics package.
