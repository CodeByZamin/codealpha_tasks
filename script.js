const previousOperation = document.getElementById("previousOperation");
const currentOperation = document.getElementById("currentOperation");
const buttons = document.querySelectorAll(".btn");
let currentValue = "0";
let previousValue = "";
let selectedOperator = null;
let shouldResetScreen = false;

function updateDisplay() {
    currentOperation.textContent = currentValue;
    previousOperation.textContent = selectedOperator
        ? `${previousValue} ${getOperatorSymbol(selectedOperator)}`
        : "";
}

function getOperatorSymbol(operator) {
    switch (operator) {
        case "+":
            return "+";
        case "-":
            return "−";
        case "*":
            return "×";
        case "/":
            return "÷";
        default:
            return "";
    }
}

function addNumber(number) {
    if (shouldResetScreen) {
        currentValue = "";
        shouldResetScreen = false;
    }

    if (number === ".") {
        if (currentValue.includes(".")) {
            return;
        }
        currentValue += ".";
    } else {
        if (currentValue === "0") {
            currentValue = number;
        } else {
            currentValue += number;
        }
    }

    updateDisplay();
}

function chooseOperator(operator) {
    if (operator === "%") {
        currentValue = String(parseFloat(currentValue) / 100);
        updateDisplay();
        return;
    }

    if (selectedOperator !== null && !shouldResetScreen) {
        calculateResult();
    }

    previousValue = currentValue;
    selectedOperator = operator;
    shouldResetScreen = true;

    updateDisplay();
}

function calculateResult() {
    if (selectedOperator === null || shouldResetScreen) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result = 0;

    switch (selectedOperator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "*":
            result = firstNumber * secondNumber;
            break;
        case "/":
            if (secondNumber === 0) {
                currentValue = "Cannot divide by 0";
                previousValue = "";
                selectedOperator = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = firstNumber / secondNumber;
            break;
    }

    currentValue = Number(result.toFixed(10)).toString();
    previousValue = "";
    selectedOperator = null;
    shouldResetScreen = true;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    selectedOperator = null;
    shouldResetScreen = false;

    updateDisplay();
}

function deleteLastCharacter() {
    if (shouldResetScreen) {
        return;
    }

    if (currentValue.length === 1 || currentValue === "Cannot divide by 0") {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (button.classList.contains("number")) {
            addNumber(value);
            return;
        }

        if (button.classList.contains("operator")) {
            chooseOperator(value);
            return;
        }

        if (action === "clear") {
            clearCalculator();
            return;
        }

        if (action === "delete") {
            deleteLastCharacter();
            return;
        }

        if (action === "calculate") {
            calculateResult();
        }
    });
});

// Keyboard Support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (!isNaN(key) || key === ".") {
        addNumber(key);
    }

    if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    }

    if (key === "Backspace") {
        deleteLastCharacter();
    }

    if (key === "Delete" || key.toLowerCase() === "c") {
        clearCalculator();
    }

    if (key === "%") {
        chooseOperator("%");
    }
});

updateDisplay();