const questionEl = document.getElementById("question");
// ★ input → div に変更
const answerEl = document.getElementById("answerDisplay");

let currentAnswer = "";

// ボタン定義
const buttons = [
  "7","8","9","+",
  "4","5","6","-",
  "1","2","3","←",
  "0","x","y","OK"
];

// ボタン生成
const container = document.getElementById("buttons");
buttons.forEach(b => {
  const btn = document.createElement("button");
  btn.textContent = b;

  // ボタン識別用（CSS用）
  btn.dataset.key = b;

  btn.onclick = () => handleInput(b);
  container.appendChild(btn);
});

// ===== フォーマット（x,yをイタリック） =====
function formatExpression(expr) {
  return expr
    .replace(/x/g, '<span class="var">x</span>')
    .replace(/y/g, '<span class="var">y</span>');
}

// ===== 表示更新 =====
function updateDisplay() {
  answerEl.innerHTML = formatExpression(currentAnswer);
}

// ===== 入力処理 =====
function handleInput(val){
  if(val === "←"){
    currentAnswer = currentAnswer.slice(0,-1);

  }else if(val === "OK"){
    checkAnswer();
    return;

  }else{
    currentAnswer += val;
  }

  updateDisplay();
}

// ===== 問題生成 =====
let correct;

function newQuestion(){
  const rand = () => Math.floor(Math.random()*41)-20;

  let a = rand(), b = rand(), c = rand(), d = rand();

  // 問題表示（フォーマット適用）
  const expr = `${a}x + ${b}y + ${c}x + ${d}y`;
  questionEl.innerHTML = formatExpression(expr);

  // 正解（整理）
  const xSum = a + c;
  const ySum = b + d;

  correct = `${xSum}x+${ySum}y`;
}

// ===== 採点 =====
function checkAnswer(){
  if(currentAnswer === correct){
    alert("正解！");
    newQuestion();
    currentAnswer = "";
    updateDisplay();
  }else{
    alert("もう一度！");
  }
}

// 初期化
newQuestion();
updateDisplay();
