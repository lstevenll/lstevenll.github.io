
function loadMagic() {
  var $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram = 
    $(go.Diagram, "canvasDiagramDiv",  // must name or refer to the DIV HTML element
      {
        // start everything in the middle of the viewport
        initialContentAlignment: go.Spot.Center,
        // have mouse wheel events zoom in and out instead of scroll up and down
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        // support double-click in background creating a new node
        "clickCreatingTool.archetypeNodeData": { text: "new node" },
        // enable undo & redo
        "undoManager.isEnabled": true
      })

  // define the Node template
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // define the node's outer shape, which will surround the TextBlock
      $(go.Shape, "RoundedRectangle",
        {
          parameter1: 20,  // the corner has a large radius
          fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
          stroke: null,
          portId: "",  // this Shape is the Node's port, not the whole Node
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
          cursor: "pointer"
        }),
      $(go.TextBlock,
        {
          font: "bold 11pt helvetica, bold arial, sans-serif",
          editable: true  // editing the text automatically updates the model data
        },
        new go.Binding("text").makeTwoWay())
    );

  // replace the default Link template in the linkTemplateMap
  myDiagram.linkTemplate =
    $(go.Link,  // the whole link panel
      {
        curve: go.Link.Bezier, adjusting: go.Link.Stretch,
        reshapable: true, relinkableFrom: true, relinkableTo: true,
        toShortLength: 3
      },
      new go.Binding("points").makeTwoWay(),
      new go.Binding("curviness"),
      $(go.Shape,  // the link shape
        { strokeWidth: 1.5 }),
      $(go.Shape,  // the arrowhead
        { toArrow: "standard", stroke: null }),
      $(go.Panel, "Auto",
        $(go.Shape,  // the label background, which becomes transparent around the edges
          {
            fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
            stroke: null
          }),
        $(go.TextBlock, "transition",  // the label text
          {
            textAlign: "center",
            font: "9pt helvetica, arial, sans-serif",
            margin: 4,
            editable: true  // enable in-place editing
          },
          // editing the text automatically updates the model data
          new go.Binding("text").makeTwoWay())
      )
    );
}

var S0 = { id: 0, x: 50,  y: 250, text: "S0" }
var S1 = { id: 1, x: 450, y: 250, text: "S1" }
var S2 = { id: 2, x: 250, y: 125, text: "S2" }
var S3 = { id: 3, x: 175, y: 375, text: "S3" }
var S4 = { id: 4, x: 325, y: 375, text: "S4" }
var stateArr = [S0, S1, S2, S3, S4]

function getStateIdFromText(text) {
  for (var i = 0; i < stateArr.length; i++) {
    if (getStateName(stateArr[i].text.substring(1,2)) === text) {
      return stateArr[i].id
    }
  }
}

function drawDiag(arr) {
  var nodeDataArray = []
  for (var i = 0; i < stateCount; i++) {
    var text = stateArr[i].text
    if (resetState === stateArr[i].text) {
      text = "Reset state: " + text
    }
    nodeDataArray.push({
      id: stateArr[i].id,
      loc: stateArr[i].x + " " + stateArr[i].y,
      text: text
    })
  }

  var linkDataArray = []
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i]
    linkDataArray.push({
      from: getStateIdFromText(row[0]),
      to: getStateIdFromText(row[2]),
      text: row[1]
    })
  }

  var jsonVal = { 
    "nodeKeyProperty": "id",
    "nodeDataArray": nodeDataArray,
    "linkDataArray": linkDataArray
  }
  myDiagram.model = go.Model.fromJson(jsonVal)
}