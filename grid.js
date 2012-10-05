/**
* Function creates and places the composite block object.
*/
function placeBlock(array, size, blockSize, anchorY, anchorX) {
  rect = new Kinetic.Rect({
    x: anchorX * blockSize,
    y: anchorY * blockSize,
    width: size * blockSize,
    height: size * blockSize,
    fill: 'green',
    opacity: Math.max(Math.random(),0.1)
  });
  for (var i = 0; i < Math.pow(size,2); i++) {
    var y = i % size;
    var x = Math.floor(i / size);
    array[anchorY + y][anchorX + x] = rect;
  }
  return rect;
}

/**
* Checks to see if a composite block object will fit.
*
* Fails if another composite block object would overlap
* with the new block.
*/
function canFit(array, size, anchorY, anchorX) {
  for (var i = 0; i < Math.pow(size,2); i++) {
    var y = i % size;
    var x = Math.floor(i / size);
    if (typeof array[anchorY + y][anchorX + x] !== 'undefined')
      return false;
  }
  return true;
}

/**
* When the DOM is loaded...
*
* Initialize the KineticJS stage.  Initialize the grid based on the size
* of the inner window dimensions.
*
* The algorithm is as follows:
*
* Starting with the first row, for each grid space in the row try
* to place a block of arbitrary size.  If the block can fit, create a new
* KineticJS Rectangle object and associate the appropriate grid spaces with
* the new rectangle object.
*
* If the block cannot fit, then reduce the size of the block.  Try to fit
* the block again after this.  If the size is reduced to zero, continue
* to move down the row, scanning for valid spots along the way.
*
* Repeat for all rows.
*/
window.onload = function(event) {
  var winWidth = window.innerWidth;
  var winHeight = window.innerHeight;
  var maxBlockLength = 30; // max side length for the block, in pixels
  var maxBlockNumber = 4; // max number of blocks per composite object, in 1D
  var maxNumBlockWidth = Math.floor(winWidth / maxBlockLength);
  var maxNumBlockHeight = Math.floor(winHeight / maxBlockLength);
  var layer = new Kinetic.Layer();
  
  //create the stage object
  var stage = new Kinetic.Stage({
    container: 'demo',
    width: winWidth - 2,
    height: winHeight - 2
  });
  
  // initialize block grid
  var blockArray = new Array(maxNumBlockHeight);
  for ( var i = 0; i < maxNumBlockHeight; i++)
    blockArray[i] = new Array(maxNumBlockWidth);
  
  for (var y = 0; y < maxNumBlockHeight; y++) {
    for (var x = 0; x < maxNumBlockWidth; x++) {
      
      var size = Math.floor(Math.random() * maxBlockNumber) + 1;
      
      while (size > 0) {
        
        // check array bounds
        if (((size + x) > maxNumBlockWidth ||
             ((size + y) > maxNumBlockHeight))) {
          size--;
          continue;
        }
        
        // check fit, then place
        // if not fit possible, reduce size and try again
        if (canFit(blockArray,size,y,x)) {
          layer.add(placeBlock(blockArray,size,maxBlockLength,y,x));
          break;
        }
        else
          size--;
        
      }
    }
  }
  
  randomIndex = Math.floor(Math.random() * layer.getChildren().length);
  // alert(randomIndex);
  randomComposite = layer.getChildren()[randomIndex];
  randomComposite.moveToTop();
  randomComposite.setScale(4,4);
  randomComposite.setAttrs({
    fill: 'red'
  });

  // layer.add(rect);
  stage.add(layer);
};