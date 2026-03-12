let current = '';
let shouldReset = false;

const display = document.getElementById('result');
const expression = document.getElementById('expression');

function updateDisplay(value) {
  display.textContent = value || '0';
}

function append(value) {
  if (shouldReset) {
    current = '';
    shouldReset = false;
  }

  // 소수점 중복 방지
  if (value === '.') {
    const parts = current.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
    if (lastPart === '') current += '0';
  }

  // 연산자 연속 입력 방지
  if (['+', '-', '*', '/'].includes(value)) {
    if (current === '') return;
    if (['+', '-', '*', '/'].includes(current.slice(-1))) {
      current = current.slice(0, -1);
    }
  }

  current += value;
  updateDisplay(formatDisplay(current));
}

function formatDisplay(val) {
  return val.replace(/\*/g, '×').replace(/\//g, '÷');
}

function calculate() {
  if (!current) return;
  try {
    const result = Function('"use strict"; return (' + current + ')')();
    const rounded = parseFloat(result.toFixed(10));
    expression.textContent = formatDisplay(current) + ' =';
    current = String(rounded);
    updateDisplay(rounded);
    shouldReset = true;
  } catch {
    updateDisplay('오류');
    current = '';
  }
}

function clearAll() {
  current = '';
  expression.textContent = '';
  updateDisplay('0');
  shouldReset = false;
}

function deleteLast() {
  if (shouldReset) return;
  current = current.slice(0, -1);
  updateDisplay(current ? formatDisplay(current) : '0');
}

function toggleSign() {
  if (!current || current === '0') return;
  if (current.startsWith('-')) {
    current = current.slice(1);
  } else {
    current = '-' + current;
  }
  updateDisplay(formatDisplay(current));
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') append(e.key);
  else if (e.key === '.') append('.');
  else if (e.key === '+') append('+');
  else if (e.key === '-') append('-');
  else if (e.key === '*') append('*');
  else if (e.key === '/') { e.preventDefault(); append('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
