var inputCount = 1
var outputCount = 1
var stateCount = 1
var inputs = []
var outputs = []
var stateTransitionTable = []
var stateCountArray = []
var resetState = "S0"
var outputTable = []
var USER_INPUT = {
	inputs: [],
	ouputs: [],
	states: [],
	resetState: [],
	transitionT: [],
	type: [],
	outputT: [],
}

// pre-loading
$(document).ready(() => {
  updateTextArea(true)
  updateTextArea(false)
  loadMagic()
})

// step 1
$("#inputItemCount").change(() => {
  inputCount = $("#inputItemCount option:selected").val()
  updateTextArea(true)
})

$("#outputItemCount").change(() => {
  outputCount = $("#outputItemCount option:selected").val()
  updateTextArea(false)
})

// create textareas and add to html dynamically
function updateTextArea(isInput) {
  var count = isInput ? inputCount : outputCount
  var selectedArea = isInput ? $("#inputTextAreas") : $("#outputTextAreas")

  selectedArea.empty()
  selectedArea.append(isInput ? $("<p>Input:</p>") : $("<p>Output:</p>"))


  for (var i = 0; i < count; i++) {
    var id = isInput ? "inputTextArea" : "outputTextArea"
    id += (i + 1)
    var textArea = $("<p><textarea id=" + id + "/></p>")
    selectedArea.append(textArea)
  }
}

 // store data for inputs and outputs
function submitForm1() {
  inputs = []
  outputs = []

  for (var i = 0; i < inputCount; i++) {
    var id = "inputTextArea" + (i + 1)
    inputs.push($("#" + id).val())
  }

  for (var i = 0; i < outputCount; i++) {
    var id = "outputTextArea" + (i + 1)
    outputs.push($("#" + id).val())
  }

  if (!isInputValid(inputs)) {
    $("#validationError").text("Invalid input!")
    return
  } else if (!isInputValid(outputs)) {
    $("#validationError").text("Invalid output!")
    return
  } else if (!isUnique(inputs.concat(outputs))) {
    $("#validationError").text("Every input and output must be unique!")
    return
  } else {
    $("#validationError").text("")
  }

  $("#step2").show()
  configStateTransitionStateNameTable()
  configStateTransitionTable()
  updateStateTransitionTable()
  updateResetState()
}

function isInputValid(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!validateString(arr[i].trim())) {
      return false
    }
  }
  return isUnique(arr)
}

// check for duplication
function isUnique(arr) {
  var set = new Set()
  arr.forEach(a => { set.add(a) })
  return set.size == arr.length
}

function validateString(input) {
  if (input.length === 0 || input.length > 20) {
    return false
  }
  var regex = /^([a-zA-Z0-9_]+)$/
  return regex.test(input)
}

// step 2
function configStateTransitionTable() {
  var tableHead = $("#stateTransitionTableHead")
  tableHead.empty()
  tableHead.append("<th>Current State</th>")
  for (var i = 0; i < inputCount; i++) {
    tableHead.append("<th>Input #" + (i + 1) + " (" + inputs[i] + ") " + "</th>")
  }
  tableHead.append("<th>Next State</th>")
}

function updateStateTransitionTable() {
  stateCountArray = []

  // update table
  var tableBody = $("#stateTransitionTableBody")
  tableBody.empty()

  for (var i = 0; i < stateCount; i++) {
    stateCountArray.push(1)

    var tableRow = generateTransitionTableRow(i, 0)
    tableRow.append("<td><button onclick='addRow(" + i + ")'>+</button></td>")
    tableBody.append(tableRow)
  }
}

function generateTransitionTableRow(stateIndex, rowIndex) {
  var tableRow = $("<tr></tr>")
  var stateName = $("#transitionStateName" + stateIndex).val()
  if (!stateName) {
    stateName = ""
  }
  var state = "S" + stateIndex + " (" + stateName + ") "
  tableRow.append("<td>" + state + "</td>")

  // dropdown for input
  for (var i = 0; i < inputCount; i++) {
    var id = "state" + stateIndex + "Row" + rowIndex + "Input" + (i + 1)
    var selection = ("<td>" 
      + "<select name='inputStateSelector' id='" + id + "'>" 
      + getInputOptionString()
      + "</select>" 
      + "</td>")
    tableRow.append(selection)
  }

  var nextStateId = "state" + stateIndex + "Row" + rowIndex + "NextState"
  tableRow.append("<td><select name='nextStateSelector' id='" + nextStateId + "'>" + getStateOptionString() + "</select></td>")

  return tableRow
}

function getInputOptionString() {
  return ("<option value='0'>0</option>" 
        + "<option value='1'>1</option>" 
        + "<option value='x'>X</option>")
}

