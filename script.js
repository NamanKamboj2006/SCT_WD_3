const quizData = {
  html: [
    {
      type: "single",
      question: "Which HTML5 element is used to specify a footer for a document or section?",
      options: ["<bottom>", "<footer>", "<section>", "<div>"],
      answer: "<footer>"
    },
    {
      type: "single",
      question: "What is the correct HTML element for playing audio files?",
      options: ["<sound>", "<music>", "<audio>", "<mp3>"],
      answer: "<audio>"
    },
    {
      type: "multi",
      question: "Which of the following are valid HTML5 semantic elements? (Select all that apply)",
      options: ["<article>", "<header>", "<span>", "<nav>"],
      answer: ["<article>", "<header>", "<nav>"]
    },
    {
      type: "fill",
      question: "The `<___>` element is used to embed a video in an HTML page.",
      answer: "video"
    },
    {
      type: "single",
      question: "In HTML, which attribute specifies that an input field must be filled out?",
      options: ["validate", "required", "placeholder", "formvalidate"],
      answer: "required"
    }
  ],
  css: [
    {
      type: "single",
      question: "What is the default value of the `position` property in CSS?",
      options: ["relative", "fixed", "absolute", "static"],
      answer: "static"
    },
    {
      type: "single",
      question: "Which property is used to change the background color?",
      options: ["color", "bgcolor", "background-color", "bg-color"],
      answer: "background-color"
    },
    {
      type: "multi",
      question: "Which of these are valid CSS `display` values? (Select all that apply)",
      options: ["flex", "grid", "inline-block", "table-row"],
      answer: ["flex", "grid", "inline-block", "table-row"]
    },
    {
      type: "fill",
      question: "To make a flex item grow to fill available space, you use `flex-___`.",
      answer: "grow"
    },
    {
      type: "single",
      question: "How do you select an element with id 'demo'?",
      options: [".demo", "#demo", "demo", "*demo"],
      answer: "#demo"
    }
  ],
  js: [
    {
      type: "single",
      question: "Which of the following is NOT a valid JavaScript variable declaration keyword?",
      options: ["let", "const", "var", "def"],
      answer: "def"
    },
    {
      type: "single",
      question: "What will `typeof []` return in JavaScript?",
      options: ["array", "object", "undefined", "string"],
      answer: "object"
    },
    {
      type: "multi",
      question: "Select all the JavaScript primitive data types:",
      options: ["String", "Object", "Boolean", "Symbol"],
      answer: ["String", "Boolean", "Symbol"]
    },
    {
      type: "fill",
      question: "The `JSON.___()` method parses a JSON string into a JavaScript value.",
      answer: "parse"
    },
    {
      type: "single",
      question: "Which built-in method adds one or more elements to the end of an array?",
      options: ["last()", "put()", "push()", "pop()"],
      answer: "push()"
    }
  ]
};

let currentTopic = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOptions = [];
let answered = false;
let advanceTimer = null;

const startScreen = document.getElementById('start-screen');
const topicScreen = document.getElementById('topic-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const topicCards = document.querySelectorAll('.topic-card');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');

const currentTopicBadge = document.getElementById('current-topic-badge');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.querySelector('.progress-bar');
const questionTracker = document.getElementById('question-tracker');
const scoreVal = document.getElementById('score-val');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const scorePath = document.getElementById('score-path');
const questionTypeLabel = document.getElementById('question-type-label');
const questionTypeText = document.getElementById('question-type-text');
const statCorrect = document.getElementById('stat-correct');
const statWrong = document.getElementById('stat-wrong');
const statPct = document.getElementById('stat-pct');
const toastEl = document.getElementById('toast');

