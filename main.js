// Initialisation

var add = $("#addRegion"),
  remove = $("#removeRegion"),
  raise = $("#raiseRegion"),
  lower = $("#lowerRegion");

nameList = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J"
];
colorList = [
  "#69D2E7",
  "#556270",
  "#C7F464",
  "#C44D58",
  "#29A9B3",
  "#C47147",
  "#43275C",
  "#FFC48C",
  "#00CC50",
  "#953DFF"
  ];

var canvasElement = $("#canvas");
var canvasHeight = (canvasElement.attr("height")) / 2;
var canvasWidth = (canvasElement.attr("width")) / 2;

var layoutRows = {
  regions: [],
  height: canvasHeight,
  width: canvasWidth
};


var canvasLayout = [];

if (!("Proxy" in window)) {
    console.warn("Your browser doesn't support Proxies.");

 }



  // a proxy for our array
  var canvasLayoutProxy = new Proxy(canvasLayout, {
    deleteProperty: function(target, property) {
      console.log("Deleted %s", property);
      return true;
    },
    set: function(target, property, value, receiver) {
      if(property != "length") {
        addRegion(value);
        target[property] = value;
      }
      return true;
    }
  });

  // console.log("Set a specific index..");
  // proxy[0] = "x";
  //
  // console.log("Add via push()...");
  // proxy.push("z");
  //
  // console.log("Add/remove via splice()...");
  // proxy.splice(1, 3, "y");
  //
  // console.log("Current state of array: %o", array);

 var canvas = new fabric.Canvas("canvas");


function initialiseCanvas() {
  var regionHeight = layoutRows.height;
  var regionWidth = layoutRows.width;
  var regionY = Math.floor(Math.random() * regionHeight + 0);
  var regionX = Math.floor(Math.random() * regionWidth + 0);
  var name = nameList.shift();
  var color = colorList.shift();
  var regionId = name;

  //defining the sections in canvas
  var rect = new fabric.Rect({
    width: layoutRows.width,
    height: layoutRows.height,
    angle: 0,
    fill: color,
    originX: 'center',
    originY: 'center'
  });

  var text = new fabric.Text(name, {
    fontSize: 30,
    originX: 'center',
    originY: 'center'
  });

  var group = new fabric.Group([rect, text], {
    id: regionId,
    left: regionX,
    top: regionY,
    angle: 0,
    hasRotatingPoint: false,
    cornerStyle: "rect",
    lockRotation: true,
    lockScalingFlip: true,
  });

  //adding the sections
  canvas.add(group);

  canvas.item(layoutRows.regions.length).set({
      borderColor: "black",
      cornerColor: "black",
      cornerSize: 12,
      transparentCorners: false
  });

  canvas.setActiveObject(canvas.item(layoutRows.regions.length));
  canvas.renderAll();



  var regionSpecification = {
    id: regionId,
    y: regionY,
    x: regionX,
    width: regionWidth,
    height: regionHeight
  };

  var layout = { regionSpecification, name, color };
  canvasLayout.push(layout);
  console.log("canvasLayout: ", canvasLayout);

  layoutRows.regions.push(regionSpecification);



  canvas.on("object:moving", function(t) {
    var e = t.target;
    var i = Math.ceil(e.height * e.scaleY);
    var s = Math.ceil(e.width * e.scaleX);
    e.setTop(Math.floor(Math.min(Math.max(0, e.top), this.height - i)));
    e.setLeft(Math.floor(Math.min(Math.max(0, e.left), this.width - s)));
  });

  canvas.on("object:scaling", function(t) {
    var e = t.target;
    var i = Math.ceil(e.height * e.scaleY);
    var s = Math.ceil(e.width * e.scaleX);
    if (e.top < 0) {
      e.setScaleY((e.getHeight() + e.top) / e.height);
      e.setTop(0);
    } else if (e.top > this.height) {
      e.setTop(this.height - 1);
    }
    if (e.left < 0) {
      e.setScaleX((e.getWidth() + e.left) / e.width);
      e.setLeft(0);
    } else if (e.left > this.width) {
      e.setLeft(this.width - 1);
    }
    if (e.top + i > this.height) {
      e.setScaleY((this.height - e.top) / e.height);
    }
    if (e.left + s > this.width) {
      e.setScaleX((this.width - e.left) / e.width);
    }
  });
}

initialiseCanvas();

add.on("click", function(e) {
  if (layoutRows.regions.length < 10) {
    var height = layoutRows.height;
    var width = layoutRows.width;
    var y = Math.floor(Math.random() * height + 0);
    var x = Math.floor(Math.random() * width + 0);
    var name = nameList.shift();
    var color = colorList.shift();
    var id = name;

    var regionSpecification = { id, y, x, width, height };

    var layout = { regionSpecification, name, color };
    console.log("layout ", layout)
    canvasLayoutProxy.push(layout);

    layoutRows.regions.push(regionSpecification);
    console.log("layoutRows: ", layoutRows)

    console.log("canvasLayout: ", canvasLayout)
  }
});


function addRegion(layout) {

      var { regionSpecification, name, color } = layout;

      console.log("Adding the following region: ", regionSpecification + " " + name + " " + color);

      //defining variables
      var regionHeight = regionSpecification.height;
      var regionWidth = regionSpecification.width;
      var regionY = regionSpecification.y;
      var regionX = regionSpecification.x;
      var regionId = regionSpecification.id;

      //defining the sections in canvas
      var rect = new fabric.Rect({
        width: regionWidth,
        height: regionHeight,
        angle: 0,
        fill: color,
        originX: 'center',
        originY: 'center'
      });

      var text = new fabric.Text(name, {
        fontSize: 30,
        originX: 'center',
        originY: 'center'
      });

      var group = new fabric.Group([rect, text], {
        id: regionId,
        left: regionX,
        top: regionY,
        angle: 0,
        hasRotatingPoint: false,
        cornerStyle: "rect",
        lockRotation: true,
        lockScalingFlip: true,
      });

      //adding the sections
      canvas.add(group);
      console.log("Added")

      canvas.item(layoutRows.regions.length).set(
        {
          borderColor: "black",
          cornerColor: "black",
          cornerSize: 12,
          transparentCorners: false
        }
      );
      canvas.setActiveObject(canvas.item(layoutRows.regions.length));
      canvas.renderAll();


}

function removeSelectedRegion () {
  var selectedRegion = canvas.getActiveObject();
  console.log("selectedRegionId: ", selectedRegion.id);

  const regionId = selectedRegion.id;

  //Remove from layoutRows
  console.log("layoutRows: ", layoutRows);


  //Remove from canvasLayout
  console.log("canvasLayout: ", canvasLayout);

  //get the index of the element to be removed
  var canvasLayoutRowId = -1;

  for(var i = 0; i < canvasLayout.length; i++) {
    if(canvasLayout[i].regionSpecification.id === regionId) {
      canvasLayoutRowId = i;
      break;
    }
  }


  canvasLayout.splice(canvasLayoutRowId, 1);


  console.log("After removal: ", canvasLayout);


  //Refresh with canvasLayout
  //refreshCanvasLayout();
}

function refreshCanvasLayout() {

}






remove.on("click", function(e) {

  removeSelectedRegion();

});

raise.on("click", function(e) {
  console.log(e);
});

lower.on("click", function(e) {
  console.log(e);
});