function addRow(state) {
  if (stateCountArray[state] >= stateCount) {
    $("#addRowError").text("Maximum number of state-change reached.")
    return
  } else {
    $("#addRowError").text("")
  }

  var inserIndex = stateCountArray
                  .slice(0, state + 1)
                  .reduce((a, b) => { return a + b }, 0)
  var tableRow = generateTransitionTableRow(state, stateCountArray[state])
  $("#stateTransitionTableBody > tr:nth-child(" + inserIndex + ")").after(tableRow)
  stateCountArray[state]++
}

function updateResetState() {
  $("#resetStateSelection").empty()
  $("#resetStateSelection").append(getStateOptionString())
  resetState = "S0"
}

$("#stateCount").change(() => {
  stateCount = $("#stateCount option:selected").val()
  $("#addRowError").text("")
  configStateTransitionStateNameTable()
  updateStateTransitionTable()
  updateResetState()
})

function configStateTransitionStateNameTable() {
  var tableBody = $("#stateTransitionStateNameBody")
  tableBody.empty()
  for (var i = 0; i < stateCount; i++) {
    var tableRow =  $("<tr></tr>")
    tableRow.append("<td>S" + i + "</td>")
    tableRow.append("<textarea id=transitionStateName" + i + "/>")
    tableBody.append(tableRow)
  }
}

function setStateName() {
  updateStateTransitionTable()
  $("#addRowError").text("")
}

$("#resetStateSelection").change(() => {
  resetState = $("#resetStateSelection option:selected").val()
})

function getStateOptionString() {
  var stateOptions = ""
  for (var j = 0; j < stateCount; j++) {
    var stateId = "S" + j
    stateOptions += "<option value='" + stateId + "'>" + stateId + "</option>" 
  }
  return stateOptions
}

 // store data for stateTransitionTable
function submitForm2() {
  stateTransitionTable = []
  for (var i = 0; i < stateCount; i++) {
    var state = "S" + i + " (" + getStateName(i) + ")"
    for (var j = 0; j < stateCountArray[i]; j++) {
      var transitionRow = [state]
      for (var k = 0; k < inputCount; k++) {
        var id = "state" + i + "Row" + j + "Input" + (k + 1)
        transitionRow.push($("#" + id + " option:selected").text())
      }
      var nextStateId = "state" + i + "Row" + j + "NextState"
      transitionRow.push($("#" + nextStateId + " option:selected").text())
      stateTransitionTable.push(transitionRow)
    }
  }

 
  $("#step3").show()
}

//step 3
function getStateName(i) {
  var stateName = $("#transitionStateName" + i).val()
  if (!stateName) {
    stateName = ""
  }
  return stateName
}


function showMoore() {
  $("#mealy").hide()
  $("#moore").show()
  configMooreTable()
}

function showMealy() {
  $("#moore").hide()
  $("#mealy").show()
  configMealyTable()
}

function configMooreTable() {
  // table head
  var tableHead = $("#outputTableHead")
  tableHead.empty()
  tableHead.append("<th>Current State</th>")
  for (var i = 0; i < outputCount; i++) {
    tableHead.append("<th>Output #" + (i + 1) + "(" + outputs[i] + ")</th>")
  }

  // table body
  var tableBody = $("#outputTableBody")
  tableBody.empty()
  for (var i = 0; i < stateCount; i++) {
    var tableRow = $("<tr></tr>")
    var state = "S" + i + " (" + getStateName(i) + ") "

    tableRow.append("<td>" + state + "</td>")
    for (var j = 0; j < outputCount; j++) {
      var id = "moore" + (i + 1) + "output" + (j + 1)
      var selection = ("<td>" 
        + "<select id='" + id + "'>" 
        + getOutputOptionString()
        + "</select>" 
        + "</td>")
      tableRow.append(selection)
    }
    tableBody.append(tableRow)
  }
}

function getOutputOptionString() {
  return ("<option value='0'>0</option>" 
        + "<option value='1'>1</option>")
}

// store data for outputTable
function submitMoore() {
  outputTable = []
  for (var i = 0; i < stateCount; i++) {
    var state = getStateName(i)
    var outputString = ""
    for (var j = 0; j < outputCount; j++) {
      var id = "moore" + (i + 1) + "output" + (j + 1)
      outputString += $("#" + id + " option:selected").text()
    }
    outputTable.push([state, outputString])
  }

  submitForm3("Moore", outputTable)
}

function configMealyTable() {
  // table head
  var tableHead = $("#mealyTableHead") 
  tableHead.empty()
  tableHead.append("<th>Current State</th>")
  for (var i = 0; i < inputCount; i++) {
    tableHead.append("<th>Input #" + (i + 1) + " (" + inputs[i] + ") " + "</th>")
  }
  for (var i = 0; i < outputCount; i++) {
    tableHead.append("<th>Output #" + (i + 1) + "(" + outputs[i] + ")</th>")
  }

  // table body
  var tableBody = $("#mealyTableBody")
  tableBody.empty()
  for (var i = 0; i < stateTransitionTable.length; i++) {
    tableBody.append(getMealyTableRow(stateTransitionTable, i))
  }
}

