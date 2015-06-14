'use strict';

var pixelGrid = (function($) {
    var PIXEL_SCALE = 10; // Default: 10 literal pixel is 1 grid display pixel

    var $canvas = $('[data-anchor="grid"]');
    var canvas = $canvas[0];
    var currentColor = '#000'; // default black
    var backgroundColor = '#f2f2f2';
    var width;
    var height;
    var c; // context
    var cachedImage;

    function setInitialWidthAndHeight(initialWidth, initialHeight) {
        width = initialWidth || 
        $canvas.closest('[data-section="canvas"]').outerWidth() - 30; // -30 bootstrap padding
        height = initialHeight || calculateHeight();
        setDimensions(width, height);
    }

    /**
     * Tries to calculate height based on elements with the data-add-height attribute.
     * If data attribute not available, automatically sets height to width.
     */
    function calculateHeight() {
        var $sectionsHeight = $('[data-add-height]');
        var tempHeight = 0;

        if (!$sectionsHeight) {
            tempHeight = width;
        } else {
            $sectionsHeight.each(function() {
                tempHeight += $(this).outerHeight();
            });
            tempHeight = ($(window).height() - tempHeight) / 2;
        }
        // return tempHeight;
        return $('[data-section="settings"]').height();
    }


    function setDimensions(widthInput, heightInput) {
        // Save a copy of the current image
        var dataURL = $canvas[0].toDataURL();
        var image = new Image();

        image.src = dataURL;
        cachedImage = image;

        if (widthInput !== -1) {
            $canvas.attr('width', widthInput);
            width = widthInput;
        }
        if (heightInput !== -1) {
            $canvas.attr('height', heightInput);
            height = heightInput;
        }
    }

    /**
     * Listen for triggers from width and height input fields
     */
    function gridDimensionsListener() {
        $canvas.on('gridSetWidth', function(event, newWidth) {
            newWidth *= PIXEL_SCALE;
            setDimensions(newWidth, -1);
            draw(newWidth, height, true);
        });
        $canvas.on('gridSetHeight', function(event, newHeight) {
            newHeight *= PIXEL_SCALE;
            setDimensions(-1, newHeight);
            draw(width, newHeight, true);
        });
    }

    function clickEventListener() {
        $canvas.on('click', function(e) {
            var x;
            var y;
            var startX;
            var startY;

            // Get the relative position (offset)
            x = e.offsetX; // column or x-axis
            y = e.offsetY; // row or y-axis

            // Determine which pixel representation we're on. For example,
            // if the (x, y) coordinates are (8, 8), then we want to color
            // in the square starting from (1, 1) through (9, 9) while leaving
            // the border the existing grid colors of grey and red.
            startX = Math.floor(x / 10) * 10 + 1;
            startY = Math.floor(y / 10) * 10 + 1;

            // Fill the square with the selected color
            c.fillStyle = currentColor;
            c.fillRect(startX, startY, 9, 9);

            // Update the live render and the css code output
            x = getScaledCoordinate(startX);
            y = getScaledCoordinate(startY);
            $canvas.trigger('gridPixelAdded', [x, y, currentColor]);
        });
    }

    function getScaledCoordinate(coordinate) {
        return (coordinate - 1) / 10;
    }

    function setCurrentColor() {
        $canvas.on('gridSetCurrentColor', function(event, color) {
            currentColor = color;
        });
    }

    /**
     * @param gWidth {number} grid width
     * @param gHeight {number} grid height
     * @param preserveCurrentImage {bool}
     */
    function draw(gWidth, gHeight, preserveCurrentImage) {
        preserveCurrentImage = preserveCurrentImage || false;

        // Light grey background
        c.fillStyle = backgroundColor;
        c.fillRect(0, 0, gWidth, gHeight);

        // Grey grid
        c.fillStyle = "#999"
        for (var i = 0; i < gWidth || i < gHeight; i += 10) {
            c.fillRect(i, 0, 1, gHeight);
            c.fillRect(0, i, gWidth, 1);
        }

        // Red overlay grid
        c.fillStyle = "#d9534f";
        for (var i = 0; i < gWidth || i < gHeight; i+= 100) {
            c.fillRect(i, 0, 1, gHeight);
            c.fillRect(0, i, gWidth, 1);
        }

        // Re-draw cached image if it exists
        if (cachedImage && preserveCurrentImage) {
            c.drawImage(cachedImage, 0, 0);
        }
    }

    function clearGridListener() {
        $('[data-anchor="clearButton"]').on('click', function() {
            clear();
        });
    }

    function validateDimensionInput(side) {
        if (isNaN(side)) {
            return false;
        } else if (side < 0 || side > 1000) {
            return false;
        } else {
            return true;
        }
    }

    //==========================================================================
    // PUBLIC API
    //==========================================================================
    var init = function(initialWidth, initialHeight) {
        setInitialWidthAndHeight(initialWidth, initialHeight);
        gridDimensionsListener();
        clickEventListener();
        setCurrentColor();
        clearGridListener();

        if (canvas.getContext) {
            c = canvas.getContext('2d');
            draw(width, height);

            // Let width and height input know we're initialized to dynamically
            // set their values
            $canvas.trigger('gridDimensionsInitialized', [width, height]);
        } else {
            console.error('Error: Could not get canvas context.');
            return;
        }
    };

    var clear = function() {
        c.clearRect(0, 0, width, height);
        draw(width, height, false); // redraws the grid without the cached image
        $canvas.trigger('gridCleared');
    };

    /**
     * @param widthInput {number}
     */
    var width = function(widthInput) {
        if (!widthInput || !validateDimensionInput(widthInput)) {
            console.error('Error: please specify a valid width.');
            return;
        }
        setDimensions(widthInput, -1);
        draw(widthInput, height, true);
    };

    /**
     * @param heightInput {number}
     */
    var height = function(heightInput) {
        if (!heightInput || !validateDimensionInput(heightInput)) {
            console.error('Error: please specify a valid height.');
            return;
        }
        setDimensions(-1, heightInput);
        draw(width, heightInput, true);
    };

    /**
     * Public API Method for single pixel
     * TODO -- validate params
     */
    var colorPixel = function(x, y, color) {
        var startX = x * 10 + 1;
        var startY = y * 10 + 1;

        c.fillStyle = color;
        c.fillRect(startX, startY, 9, 9);
        startX = getScaledCoordinate(startX);
        startY = getScaledCoordinate(startY);
        $canvas.trigger('gridPixelAdded', [startX, startY, color]);
    };

    /**
     * Public API for JSON list of pixels
     * TODO -- validate params, JSON, and show error message
     */
    var batchColor = function(list) {
        var colors = list.colors;
        var details = list.coordinates;
        var colorCode;

        for (var i in details) {
            colorCode = colors[details[i].color];
            colorPixel(details[i].x, details[i].y, colorCode);
        }
    };

    return {
        init: init,
        clear: clear,
        width: width,
        height: height,
        colorPixel: colorPixel,
        batchColor: batchColor
    };
}($));

// Wait for page to load, otherwise grid could initialized before pixelArtCreator.js
$(function() {
    pixelGrid.init();
});