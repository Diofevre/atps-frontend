'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Delete } from 'lucide-react';

interface ScientificCalculatorProps {
  isVisible: boolean;
  onClose: () => void;
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ isVisible, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  }, [display, waitingForOperand]);

  const inputOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^': return Math.pow(firstValue, secondValue);
      case '√': return Math.sqrt(firstValue);
      case 'sin': return Math.sin(firstValue * Math.PI / 180);
      case 'cos': return Math.cos(firstValue * Math.PI / 180);
      case 'tan': return Math.tan(firstValue * Math.PI / 180);
      case 'log': return Math.log10(firstValue);
      case 'ln': return Math.log(firstValue);
      default: return secondValue;
    }
  };

  const performCalculation = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operation]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const memoryStore = useCallback(() => {
    setMemory(parseFloat(display));
  }, [display]);

  const memoryRecall = useCallback(() => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  }, [memory]);

  const memoryClear = useCallback(() => {
    setMemory(0);
  }, []);

  const memoryAdd = useCallback(() => {
    setMemory(memory + parseFloat(display));
  }, [memory, display]);

  const memorySubtract = useCallback(() => {
    setMemory(memory - parseFloat(display));
  }, [memory, display]);

  const scientificFunction = useCallback((func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin': result = Math.sin(value * Math.PI / 180); break;
      case 'cos': result = Math.cos(value * Math.PI / 180); break;
      case 'tan': result = Math.tan(value * Math.PI / 180); break;
      case 'asin': result = Math.asin(value) * 180 / Math.PI; break;
      case 'acos': result = Math.acos(value) * 180 / Math.PI; break;
      case 'atan': result = Math.atan(value) * 180 / Math.PI; break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      case 'sqrt': result = Math.sqrt(value); break;
      case 'cbrt': result = Math.cbrt(value); break;
      case 'pow2': result = Math.pow(value, 2); break;
      case 'pow3': result = Math.pow(value, 3); break;
      case 'exp': result = Math.exp(value); break;
      case 'factorial': 
        result = value <= 0 ? 1 : Array.from({length: Math.floor(value)}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
        break;
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      default: result = value;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  }, [display]);

  // Keyboard shortcuts handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isVisible) return;

    const key = event.key.toLowerCase();
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.=enter'.includes(key) || 
        ['backspace', 'delete', 'escape', 'c'].includes(key)) {
      event.preventDefault();
    }

    // Numbers
    if ('0123456789'.includes(key)) {
      inputNumber(key);
    }
    
    // Decimal point
    else if (key === '.' || key === ',') {
      inputDecimal();
    }
    
    // Operations
    else if (key === '+') {
      inputOperation('+');
    }
    else if (key === '-') {
      inputOperation('-');
    }
    else if (key === '*' || key === '×') {
      inputOperation('×');
    }
    else if (key === '/' || key === '÷') {
      inputOperation('÷');
    }
    
    // Equals
    else if (key === '=' || key === 'enter') {
      performCalculation();
    }
    
    // Clear functions
    else if (key === 'escape' || key === 'c') {
      clear();
    }
    else if (key === 'backspace' || key === 'delete') {
      backspace();
    }
    
    // Scientific functions
    else if (key === 's') {
      scientificFunction('sin');
    }
    else if (key === 'o') {
      scientificFunction('cos');
    }
    else if (key === 't') {
      scientificFunction('tan');
    }
    else if (key === 'l') {
      scientificFunction('log');
    }
    else if (key === 'n') {
      scientificFunction('ln');
    }
    else if (key === 'r') {
      scientificFunction('sqrt');
    }
    else if (key === 'p') {
      scientificFunction('pi');
    }
    else if (key === 'e') {
      scientificFunction('e');
    }
    
    // Memory functions
    else if (event.ctrlKey && key === 'm') {
      memoryStore();
    }
    else if (event.ctrlKey && key === 'r') {
      memoryRecall();
    }
    else if (event.ctrlKey && key === 'c' && event.shiftKey) {
      memoryClear();
    }
  }, [isVisible, inputNumber, inputDecimal, inputOperation, performCalculation, clear, backspace, scientificFunction, memoryStore, memoryRecall, memoryClear]);

  // Add keyboard event listener
  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isVisible, handleKeyPress]);

  const buttonClass = "w-full rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg border";
  // App palette: accent #EECE84 (gold), dark slate neutrals
  const numberButtonClass = `${buttonClass} h-10 text-sm bg-gradient-to-b from-[#EECE84] to-[#EECE84]/90 text-black hover:from-[#EECE84]/95 hover:to-[#EECE84]/80 border-[#EECE84]/60`;
  const operatorButtonClass = `${buttonClass} h-10 text-sm bg-gradient-to-b from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 border-slate-700`;
  const functionButtonClass = `${buttonClass} h-8 text-xs bg-gradient-to-b from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 border-slate-500`;
  const memoryButtonClass = `${buttonClass} h-8 text-xs bg-gradient-to-b from-[#EECE84]/90 to-[#EECE84]/80 text-black hover:from-[#EECE84] hover:to-[#EECE84]/90 border-[#EECE84]/60`;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-4 sm:p-7 w-full max-w-md mx-2 sm:mx-4 pointer-events-auto border-2 border-slate-300 dark:border-border max-h-[90vh] overflow-y-auto"
          style={{ 
            position: 'fixed',
            top: '20px',
            left: 'calc(50% + 6cm)',
            transform: 'translate(-50%, 0)',
            zIndex: 9999
          }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#EECE84] to-[#EECE84]/90 rounded-xl flex items-center justify-center shadow-inner border border-[#EECE84]/60">
                <span className="text-black font-bold text-lg">C</span>
              </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">SCIENTIFIC</h2>
                  <p className="text-xs text-slate-600 font-medium">CALCULATOR</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </div>

          {/* Display */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-5 mb-6 shadow-inner border-2 border-[#EECE84]/40">
            <div className="text-right">
              <div className="text-green-400 text-sm mb-2 font-mono">
                {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
              </div>
              <div className="text-green-300 text-3xl font-mono font-bold tracking-wider">
                {display}
              </div>
            </div>
          </div>

          {/* Memory Functions */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            <button className={memoryButtonClass} onClick={memoryStore}>MS</button>
            <button className={memoryButtonClass} onClick={memoryRecall}>MR</button>
            <button className={memoryButtonClass} onClick={memoryClear}>MC</button>
            <button className={memoryButtonClass} onClick={memoryAdd}>M+</button>
            <button className={memoryButtonClass} onClick={memorySubtract}>M-</button>
          </div>

          {/* Scientific Functions */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            <button className={functionButtonClass} onClick={() => scientificFunction('sin')}>sin</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('cos')}>cos</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('tan')}>tan</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('log')}>log</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('ln')}>ln</button>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            <button className={functionButtonClass} onClick={() => scientificFunction('asin')}>asin</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('acos')}>acos</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('atan')}>atan</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('sqrt')}>√</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('cbrt')}>∛</button>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            <button className={functionButtonClass} onClick={() => scientificFunction('pow2')}>x²</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('pow3')}>x³</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('exp')}>eˣ</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('factorial')}>x!</button>
            <button className={functionButtonClass} onClick={() => scientificFunction('pi')}>π</button>
          </div>

          {/* Main Calculator */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button className={operatorButtonClass} onClick={clear}>
              <RotateCcw className="w-4 h-4 mx-auto" />
            </button>
            <button className={operatorButtonClass} onClick={clearEntry}>CE</button>
            <button className={operatorButtonClass} onClick={backspace}>
              <Delete className="w-4 h-4 mx-auto" />
            </button>
            <button className={operatorButtonClass} onClick={() => inputOperation('÷')}>÷</button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <button className={numberButtonClass} onClick={() => inputNumber('7')}>7</button>
            <button className={numberButtonClass} onClick={() => inputNumber('8')}>8</button>
            <button className={numberButtonClass} onClick={() => inputNumber('9')}>9</button>
            <button className={operatorButtonClass} onClick={() => inputOperation('×')}>×</button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <button className={numberButtonClass} onClick={() => inputNumber('4')}>4</button>
            <button className={numberButtonClass} onClick={() => inputNumber('5')}>5</button>
            <button className={numberButtonClass} onClick={() => inputNumber('6')}>6</button>
            <button className={operatorButtonClass} onClick={() => inputOperation('-')}>-</button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <button className={numberButtonClass} onClick={() => inputNumber('1')}>1</button>
            <button className={numberButtonClass} onClick={() => inputNumber('2')}>2</button>
            <button className={numberButtonClass} onClick={() => inputNumber('3')}>3</button>
            <button className={operatorButtonClass} onClick={() => inputOperation('+')}>+</button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button className={numberButtonClass} onClick={() => inputNumber('0')}>0</button>
            <button className={numberButtonClass} onClick={inputDecimal}>.</button>
            <button className={operatorButtonClass} onClick={() => scientificFunction('e')}>e</button>
            <button className="w-full h-10 rounded-xl font-bold text-sm bg-gradient-to-b from-[#EECE84] to-[#EECE84]/90 text-black hover:from-[#EECE84] hover:to-[#EECE84]/95 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg border border-[#EECE84]/60" onClick={performCalculation}>=</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScientificCalculator;