let toastTimer = null;
function showToast(message, icon = 'fa-circle-info', color = '#a5b4fc') {
  const iconEl = document.createElement('i');
  iconEl.className = `fa-solid ${icon}`;
  iconEl.style.color = color;
  toastEl.innerHTML = '';
  toastEl.appendChild(iconEl);
  toastEl.appendChild(document.createTextNode(' ' + message));
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

function launchConfetti(count = 60) {
  const colors = ['#6c8ef5', '#34d399', '#fbbf24', '#f472b6', '#60a5fa'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti-particle');
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (5 + Math.random() * 7) + 'px';
    el.style.height = (5 + Math.random() * 7) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDuration = (1.6 + Math.random() * 2) + 's';
    el.style.animationDelay = (Math.random() * 0.6) + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function switchScreen(from, to) {
  from.classList.remove('active');
  from.classList.add('hidden');
  setTimeout(() => {
    to.classList.remove('hidden');
    void to.offsetWidth;
    to.classList.add('active');
  }, 50);
}

startBtn.addEventListener('click', () => switchScreen(startScreen, topicScreen));
backBtn.addEventListener('click', () => {
  clearTimeout(advanceTimer);
  advanceTimer = null;
  answered = false;
  selectedOptions = [];
  switchScreen(quizScreen, topicScreen);
  showToast('Topic changed', 'fa-arrow-left');
});
homeBtn.addEventListener('click', () => switchScreen(resultScreen, startScreen));
restartBtn.addEventListener('click', () => startQuiz(currentTopic));

topicCards.forEach(card => {
  card.addEventListener('click', () => startQuiz(card.dataset.topic));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startQuiz(card.dataset.topic);
    }
  });
});

nextBtn.addEventListener('click', evaluateAndNext);

function startQuiz(topic) {
  currentTopic = topic;
  currentQuestions = quizData[topic];
  currentQuestionIndex = 0;
  score = 0;

  const names = { html: 'HTML5', css: 'CSS3', js: 'JavaScript' };
  currentTopicBadge.textContent = names[topic] || topic.toUpperCase();

  const from = topicScreen.classList.contains('active') ? topicScreen : resultScreen;
  switchScreen(from, quizScreen);
  loadQuestion();
}

