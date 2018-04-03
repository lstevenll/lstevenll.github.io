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
  selectedArea.append($("<p>(format: words with not more than 10 letters (underscore and number can be used))</p>"))

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
    $("#validationError").text("Inputs and outputs must be unique.")
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
  if (input.length === 0 || input.length > 10) {
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
  
  sessionStorage.setItem("userInput", JSON.stringify(USER_INPUT));
  sessionStorage.setItem("fsmName", "My own FSM!");
  location = "http://snowdream-sun.github.io/beta/page.html";
  
  // draw diagram
  drawDiag(transitionT)
}


