/**
 * core
 */

// Enum
const States = {
    modifyOp1: 0, modifyOp2: 1, showResult: 2
};

// Variables
var operand;
var subtotal;
var op1 = 0;
var op2 = 0;
var state = States.modifyOp1;

// Functions
function addDigitToOp1(digit) {
    op1 *= 10;
    op1 += digit;
    showInput(op1);
}

function addDigitToO2(digit) {
    op2 *= 10;
    op2 += digit;
    showInput(op2);
}

function setOperand(newOperand) {
    operand = newOperand;
}

function changeState(newState) {
    if (state == newState) {
        return;
    } else if (state == States.modifyOp2 && newState == States.showResult) {
        operand = '';
        showResult(subtotal);
    } else if (state == States.showResult && newState == States.modifyOp2) {
        op2 = 0;
        showFirstPart(op1, operand);
    } else if (newState == States.modifyOp2) {
        showFirstPart(op1, operand);
    } else if (newState == States.modifyOp1) {
        op2 = 0;
        resetView();
    } else {
        return;
    }

    state = newState;
}

function reset() {
    op1 = 0;
    op2 = 0;
    operand = '';
    changeState(States.modifyOp1);
}

function calc() {
    switch (operand) {
        case '+':
            return op1 + op2;
        case '-':
            return op1 - op2;
        case '*':
            return op1 * op2;
        case '/':
            return (op1 * 1.0) / op2;
    }
}

// Event-Handler
function digitPressed(digit) {
    switch (state) {
        case States.modifyOp1:
            addDigitToOp1(digit);
            break;
        case States.modifyOp2:
            addDigitToO2(digit);
            break;
        case States.showResult:
            reset();
            addDigitToOp1(digit);
            break;
    }
}

function operandPressed(operand) {
    if (state == States.showResult) {
        op1 = subtotal;
    }
    setOperand(operand);
    refreshFirstPart(op1, operand);
    changeState(States.modifyOp2);
}

function equalsPressed() {
    // check for division by 0
    if(operand == '/' && op2 == 0){
        reset();
        showInvalid();
        return;
    }
    subtotal = calc();
    changeState(States.showResult);
}

function clearPressed(){
    reset();
    changeState(States.modifyOp1);
    resetView();
}

/**
 * UI
 */
window.addEventListener('load', function () {

    var elements = document.querySelectorAll("button[id^='key']");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.className == "number") {
            element.onclick = function (event) {
                digitPressed(parseInt(event.target.value));
            }
        } else if (element.className == "operator") {
            element.onclick = function (event) {
                operandPressed(event.target.value);
            }
        } else if (element.className == "command") {
            if (element.id == "key-=") {
                element.onclick = function (event) {
                    equalsPressed();
                }
            } else if (element.id == "key-c") {
                element.onclick = function (event) {
                    clearPressed();
                }
            }
        }
    }

});

function showInput(op){
    document.getElementById("input").innerHTML = op.toString();
}

function showFirstPart(op1, operand) {
    document.getElementById("output").innerHTML = op1.toString() + " " + operand.toString();
    document.getElementById("input").innerHTML = "";
}

function refreshFirstPart(op1, operand) {
    document.getElementById("output").innerHTML = op1.toString() + " " + operand.toString();
}

function showResult(subtotal) {
    document.getElementById("output").innerHTML = "";
    document.getElementById("input").innerHTML = subtotal.toString();
}

function resetView() {
    document.getElementById("output").innerHTML = "";
    document.getElementById("input").innerHTML = "";
}

function showInvalid() {
    document.getElementById("output").innerHTML = "Invalid calculation";
    document.getElementById("input").innerHTML = "";
}