function getMealyTableRow(arr, index) {
  var tableRow = $("<tr></tr>")
  var arrRow = arr[index]
  for (var i = 0; i < arrRow.length - 1; i++) {
    tableRow.append("<td>" + arrRow[i] + "</td>")
  }
  for (var j = 0; j < outputCount; j++) {
    var id = "mealy" + (index + 1) + "output" + (j + 1)
    var selection = ("<td>" 
      + "<select id='" + id + "'>" 
      + getOutputOptionString()
      + "</select>" 
      + "</td>")
    tableRow.append(selection)
  }
  return tableRow
}

function submitMealy() {
  outputTable = []
  for (var i = 0; i < stateTransitionTable.length; i++) {
    var row = stateTransitionTable[i]
    var state = getStateName(row[0].substring(1,2))

    var inputString = ""
    for (var j = 1; j < row.length - 1; j++) {
      inputString += row[j]
    }

    var outputString = ""
    for (var j = 0; j < outputCount; j++) {
      var id = "mealy" + (i + 1) + "output" + (j + 1)
      outputString += $("#" + id + " option:selected").text()
    }

    outputTable.push([state, inputString, outputString])
  }

  submitForm3("Mealy", outputTable)
}

function submitForm3(type, outputT) {
  // state names
  var states = []
  for (var i = 0; i < stateCount; i++) {
    states.push($("#transitionStateName" + i).val())
  }

  var transitionT = []
  for (var i = 0; i < stateTransitionTable.length; i++) {
    var row = stateTransitionTable[i]
    var formattedRow = []
    formattedRow.push(getStateName(row[0].substring(1,2)))
    var inputString = ""
    for (var j = 1; j < row.length - 1; j++) {
      inputString += row[j]
    }
    formattedRow.push(inputString)
    formattedRow.push(getStateName(row[row.length - 1].substring(1,2)))
    transitionT.push(formattedRow)
  }

  
	USER_INPUT.inputs = inputs;
	USER_INPUT.outputs = outputs;
	USER_INPUT.states = states;
	USER_INPUT.resetState = getStateName(resetState.substring(1,2));
	USER_INPUT.transitionT = transitionT;
	USER_INPUT.type = type;
	USER_INPUT.outputT = outputT;
	

  // data required by partner
  console.log("inputs: ")
  console.log(USER_INPUT.inputs)
	
  console.log("outputs: ")
  console.log(USER_INPUT.outputs)

  console.log("states: ")
  console.log(USER_INPUT.states)

  console.log("resetState: ")
  console.log(USER_INPUT.resetState)

  console.log("transitionT: ")
  console.log(USER_INPUT.transitionT)

  console.log("type: ")
  console.log(USER_INPUT.type)

  console.log("outputT: ")
  console.log(USER_INPUT.outputT)
	
	
//////////////////////// EDITED BY SUN /////////////////////////
sessionStorage.setItem("userInput", JSON.stringify(USER_INPUT));
sessionStorage.setItem("fsmName", "My own FSM!");
window.open("../page.html");
////////////////////////////////////////////////////////////////

}

function drawSTD0(){
	  outputTable = []
  for (var i = 0; i < stateTransitionTable.length; i++) {
    var row = stateTransitionTable[i]
    var state = getStateName(row[0].substring(1,2))

    var inputString = ""
    for (var j = 1; j < row.length - 1; j++) {
      inputString += row[j]
    }

    var outputString = ""
    for (var j = 0; j < outputCount; j++) {
      var id = "mealy" + (i + 1) + "output" + (j + 1)
      outputString += $("#" + id + " option:selected").text()
    }

    outputTable.push([state, inputString, outputString])
  }

  drawSTD1("Mealy", outputTable)
	
}

function drawSTD1(type, outputT){
	  var states = []
  for (var i = 0; i < stateCount; i++) {
    states.push($("#transitionStateName" + i).val())
  }

  var transitionT = []
  for (var i = 0; i < stateTransitionTable.length; i++) {
    var row = stateTransitionTable[i]
    var formattedRow = []
    formattedRow.push(getStateName(row[0].substring(1,2)))
    var inputString = ""
    for (var j = 1; j < row.length - 1; j++) {
      inputString += row[j]
    }
    formattedRow.push(inputString)
    formattedRow.push(getStateName(row[row.length - 1].substring(1,2)))
    transitionT.push(formattedRow)
  }
  drawDiag(transitionT)
}

//draw diagram using GoJS
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
