class Calculertor{
    constructor(previousOperandText, currentOperandText){
        this.previousOperandText = previousOperandText;
        this.currentOperandText = currentOperandText;
        this.clear();
    }

    clear(){
        this.currentOperand = ' ';
        this.previousOperand = ' ';
        this.operation = undefined;
    }

    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number){

        if(number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation){
        if(this.currentOperand === ' ') return;
        if(this.previousOperand !== ' '){
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = ' ';
    }

    compute(){
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if(isNaN(prev) || isNaN(current)) return;
        switch(this.operation){
                case '+':
                computation = prev + current;
                break;
                case '-':
                computation = prev - current;
                break;
                case 'X':
                computation = prev * current;
                break;
                case '÷':
                computation = prev / current;
                break;
                default:
                    alert("operation INVALIDAD please RELoadeddd PAggge")
                    return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = ' ';
    }

    getDisplayNumber(number){
        const stringNumber = number.toString()
        const integerToDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        const floatNumber = parseFloat(number);
        let integerDisplay;
        if (isNaN(floatNumber)){
            integerDisplay = ' ';
        }else{
            integerDisplay = integerToDigits.toLocaleString('en', {maximumFractionDigits: 0})
        }
        if(decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`
        }else{
            return integerDisplay;
        }
    }

    updateDisplay(){
        this.currentOperandText.innerText = this.currentOperand;
        this.getDisplayNumber(this.currentOperand);
        if(this.operation != null){
            this.previousOperandText.innerText = `${this.previousOperand} ${this.operation}`
        } else{
            this.previousOperandText.innerText = ''
        }      
    }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButtons = document.querySelector('[data-equal]')
const deleteButtons = document.querySelector('[data-delete]')
const allClearButtons = document.querySelector('[data-all-clear]')
const previousOperandText = document.querySelector('[data-previous]')
const currentOperandText = document.querySelector('[data-current]')

const calculator = new Calculertor(previousOperandText, currentOperandText)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButtons.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

allClearButtons.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButtons.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})

