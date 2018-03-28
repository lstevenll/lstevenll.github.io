// states
var inputCount = 1
var outputCount = 1
var stateCount = 1
var inputs = []
var outputs = []
var stateTransitionTable = []
var stateCountArray = []
var resetState = "S0"
var outputTable = []

// pre-loading
$(document).ready(() => {
  updateTextArea(true)
  updateTextArea(false)
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
  selectedArea.append($("<p>(format: One upper case letter with one lower case letter, ie. Ta, Xb)</p>"))

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
  } else {
    $("#validationError").text()
  }

  $("#step1").hide()
  $("#step2").show()

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

  // check for duplication
  var set = new Set()
  arr.forEach(a => { set.add(a) })
  return set.size == arr.length
}

function validateString(input) {
  if (input.length != 2) {
    return false
  }
  // first char is uppercase and second char is lowercase 
  return (input.charCodeAt(0) >= "A".charCodeAt(0) 
       && input.charCodeAt(0) <= "Z".charCodeAt(0)
       && input.charCodeAt(1) >= "a".charCodeAt(0) 
       && input.charCodeAt(1) <= "z".charCodeAt(0))
}

// step 2
function configStateTransitionTable() {
  var tableHead = $("#stateTransitionTableHead")
  tableHead.append("<th>State</th>")
  for (var i = 0; i < inputCount; i++) {
    tableHead.append("<th>" + inputs[i] + "</th>")
  }
  tableHead.append("<th>Next State</th>")
}

function updateStateTransitionTable() {
  stateCount = $("#stateCount option:selected").val()
  stateCountArray = []

  // update table
  var tableBody = $("#stateTransitionTableBody")
  tableBody.empty()

  for (var i = 0; i < stateCount; i++) {
    stateCountArray.push(1)

    var tableRow = generateTransactionTableRow(i, 0)
    tableRow.append("<td><button onclick='addRow(" + i + ")'>+</button></td>")
    tableBody.append(tableRow)
  }
}

function generateTransactionTableRow(stateIndex, rowIndex) {
  var tableRow = $("<tr></tr>")
  var state = "S" + stateIndex
  tableRow.append("<td>" + state + "</td>")

  // dropdown for input
  for (var i = 0; i < inputCount; i++) {
    var id = "state" + stateIndex + "Row" + rowIndex + "Input" + (i + 1)
    var selection = ("<td>" 
      + "<select name='inputStateSelector' id='" + id + "'>" 
      + getOutputOptionString()
      + "</select>" 
      + "</td>")
    tableRow.append(selection)
  }

  var nextStateId = "state" + stateIndex + "Row" + rowIndex + "NextState"
  tableRow.append("<td><select name='nextStateSelector' id='" + nextStateId + "'>" + getStateOptionString() + "</select></td>")

  return tableRow
}

function addRow(state) {
  var inserIndex = stateCountArray
                  .slice(0, state + 1)
                  .reduce((a, b) => { return a + b }, 0);
  var tableRow = generateTransactionTableRow(state, stateCountArray[state])
  $("#stateTransitionTableBody > tr:nth-child(" + inserIndex + ")").after(tableRow)
  stateCountArray[state]++
}

function updateResetState() {
  $("#resetStateSelection").empty()
  $("#resetStateSelection").append(getStateOptionString())
  resetState = "S0"
}

$("#stateCount").change(() => {
  updateStateTransitionTable()
  updateResetState()
})

$("#resetStateSelection").change(() => {
  resetState = $("#resetStateSelection option:selected").val()
})

function getOutputOptionString() {
  return ("<option value='0'>0</option>" 
        + "<option value='1'>1</option>" 
        + "<option value='x'>x</option>")
}

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
    var state = "S" + i
    for (var j = 0; j < stateCountArray[i]; j++) {
      var transactionRow = [state]
      for (var k = 0; k < inputCount; k++) {
        var id = "state" + i + "Row" + j + "Input" + (k + 1)
        transactionRow.push($("#" + id + " option:selected").text())
      }
      var nextStateId = "state" + i + "Row" + j + "NextState"
      transactionRow.push($("#" + nextStateId + " option:selected").text())
      stateTransitionTable.push(transactionRow)
    }
  }

  $("#step2").hide()
  $("#step3").show()

  configOutputTable()
}

// step 3
function configOutputTable() {
	
  // table head
  var tableHead = $("#outputTableHead")
  tableHead.append("<th>State</th>")
  for (var i = 0; i < outputCount; i++) {
    tableHead.append("<th>" + outputs[i] + "</th>")
  }

  // table body
  for (var i = 0; i < stateCount; i++) {
    var tableRow = $("<tr></tr>")
    var state = "S" + i
    tableRow.append("<td>" + state + "</td>")
    for (var j = 0; j < outputCount; j++) {
      var id = "row" + (i + 1) + "output" + (j + 1)
      var selection = ("<td>" 
        + "<select id='" + id + "'>" 
        + getOutputOptionString()
        + "</select>" 
        + "</td>")
      tableRow.append(selection)
    }
    $("#outputTableBody").append(tableRow)
  }
}

 // store data for outputTable
function submitForm3() {
  outputTable = []
  for (var i = 0; i < stateCount; i++) {
    var state = "S" + i
    var outputRow = [state]
    for (var j = 0; j < outputCount; j++) {
      var id = "row" + (i + 1) + "output" + (j + 1)
      outputRow.push($("#" + id + " option:selected").text())
    }
    outputTable.push(outputRow)
  }

  // todo: use ajax to pass user input data to backend for further processing
  console.log(inputs)
  console.log(outputs)
  console.log(stateTransitionTable)
  console.log(resetState)
  console.log(outputTable)
}
