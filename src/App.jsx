import { useEffect } from 'react';
import './App.css';

let calculator = {
  data: {
    maxChars: 10,
    storedResult: null,
    currentValue: '0',
    currentOperation: null,
    mapKeys: { 
      48 : { type: 'input', value:  '0' },
      49 : { type: 'input', value:  '1' },
      50 : { type: 'input', value:  '2' },
      51 : { type: 'input', value:  '3' },
      52 : { type: 'input', value:  '4' },
      53 : { type: 'input', value:  '5' },
      54 : { type: 'input', value:  '6' },
      55 : { type: 'input', value:  '7' },
      56 : { type: 'input', value:  '8' },
      57 : { type: 'input', value:  '9' },
      190: { type: 'input', value:  '.' },
      88 : { type: 'operation', value:  'exponent' },
      47 : { type: 'operation', value:  'division' },
      221: { type: 'operation', value:  'multiply' },
      189: { type: 'operation', value:  'subtract' },
      187: { type: 'operation', value:  'sum' },
      67 : { type: 'clear', value:  'clear' },
      13 : { type: 'result', value:  null },
      8  : { type: 'delete', value:  null },
      84 : { type: 'toggle', value:  'toggle' },
    },
  },

  activateButtonWithKeypress (keyCode) {
    const chooseBtn = document.querySelectorAll(`.calculator button[data-keycode="${keyCode}"]`)[0];
    if (chooseBtn) {
      chooseBtn.classList.toggle('active');
      setTimeout(() => {
        chooseBtn.classList.toggle('active');
      }, 150);
    }
  },

  bindButtons() {
    const buttons = document.querySelectorAll('.calculator button');
    const mapKeys = calculator.data.mapKeys;
    Array.from(buttons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const keycode = event.target.dataset.keycode;
        if (mapKeys[keycode]) {
          this.processUserInput(mapKeys[keycode]);
          this.activateButtonWithKeypress(keycode);
        }
      });
    });
  },
  
  bindKeyboard() {
    document.addEventListener('keydown', (event) => {
      const mapKeys = calculator.data.mapKeys;
      let key = event.key;
      let code = event.code;
  
      // Mapea las teclas específicas que necesitas
      if (key === '7' && event.shiftKey) {
        key = '/';
      }
  
      const keyMappings = {
        '0': '48',
        '1': '49',
        '2': '50',
        '3': '51',
        '4': '52',
        '5': '53',
        '6': '54',
        '7': '55',
        '8': '56',
        '9': '57',
        '.': '190',
        '%': '88',
        '/': '47',
        '*': '221',
        '-': '189',
        '+': '187',
        'c': '67',
        'Enter': '13',
        'Backspace': '8',
        't': '84'
      };
  
      if (keyMappings[key]) {
        const keyCode = keyMappings[key];
        if (mapKeys[keyCode]) {
          event.preventDefault();  // Evita la ejecución predeterminada del evento
          this.processUserInput(mapKeys[keyCode]);
          this.activateButtonWithKeypress(keyCode);
        }
      }
    });
  },   

  blinkDisplay () {
    const blinkDisplay = document.querySelector('.calculator-display');
    blinkDisplay.classList.toggle('blink');
    setTimeout(() => {
      blinkDisplay.classList.toggle('blink');
    }, 150);
  },

  calculate () {
    const oldValue = parseFloat(this.data.storedResult, 10);
    const operation = this.data.currentOperation;
    const newValue = parseFloat(this.data.currentValue, 10);
    let resultValue = 0;

    if (this.data.currentOperation === 'multiply') {
      resultValue = oldValue * newValue;
    }
    if (this.data.currentOperation === 'division') {
      resultValue = oldValue / newValue;
    }
    if (this.data.currentOperation === 'subtract') {
      resultValue = oldValue - newValue;
    }
    if (this.data.currentOperation === 'sum') {
      const multiplierFix = 1000000000;
      resultValue = (((oldValue * multiplierFix) + (newValue * multiplierFix)) / multiplierFix);
    }
    if (this.data.currentOperation === 'exponent') {
      resultValue = Math.pow(oldValue, newValue);
    }
    this.data.storedResult = null;
    this.data.currentValue = '' + resultValue;
    this.updateDisplay();
  },

  clearAll () {
    this.data.currentOperation = null;
    this.data.storedResult = null;
    this.data.currentValue = '0';
    this.updateDisplay();
  },

  clearCurrentValue () {
    this.data.currentValue = '0';
    this.updateDisplay();
  },

  deleteNumber () {
    const newValue = this.data.currentValue.slice(0, -1);
    if (newValue === '') {
      this.blinkDisplay();
      this.clearCurrentValue();
    } else {
      this.data.currentValue = newValue;
      this.updateDisplay();
    }
  },

  processUserInput (userInput) {
    if (userInput.type === 'input') {
      this.setNumber(userInput.value);
    }
    if (userInput.type === 'operation') {
      this.setOperation(userInput.value);
    }
    if (userInput.type === 'delete') {
      this.deleteNumber();
    }
    if (userInput.type === 'result') {
      this.showResult();
    }
    if (userInput.type === 'clear') {
      this.clearAll();
    }
    if (userInput.type === 'toggle') {
      this.toggleNumber();
    }
  },

  setNumber (newNumber) {
    let currentValue = this.data.currentValue;
    if (newNumber === '.' && currentValue.includes('.')) {
      this.blinkDisplay();
      return;
    } 
    if (currentValue.length === this.data.maxChars) {
      this.blinkDisplay();
      return;
    }
    if (currentValue === '0' && newNumber === '.') {
      currentValue = '0.';
    } else if (currentValue === '0' && newNumber !== '.') {
      this.blinkDisplay();
      currentValue = newNumber;
    } else {
      currentValue += newNumber;
    }
    this.data.currentValue = currentValue;
    this.updateDisplay();
  },

  setOperation (newOperation) {
    if (this.data.currentOperation !== null && this.data.storedResult !== null) {
      this.calculate();
    }
    this.data.storedResult = this.data.currentValue;
    this.data.currentValue = '0';
    this.data.currentOperation = newOperation;
  },

  showResult () {
    if (this.data.storedResult !== null) {
      this.calculate();
      this.updateDisplay();
    } else {
      this.blinkDisplay();
    }
  },

  toggleNumber () {
    this.data.currentValue = (parseFloat(this.data.currentValue, 10) * -1) + '';
    this.updateDisplay();
  },

  updateDisplay () {
    document.querySelector('.calculator-display').innerHTML = this.data.currentValue;
  },

  start () {
    this.updateDisplay();
    this.bindKeyboard();
    this.bindButtons();
  },
};

