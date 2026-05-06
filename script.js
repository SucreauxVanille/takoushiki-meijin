const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");

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
  btn.onclick = () => handleInput(b);
  container.appendChild(btn);
});

//フォント
function formatExpression(expr) {
  return expr
    .replace(/x/g, '<span class="var">x</span>')
    .replace(/y/g, '<span class="var">y</span>');
}

// 使用
questionEl.innerHTML = formatExpression("3x + 2y");
// 入力処理
function handleInput(val){
  if(val === "←"){
    currentAnswer = currentAnswer.slice(0,-1);
  }else if(val === "OK"){
    checkAnswer();
  }else{
    currentAnswer += val;
  }
  answerEl.value = currentAnswer;
}

// 問題生成
let correct;

function newQuestion(){
  const rand = () => Math.floor(Math.random()*41)-20;

  let a = rand(), b = rand(), c = rand(), d = rand();

  questionEl.textContent = `${a}x + ${b}y + ${c}x + ${d}y`;

  // 正解（整理）
  const xSum = a + c;
  const ySum = b + d;

  correct = `${xSum}x+${ySum}y`;
}

function checkAnswer(){
  if(currentAnswer === correct){
    alert("正解！");
    newQuestion();
    currentAnswer = "";
    answerEl.value = "";
  }else{
    alert("もう一度！");
  }
}
answerDisplay.innerHTML = formatExpression(currentAnswer);
// 初期化
newQuestion();