function loadQuestion() {
  selectedOptions = [];
  answered = false;

  nextBtn.classList.remove('hidden');
  nextBtn.disabled = true;
  nextBtn.innerHTML = currentQuestionIndex === currentQuestions.length - 1
    ? 'Submit <i class="fa-solid fa-flag-checkered"></i>'
    : 'Next <i class="fa-solid fa-arrow-right"></i>';

  const q = currentQuestions[currentQuestionIndex];

  const typeMap = {
    single: { text: 'Single Choice', icon: 'fa-circle-dot' },
    multi: { text: 'Multiple Choice', icon: 'fa-list-check' },
    fill: { text: 'Fill in the Blank', icon: 'fa-pen-to-square' }
  };
  const info = typeMap[q.type] || { text: 'Question', icon: 'fa-circle-question' };
  const multiHint = q.type === 'multi' ? ` — Select ${q.answer.length}` : '';
  questionTypeText.textContent = info.text + multiHint;
  questionTypeLabel.querySelector('i').className = `fa-solid ${info.icon}`;

  questionText.innerHTML = escapeHTML(q.question).replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(255,255,255,0.07);padding:2px 6px;border-radius:5px;font-family:monospace;font-size:0.93em;">$1</code>'
  );

  answersContainer.innerHTML = '';
  updateMeta();

  if (q.type === 'single' || q.type === 'multi') {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.classList.add('answer-option');
      btn.style.animationDelay = `${i * 0.07}s`;
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span class="option-text">${escapeHTML(opt)}</span>
        <span class="check-icon" aria-hidden="true"></span>
      `;
      btn.addEventListener('click', () => handleSelect(btn, opt, q.type));
      answersContainer.appendChild(btn);
    });
  } else {
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('fill-blank-input');
    input.placeholder = 'Type your answer…';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.addEventListener('input', e => {
      const val = e.target.value.trim();
      selectedOptions = val ? [val] : [];
      checkReady();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !nextBtn.disabled) evaluateAndNext();
    });
    answersContainer.appendChild(input);
    setTimeout(() => input.focus(), 180);
  }
}

function handleSelect(btn, option, type) {
  if (answered) return;

  if (type === 'single') {
    document.querySelectorAll('.answer-option').forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-pressed', 'true');
    selectedOptions = [option];
  } else {
    if (selectedOptions.includes(option)) {
      selectedOptions = selectedOptions.filter(o => o !== option);
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      const q = currentQuestions[currentQuestionIndex];
      const required = Array.isArray(q.answer) ? q.answer.length : Infinity;
      if (selectedOptions.length >= required) return;
      selectedOptions.push(option);
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  checkReady();
}

function checkReady() {
  const q = currentQuestions[currentQuestionIndex];
  if (q.type === 'multi') {
    const required = Array.isArray(q.answer) ? q.answer.length : 1;
    nextBtn.disabled = selectedOptions.length !== required;
  } else {
    nextBtn.disabled = selectedOptions.length === 0;
  }
}

function evaluateAndNext() {
  if (answered) return;
  answered = true;
  nextBtn.disabled = true;
  nextBtn.classList.add('hidden');

  const q = currentQuestions[currentQuestionIndex];
  let correct = false;

  if (q.type === 'single') {
    correct = selectedOptions[0] === q.answer;
  } else if (q.type === 'multi') {
    const a = [...selectedOptions].sort();
    const b = [...q.answer].sort();
    correct = a.length === b.length && a.every((v, i) => v === b[i]);
  } else {
    correct = selectedOptions[0].trim().toLowerCase() === q.answer.toLowerCase();
  }

  if (correct) {
    score++;
    scoreVal.textContent = score;
    scoreVal.parentElement.style.transform = 'scale(1.2)';
    setTimeout(() => { scoreVal.parentElement.style.transform = ''; }, 220);
  }

  showFeedback(q, correct);

  advanceTimer = setTimeout(() => {
    advanceTimer = null;
    currentQuestionIndex++;
    if (currentQuestionIndex >= currentQuestions.length) {
      showResults();
    } else {
      loadQuestion();
    }
  }, 1400);
}

function showFeedback(q, correct) {
  if (q.type === 'fill') {
    const input = answersContainer.querySelector('.fill-blank-input');
    if (!input) return;
    input.disabled = true;
    input.classList.add(correct ? 'correct' : 'wrong');

    const msg = document.createElement('div');
    msg.classList.add('feedback-message', correct ? 'correct-msg' : 'wrong-msg');
    msg.innerHTML = correct
      ? `<i class="fa-solid fa-circle-check"></i> Correct!`
      : `<i class="fa-solid fa-circle-xmark"></i> Answer: <strong>${escapeHTML(q.answer)}</strong>`;
    answersContainer.appendChild(msg);

    if (correct) {
      showToast('Correct! 🎉', 'fa-circle-check', '#34d399');
    }
    return;
  }

  const buttons = answersContainer.querySelectorAll('.answer-option');

  buttons.forEach(btn => { btn.style.opacity = '1'; btn.style.animation = 'none'; });

  buttons.forEach((btn, i) => {
    const opt = q.options[i];
    btn.disabled = true;

    const isAnswer = Array.isArray(q.answer) ? q.answer.includes(opt) : opt === q.answer;
    const isSelected = selectedOptions.includes(opt);
    const icon = btn.querySelector('.check-icon');

    if (isAnswer) {
      btn.classList.add('correct');
      if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#34d399"></i>';
    } else if (isSelected && !correct) {
      btn.classList.add('wrong');
      void btn.offsetWidth;
      btn.style.animation = 'shakeWrong 0.4s ease';
      if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#f87171"></i>';
    }
  });

  if (correct) {
    showToast('Correct! Well done 🎉', 'fa-circle-check', '#34d399');
  }
}

function updateMeta() {
  const total = currentQuestions.length;
  const pct = (currentQuestionIndex / total) * 100;

  questionTracker.textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
  scoreVal.textContent = score;
  progressFill.style.width = `${pct}%`;
  progressBar.setAttribute('aria-valuenow', pct);
}

function showResults() {
  switchScreen(quizScreen, resultScreen);

  const total = currentQuestions.length;
  const pct = Math.round((score / total) * 100);
  const wrong = total - score;

  finalScore.textContent = `${score}/${total}`;
  statCorrect.textContent = score;
  statWrong.textContent = wrong;
  statPct.textContent = pct + '%';

  setTimeout(() => {
    scorePath.style.strokeDasharray = `${(score / total) * 100}, 100`;
    scorePath.style.stroke = pct >= 80 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171';
  }, 200);

  if (pct === 100) resultMessage.textContent = '🏆 Flawless Victory!';
  else if (pct >= 80) resultMessage.textContent = '🎉 Excellent Work!';
  else if (pct >= 60) resultMessage.textContent = '👍 Good effort — keep it up!';
  else if (pct >= 40) resultMessage.textContent = '📖 Keep practicing!';
  else resultMessage.textContent = "💪 Don't give up — try again!";

  if (pct >= 70) setTimeout(() => launchConfetti(pct === 100 ? 100 : 55), 300);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
  return str.replace(/[&<>'"]/g, t => map[t]);
}