function App() {
  useEffect(() => {
    calculator.start();
  }, []);

  return (
    <>
      <div className="container">
        <div className="calculator">
          <div className="calculator-display">0</div>
          <div className="calculator-keyboard">
            <div className="calculator-keyboard_container_numbers">
              <button className="calculator-keyboard_number_key" type="button" data-keycode="67" value="clear">C</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="84" value="toggle">&#8314;&#8725;&#8331;</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="88" value="exponent">%</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="190" value=".">.</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="48" value="0">0</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="49" value="1">1</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="50" value="2">2</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="51" value="3">3</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="52" value="4">4</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="53" value="5">5</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="54" value="6">6</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="55" value="7">7</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="56" value="8">8</button>
              <button className="calculator-keyboard_number_key" type="button" data-keycode="57" value="9">9</button>
            </div>
            <div className="calculator-keyboard_container_operators">
              <button className="calculator-keyboard_operator_key" type="button" data-keycode="47" value="div">÷</button>
              <button className="calculator-keyboard_operator_key" type="button" data-keycode="221" value="mult"><span>×</span></button>
              <button className="calculator-keyboard_operator_key" type="button" data-keycode="189" value="subtract">−</button>
              <button className="calculator-keyboard_operator_key" type="button" data-keycode="187" value="sum">+</button>
              <button className="calculator-keyboard_operator_key" type="button" data-keycode="13" value="result">=</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
