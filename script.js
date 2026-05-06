const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answerDisplay");

let currentAnswer = "";

// ===== ボタン定義（表示は全角）=====
const buttons = [
  "7","8","9","＋",
  "4","5","6","－",
  "1","2","3","消",
  "0","x","y","OK"
];

// ===== ボタン生成 =====
const container = document.getElementById("buttons");

buttons.forEach(b => {
  const btn = document.createElement("button");
  btn.textContent = b;
  btn.dataset.key = b;

  let interval = null;
  let timeout = null;

btn.addEventListener("pointerdown", () => {
  handleInput(b);

  // ★ OKは長押し無効（ここが追加ポイント）
  if (b === "OK") return;

  timeout = setTimeout(() => {
    interval = setInterval(() => {
      handleInput(b);
    }, b === "消" ? 60 : 100);
  }, 300);
});

  const stop = () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };

  btn.addEventListener("pointerup", stop);
  btn.addEventListener("pointerleave", stop);
  btn.addEventListener("pointercancel", stop);
  btn.addEventListener("touchend", stop);
  btn.addEventListener("touchcancel", stop);
  container.appendChild(btn);
});
// ===== 表示フォーマット =====
function formatExpression(expr) {
  return expr
    .replace(/\+/g, "＋")
    .replace(/-/g, "－")
    .replace(/x/g, '<span class="var">x</span>')
    .replace(/y/g, '<span class="var">y</span>');
}

// ===== 表示更新 =====
function updateDisplay() {
  answerEl.innerHTML = formatExpression(currentAnswer);
}

// ===== 入力処理 =====
function handleInput(val){

  if(val === "消"){
    currentAnswer = currentAnswer.slice(0,-1);

  }else if(val === "OK"){
    checkAnswer();
    return;

  }else{
    // 表示→内部変換
    if(val === "＋") val = "+";
    if(val === "－") val = "-";

    currentAnswer += val;
  }

  updateDisplay();
}

// ===== 項フォーマット =====
function formatTerm(coef, variable) {
  if (coef === 0) return null;

  if (coef === 1) return variable;
  if (coef === -1) return "-" + variable;

  return coef + variable;
}

// ===== 多項式フォーマット（正解）=====
function formatPolynomial(xCoef, yCoef) {
  let parts = [];

  if (xCoef !== 0) {
    if (xCoef === 1) parts.push("x");
    else if (xCoef === -1) parts.push("-x");
    else parts.push(xCoef + "x");
  }

  if (yCoef !== 0) {
    if (yCoef === 1) parts.push("y");
    else if (yCoef === -1) parts.push("-y");
    else parts.push(yCoef + "y");
  }

  if (parts.length === 0) return "0";

  let result = parts.join("+");
  result = result.replace(/\+\-/g, "-");

  return result;
}

// ===== 問題生成 =====
let correct;

function newQuestion(){
  const rand = () => Math.floor(Math.random()*41)-20;

  let a = rand(), b = rand(), c = rand(), d = rand();

  let terms = [
    formatTerm(a, "x"),
    formatTerm(b, "y"),
    formatTerm(c, "x"),
    formatTerm(d, "y")
  ].filter(t => t !== null);

  let expr = terms.join(" + ").replace(/\+\s\-/g, "- ");

  questionEl.innerHTML = formatExpression(expr);

  const xSum = a + c;
  const ySum = b + d;

  correct = formatPolynomial(xSum, ySum);
}

// 係数比較
function parsePolynomial(expr) {
  let xCoef = 0;
  let yCoef = 0;

  // "+-"対策
  expr = expr.replace(/\+\-/g, "-");

  // 符号で分割（例: 2x-3y → ["2x", "-3y"]）
  let terms = expr.match(/[+-]?[^+-]+/g);

  if (!terms) return null;

  terms.forEach(term => {
    if (term.includes("x")) {
      let coef = term.replace("x", "");

      if (coef === "" || coef === "+") coef = 1;
      else if (coef === "-") coef = -1;
      else coef = parseInt(coef);

      xCoef += coef;

    } else if (term.includes("y")) {
      let coef = term.replace("y", "");

      if (coef === "" || coef === "+") coef = 1;
      else if (coef === "-") coef = -1;
      else coef = parseInt(coef);

      yCoef += coef;
    }
  });

  return { x: xCoef, y: yCoef };
}

// ===== 採点 =====
function checkAnswer(){

  const user = parsePolynomial(currentAnswer);
  const ans  = parsePolynomial(correct);

  if(user && ans && user.x === ans.x && user.y === ans.y){
    alert("正解！よくできました！");
    newQuestion();
    currentAnswer = "";
    updateDisplay();
  }else{
    alert("おしい！もう一度やってみよう！");
  }
}

// ===== 初期化 =====
newQuestion();
updateDisplay();
