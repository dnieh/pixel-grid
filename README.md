# pixel-grid
Draw pixel art using HTML canvas

### [Live Demo](http://danielnieh.com/)

## What is pixel-grid?
Pixel-grid is a pixel art editor built using just JavaScript and HTML canvas. It is highly customizable and is designed to be inserted into any web application.

## Usage
1. Include pixelGrid.js on your page. 
2. Define an HTML canvas element with a unique id (or data attribute if you prefer):
```html
<canvas data-anchor="grid"></canvas>
```
3. Use the API below.
4. Voila, start drawing Samus!

## JavaScript API
###pixelGrid.init([width][,height])
**Initializes the grid**

Optional Parameters: width {number of literal pixels}, height {number of literal pixels}. If no arguments are passed in, the grid will attempt to fill in the width of the parent container and dynamically set the height based on the screen size.

### pixelGrid.clear()
**Clears any drawing on the grid leaving only the grid.**

### pixelGrid.width(widthInput)
**Resizes the width of the grid based on the input parameter.**

Required Parameter: width {number of literal pixels}.

### pixelGrid.height(heightInput)
**Resizes the height of the grid based on the input parameter.**

Required Parameter: height {number of literal pixels}.

### pixelGrid.color(x, y, color)
**Draws in a pixel at a specific (x, y) coordinate.**

Required Parameters: x {number in scaled pixels}, y {number in scaled pixels}, color {string color code}.

### pixelGrid.batchColor(JSON)
**Batches the pixelGrid.color() method by taking in a JSON message. See below for the allowable format.**

Required Parameter: JSON {JSON}.

Sample JSON for pixelGrid.batchColor:
```JSON
var zero = {
    "name": "zero",
    "width": "",
    "height": "",
    "colors": {
        "black": "#000000",
        "white": "#ffffff",
        "darkRed": "#740000",
        "red": "#aa0000",
        "lightRed": "#ff0000",
        "lightGrey": "#bbbbbb",
        "grey": "#555555",
        "lightBlue": "#55aaff",
        "blue": "#0080ff",
        "orange": "#ff7700",
        "skin": "#ffbb80",
        "yellow": "#ffff00",
        "lightGreen": "#55d200",
        "green": "#358300"
    },
    "coordinates": [
        {"x": 16, "y": 0, "color": "black"},
        {"x": 15, "y": 1, "color": "black"},
        {"x": 16, "y": 1, "color": "black"},
        {"x": 20, "y": 1, "color": "black"},
        {"x": 14, "y": 2, "color": "black"},
        {"x": 15, "y": 2, "color": "darkRed"},
        {"x": 16, "y": 2, "color": "black"}
    ]
};
</p
```