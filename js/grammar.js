/* Grammar Academy - UI, quiz and progress logic (offline, vanilla JS).
   Content lives in js/grammar-data-*.js (window.GrammarAcademy.topics).
   Progress is saved in localStorage under "vocabulary.grammarAcademy.v1". */
(() => {
  'use strict';

  const STORAGE_KEY = 'vocabulary.grammarAcademy.v1';
  const PASS_MARK = 3; // correct answers needed (out of 5) to complete a lesson

  const root = document.getElementById('grammar-root');
  if (!root) return;

  const CATEGORIES = [
    { id: 'basics', title: 'Basics', note: 'Words ko pehchano aur sahi jagah lagao.' },
    { id: 'verbs', title: 'Verbs & Tenses', note: 'Time, verbs aur voice par pakad banao.' },
    { id: 'sentences', title: 'Sentence Building', note: 'Sentences banana, jodna aur sawal poochna.' },
    { id: 'advanced', title: 'Advanced & Practice', note: 'Baat report karna aur aam galtiyon se bachna.' }
  ];

  const topics = ((window.GrammarAcademy && window.GrammarAcademy.topics) || [])
    .slice()
    .sort((a, b) => a.order - b.order);
  const byId = new Map(topics.map(topic => [topic.id, topic]));

  /* ---------- small helpers ---------- */
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const toastEl = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* ---------- progress (localStorage) ---------- */
  const emptyProgress = () => ({ version: 1, lessons: {} });

  function sanitize(raw) {
    const clean = emptyProgress();
    if (!raw || typeof raw !== 'object' || !raw.lessons || typeof raw.lessons !== 'object') return clean;

    Object.keys(raw.lessons).forEach(id => {
      const topic = byId.get(id);
      const item = raw.lessons[id];
      if (!topic || !item || typeof item !== 'object') return;

      const max = topic.quiz.length;
      const whole = (value, limit) =>
        Number.isFinite(value) ? Math.min(Math.max(Math.round(value), 0), limit) : 0;
      const attempts = whole(item.attempts, 9999);
      const best = attempts > 0 ? whole(item.best, max) : null;

      clean.lessons[id] = {
        completed: item.completed === true && attempts > 0,
        attempts,
        best,
        last: attempts > 0 ? whole(item.last, max) : null,
        lastAt: typeof item.lastAt === 'string' ? item.lastAt : null,
        completedAt: typeof item.completedAt === 'string' ? item.completedAt : null
      };
    });
    return clean;
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitize(JSON.parse(raw)) : emptyProgress();
    } catch (error) {
      return emptyProgress();
    }
  }

  let progress = loadProgress();

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      notify('Progress save nahi ho paaya (browser storage band hai).');
      return false;
    }
  }

  const record = id => progress.lessons[id] ||
    { completed: false, attempts: 0, best: null, last: null, lastAt: null, completedAt: null };

  function overallStats() {
    const total = topics.length;
    const done = topics.filter(topic => record(topic.id).completed).length;
    const tried = topics.filter(topic => record(topic.id).attempts > 0);
    const averageBest = tried.length
      ? tried.reduce((sum, topic) => sum + record(topic.id).best, 0) / tried.length
      : null;
    return { total, done, tried: tried.length, averageBest, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  function updateHomeCard() {
    const stats = overallStats();
    const label = document.getElementById('ga-home-progress');
    const bar = document.getElementById('ga-home-bar');
    if (label) label.textContent = `${stats.done} / ${stats.total} LESSONS`;
    if (bar) bar.style.width = `${stats.percent}%`;
  }

  /* ---------- state ---------- */
  let state = { screen: 'hub', topicId: null };
  let quiz = null; // { topicId, index, items:[{ q, order, picked, submitted }], done, result }

  function topicStatus(id) {
    const item = record(id);
    const max = byId.get(id).quiz.length;
    if (item.completed) return { key: 'complete', label: `\u2713 Completed \u00B7 Best ${item.best}/${max}` };
    if (item.attempts > 0) return { key: 'tried', label: `Retry quiz \u00B7 Best ${item.best}/${max}` };
    return { key: 'new', label: 'Not started' };
  }

  const isCorrect = item => item.picked !== null && item.order[item.picked] === item.q.answer;

  /* ---------- rendering ---------- */
  function renderHub() {
    const stats = overallStats();
    const next = topics.find(topic => !record(topic.id).completed);
    const average = stats.averageBest === null ? '\u2014' : `${stats.averageBest.toFixed(1)} / 5`;

    const headline = stats.done === 0
      ? 'Pehla lesson shuru karo'
      : stats.done === stats.total
        ? 'Saare lessons complete!'
        : `${stats.done} of ${stats.total} lessons completed`;

    const action = next
      ? `<button type="button" class="primary-button" data-ga-action="open" data-ga-topic="${esc(next.id)}">${stats.done || stats.tried ? 'Continue' : 'Start'}: ${esc(next.title)} <span>\u2192</span></button>`
      : '<span class="ga-all-done">\u2726 Shabaash! Aap kisi bhi lesson ko dobara khol kar practice kar sakte ho.</span>';

    const categories = CATEGORIES.map((category, index) => {
      const list = topics.filter(topic => topic.category === category.id);
      if (!list.length) return '';
      const done = list.filter(topic => record(topic.id).completed).length;
      const percent = Math.round((done / list.length) * 100);

      return `
        <section class="ga-category" aria-labelledby="ga-cat-${esc(category.id)}">
          <div class="ga-cat-head">
            <div>
              <div class="eyebrow">CATEGORY ${index + 1}</div>
              <h3 id="ga-cat-${esc(category.id)}">${esc(category.title)}</h3>
              <p>${esc(category.note)}</p>
            </div>
            <div class="ga-cat-progress" aria-label="${done} of ${list.length} lessons completed in ${esc(category.title)}">
              <span>${done}/${list.length}</span>
              <span class="ga-bar"><i style="width:${percent}%"></i></span>
            </div>
          </div>
          <div class="ga-grid is-${list.length}">
            ${list.map(topicCard).join('')}
          </div>
        </section>`;
    }).join('');

    return `
      <section class="ga-hero" aria-label="Your grammar progress">
        <div class="ga-ring" style="--ga-pct:${stats.percent}" role="img" aria-label="${stats.percent}% lessons completed"><span>${stats.percent}%</span></div>
        <div class="ga-hero-text">
          <div class="eyebrow">YOUR GRAMMAR PATH</div>
          <h2>${esc(headline)}</h2>
          <p>${stats.tried} lessons attempted \u00B7 Average best score: ${average}</p>
          <p class="ga-rule-note">Quiz mein ${PASS_MARK}/5 ya usse zyada score aane par lesson complete ho jaata hai.</p>
        </div>
        <div class="ga-hero-action">${action}</div>
      </section>
      ${categories}
      <div class="ga-reset-row">
        <button type="button" class="text-link ga-reset" data-ga-action="reset">Reset Grammar progress</button>
      </div>`;
  }

  function topicCard(topic) {
    const status = topicStatus(topic.id);
    return `
      <button type="button" class="ga-topic ${status.key === 'complete' ? 'is-complete' : ''}" data-ga-action="open" data-ga-topic="${esc(topic.id)}">
        <span class="ga-topic-icon" aria-hidden="true">${esc(topic.icon)}</span>
        <span class="ga-topic-body">
          <strong>${esc(topic.title)}</strong>
          <span class="ga-topic-summary">${esc(topic.summary)}</span>
          <span class="ga-topic-meta"><span>${esc(topic.level)}</span><span>${topic.minutes} min</span><span>${topic.quiz.length} MCQs</span></span>
        </span>
        <span class="ga-status is-${status.key}">${esc(status.label)}</span>
      </button>`;
  }

  function exampleList(examples) {
    return `<ul class="ga-examples">${examples.map(item => `
      <li><span class="ga-en">${esc(item.en)}</span><span class="ga-hi">${esc(item.hi)}</span></li>`).join('')}</ul>`;
  }

  function renderTenses(topic) {
    if (!Array.isArray(topic.tenses) || !topic.tenses.length) return '';

    const groups = ['Present', 'Past', 'Future'].map(group => {
      const list = topic.tenses.filter(tense => tense.group === group);
      if (!list.length) return '';
      return `
        <div class="ga-tense-group">
          <h4 class="ga-tense-group-title">${esc(group)} Tenses</h4>
          ${list.map(tense => `
            <details class="ga-tense">
              <summary><span class="ga-tense-name">${esc(tense.name)}</span><span class="ga-tense-short">${esc(tense.formula.positive)}</span></summary>
              <div class="ga-tense-body">
                <p class="ga-tense-use"><strong>Kab use karein:</strong> ${esc(tense.use)}</p>
                ${['positive', 'negative', 'question'].map(kind => `
                  <div class="ga-tense-row is-${kind}">
                    <span class="ga-tense-kind">${kind === 'positive' ? 'Positive (+)' : kind === 'negative' ? 'Negative (\u2212)' : 'Question (?)'}</span>
                    <code class="ga-formula">${esc(tense.formula[kind])}</code>
                    <span class="ga-en">${esc(tense.examples[kind].en)}</span>
                    <span class="ga-hi">${esc(tense.examples[kind].hi)}</span>
                  </div>`).join('')}
                <p class="ga-signals"><strong>Signal words:</strong> ${esc(tense.signals)}</p>
              </div>
            </details>`).join('')}
        </div>`;
    }).join('');

    return `
      <section class="ga-block">
        <div class="ga-block-head">
          <h3>12 Tenses - formula aur examples</h3>
          <span class="ga-expand">
            <button type="button" class="text-link" data-ga-action="expand-all">Expand all</button>
            <button type="button" class="text-link" data-ga-action="collapse-all">Collapse all</button>
          </span>
        </div>
        ${groups}
      </section>`;
  }

  function renderLesson(topic) {
    const item = record(topic.id);
    const status = topicStatus(topic.id);
    const category = CATEGORIES.find(entry => entry.id === topic.category);
    const index = topics.indexOf(topic);
    const previous = topics[index - 1];
    const next = topics[index + 1];
    const max = topic.quiz.length;

    const steps = `
      <ol class="ga-steps" aria-label="Lesson steps">
        <li class="is-done"><span>1</span>Lesson padho</li>
        <li class="${item.attempts > 0 ? 'is-done' : 'is-active'}"><span>2</span>${max} MCQs do</li>
        <li class="${item.completed ? 'is-done' : ''}"><span>3</span>Lesson complete</li>
      </ol>`;

    const intro = topic.intro.map(text => `<p>${esc(text)}</p>`).join('');
    const rules = topic.rules.map(rule => `
      <article class="ga-rule">
        <h4>${esc(rule.title)}</h4>
        <p>${esc(rule.text)}</p>
        ${exampleList(rule.examples)}
      </article>`).join('');
    const mistakes = topic.mistakes.map(mistake => `
      <div class="ga-mistake">
        <p class="ga-wrong"><span aria-hidden="true">\u2717</span><span class="ga-sr">Galat: </span>${esc(mistake.wrong)}</p>
        <p class="ga-right"><span aria-hidden="true">\u2713</span><span class="ga-sr">Sahi: </span>${esc(mistake.right)}</p>
        <p class="ga-why">${esc(mistake.why)}</p>
      </div>`).join('');

    const ctaText = item.completed
      ? `Ye lesson complete ho chuka hai (best ${item.best}/${max}). Chaho to quiz dobara de sakte ho.`
      : item.attempts > 0
        ? `Pichla score ${item.last}/${max}. Complete karne ke liye ${PASS_MARK}/${max} chahiye. Phir se try karo.`
        : `Ab ${max} MCQs ke saath apni understanding check karo. ${PASS_MARK}/${max} score par lesson complete hoga.`;

    return `
      <div class="ga-toolbar">
        <button type="button" class="text-link" data-ga-action="hub">\u2190 All topics</button>
        <span class="tiny-badge">${esc(category ? category.title.toUpperCase() : '')} \u00B7 ${topic.minutes} MIN</span>
      </div>
      <article class="ga-lesson">
        <header class="ga-lesson-head">
          <span class="ga-topic-icon is-large" aria-hidden="true">${esc(topic.icon)}</span>
          <div>
            <div class="eyebrow">LESSON ${index + 1} OF ${topics.length} \u00B7 ${esc(topic.level.toUpperCase())}</div>
            <h2 tabindex="-1" data-ga-focus="lesson-title">${esc(topic.title)}</h2>
            <span class="ga-status is-${status.key}">${esc(status.label)}</span>
          </div>
        </header>
        ${steps}
        <section class="ga-block">
          <h3>Easy explanation</h3>
          ${intro}
        </section>
        <section class="ga-block">
          <h3>Rules aur examples</h3>
          <div class="ga-rules">${rules}</div>
        </section>
        ${renderTenses(topic)}
        <section class="ga-block">
          <h3>Common mistakes</h3>
          <div class="ga-mistakes">${mistakes}</div>
        </section>
        <section class="ga-cta">
          <div>
            <h3>${item.completed ? 'Practice again' : 'Quiz time'}</h3>
            <p>${esc(ctaText)}</p>
          </div>
          <button type="button" class="primary-button" data-ga-action="start-quiz" data-ga-topic="${esc(topic.id)}">${item.attempts > 0 ? 'Retake quiz' : 'Start quiz'} <span>\u2192</span></button>
        </section>
        <nav class="ga-pager" aria-label="Lesson navigation">
          ${previous ? `<button type="button" class="text-link" data-ga-action="open" data-ga-topic="${esc(previous.id)}">\u2190 ${esc(previous.title)}</button>` : '<span></span>'}
          ${next ? `<button type="button" class="text-link" data-ga-action="open" data-ga-topic="${esc(next.id)}">${esc(next.title)} \u2192</button>` : '<span></span>'}
        </nav>
      </article>`;
  }

  function renderQuiz() {
    const topic = byId.get(quiz.topicId);
    const total = quiz.items.length;
    const item = quiz.items[quiz.index];
    const answeredPercent = Math.round(((quiz.index + (item.submitted ? 1 : 0)) / total) * 100);
    const correctPosition = item.order.indexOf(item.q.answer);
    const letters = ['A', 'B', 'C', 'D'];

    const options = item.order.map((originalIndex, position) => {
      let stateClass = '';
      if (item.submitted) {
        if (position === correctPosition) stateClass = 'is-correct';
        else if (position === item.picked) stateClass = 'is-wrong';
        else stateClass = 'is-dim';
      } else if (position === item.picked) {
        stateClass = 'is-selected';
      }
      return `
        <button type="button" class="ga-option ${stateClass}" data-ga-action="pick" data-ga-pos="${position}"
          aria-pressed="${position === item.picked ? 'true' : 'false'}" ${item.submitted ? 'aria-disabled="true"' : ''}>
          <span class="ga-opt-key" aria-hidden="true">${letters[position]}</span>
          <span class="ga-opt-text">${esc(item.q.options[originalIndex])}</span>
        </button>`;
    }).join('');

    let feedback = '';
    if (item.submitted) {
      const right = isCorrect(item);
      feedback = `
        <div class="ga-feedback ${right ? 'is-correct' : 'is-wrong'}" role="status" tabindex="-1" data-ga-focus="feedback">
          <strong>${right ? '\u2713 Sahi jawab!' : '\u2717 Galat jawab'}</strong>
          ${right ? '' : `<p>Sahi answer: <b>${letters[correctPosition]}. ${esc(item.q.options[item.q.answer])}</b></p>`}
          <p>${esc(item.q.explain)}</p>
        </div>`;
    }

    const isLast = quiz.index === total - 1;
    const button = item.submitted
      ? `<button type="button" class="primary-button" data-ga-action="next">${isLast ? 'See result' : 'Next question'} <span>\u2192</span></button>`
      : `<button type="button" class="primary-button" data-ga-action="submit" ${item.picked === null ? 'disabled' : ''}>Submit answer</button>`;

    return `
      <div class="ga-toolbar">
        <button type="button" class="text-link" data-ga-action="open" data-ga-topic="${esc(topic.id)}">\u2190 Back to lesson</button>
        <span class="tiny-badge">QUESTION ${quiz.index + 1} / ${total}</span>
      </div>
      <div class="ga-qprogress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${answeredPercent}" aria-label="Quiz progress"><i style="width:${answeredPercent}%"></i></div>
      <article class="ga-quiz">
        <div class="eyebrow">${esc(topic.title.toUpperCase())} \u00B7 QUIZ</div>
        <h2 class="ga-qtext" tabindex="-1" data-ga-focus="question">${esc(item.q.q)}</h2>
        <div class="ga-options" role="group" aria-label="Answer options">${options}</div>
        ${feedback}
        <div class="ga-actions">${button}</div>
      </article>`;
  }

  function renderResult() {
    const topic = byId.get(quiz.topicId);
    const total = quiz.items.length;
    const { score, newlyCompleted } = quiz.result;
    const item = record(topic.id);
    const passed = score >= PASS_MARK;
    const index = topics.indexOf(topic);
    const next = topics[index + 1];
    const letters = ['A', 'B', 'C', 'D'];

    const message = score === total
      ? 'Perfect score! Bahut badhiya.'
      : passed
        ? 'Achha kaam! Thodi aur practice se perfect ho jaayega.'
        : 'Koi baat nahi. Lesson ek baar dobara padho aur quiz retry karo.';

    const review = quiz.items.map((entry, number) => {
      const right = isCorrect(entry);
      return `
        <li class="ga-review-item ${right ? 'is-correct' : 'is-wrong'}">
          <span class="ga-review-mark" aria-hidden="true">${right ? '\u2713' : '\u2717'}</span>
          <div>
            <p class="ga-review-q"><span class="ga-sr">${right ? 'Sahi. ' : 'Galat. '}</span>${number + 1}. ${esc(entry.q.q)}</p>
            <p class="ga-review-a">Aapka answer: ${esc(entry.q.options[entry.order[entry.picked]])}${right ? '' : ` \u00B7 Sahi: <b>${esc(entry.q.options[entry.q.answer])}</b>`}</p>
            <p class="ga-review-e">${esc(entry.q.explain)}</p>
          </div>
        </li>`;
    }).join('');

    return `
      <div class="ga-toolbar">
        <button type="button" class="text-link" data-ga-action="hub">\u2190 All topics</button>
        <span class="tiny-badge">QUIZ RESULT</span>
      </div>
      <article class="ga-result">
        <div class="ga-score ${passed ? 'is-pass' : 'is-fail'}" role="img" aria-label="Score ${score} out of ${total}">
          <strong tabindex="-1" data-ga-focus="score">${score}<small>/${total}</small></strong>
        </div>
        <div class="eyebrow">${esc(topic.title.toUpperCase())}</div>
        <h2>${esc(message)}</h2>
        <p class="ga-result-line">${passed
          ? (newlyCompleted ? '\u2726 Lesson complete ho gaya!' : '\u2713 Lesson already complete hai.')
          : item.completed
            ? 'Lesson pehle se complete hai, aapka best score safe hai. Is baar score kam raha.'
            : `Lesson complete karne ke liye ${PASS_MARK}/${total} chahiye.`}
          Best score: ${item.best}/${total} \u00B7 Attempts: ${item.attempts}</p>
        <div class="ga-actions is-center">
          <button type="button" class="primary-button" data-ga-action="retry" data-ga-topic="${esc(topic.id)}">Retry quiz</button>
          <button type="button" class="ga-ghost" data-ga-action="open" data-ga-topic="${esc(topic.id)}">Review lesson</button>
          ${passed && next ? `<button type="button" class="ga-ghost" data-ga-action="open" data-ga-topic="${esc(next.id)}">Next: ${esc(next.title)} \u2192</button>` : ''}
        </div>
        <h3 class="ga-review-title">Aapke answers</h3>
        <ol class="ga-review">${review}</ol>
      </article>`;
  }

  function renderError() {
    return `
      <div class="ga-error">
        <h3>Grammar lessons load nahi hue</h3>
        <p>Page refresh karke dobara try karo. Agar problem bani rahe, to js/grammar-data-*.js files check karo.</p>
      </div>`;
  }

  /* ---------- render + focus ---------- */
  function render(options = {}) {
    let html;
    if (!topics.length) html = renderError();
    else if (state.screen === 'lesson' && byId.has(state.topicId)) html = renderLesson(byId.get(state.topicId));
    else if (state.screen === 'quiz' && quiz) html = renderQuiz();
    else if (state.screen === 'result' && quiz && quiz.result) html = renderResult();
    else { state = { screen: 'hub', topicId: null }; html = renderHub(); }

    root.innerHTML = html;

    if (options.scroll) {
      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = Math.max(0, root.getBoundingClientRect().top + window.scrollY - 24);
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
    if (options.focus) {
      const target = root.querySelector(options.focus);
      if (target) target.focus({ preventScroll: true });
    }
  }

  /* ---------- actions ---------- */
  function openTopic(id) {
    if (!byId.has(id)) return;
    quiz = null;
    state = { screen: 'lesson', topicId: id };
    render({ scroll: true, focus: '[data-ga-focus="lesson-title"]' });
  }

  function startQuiz(id) {
    const topic = byId.get(id);
    if (!topic) return;
    quiz = {
      topicId: id,
      index: 0,
      done: false,
      result: null,
      items: topic.quiz.map(q => ({ q, order: shuffle([0, 1, 2, 3]), picked: null, submitted: false }))
    };
    state = { screen: 'quiz', topicId: id };
    render({ scroll: true, focus: '[data-ga-focus="question"]' });
  }

  function finishQuiz() {
    if (!quiz || quiz.done) return;
    quiz.done = true;

    const score = quiz.items.filter(isCorrect).length;
    const item = progress.lessons[quiz.topicId] || record(quiz.topicId);
    const wasCompleted = item.completed === true;
    const stamp = new Date().toISOString();

    const updated = {
      completed: wasCompleted || score >= PASS_MARK,
      attempts: item.attempts + 1,
      best: Math.max(item.best === null ? 0 : item.best, score),
      last: score,
      lastAt: stamp,
      completedAt: item.completedAt || (score >= PASS_MARK ? stamp : null)
    };
    progress.lessons[quiz.topicId] = updated;
    saveProgress();
    updateHomeCard();

    quiz.result = { score, newlyCompleted: !wasCompleted && updated.completed };
    state = { screen: 'result', topicId: quiz.topicId };
    render({ scroll: true, focus: '[data-ga-focus="score"]' });
  }

  function resetProgress() {
    let confirmed = false;
    try {
      confirmed = window.confirm('Grammar Academy ka saara progress aur scores delete ho jaayenge. Continue?');
    } catch (error) {
      confirmed = false;
    }
    if (!confirmed) return;

    progress = emptyProgress();
    saveProgress();
    updateHomeCard();
    render();
    notify('Grammar progress reset ho gaya.');
  }

  function onClick(event) {
    const control = event.target.closest('[data-ga-action]');
    if (!control || !root.contains(control)) return;

    const action = control.dataset.gaAction;
    const topicId = control.dataset.gaTopic;

    switch (action) {
      case 'hub':
        quiz = null;
        state = { screen: 'hub', topicId: null };
        render({ scroll: true });
        break;
      case 'open':
        openTopic(topicId);
        break;
      case 'start-quiz':
      case 'retry':
        startQuiz(topicId);
        break;
      case 'pick': {
        if (!quiz || state.screen !== 'quiz') break;
        const item = quiz.items[quiz.index];
        if (item.submitted) break;
        const position = Number(control.dataset.gaPos);
        if (!Number.isInteger(position) || position < 0 || position > 3) break;
        item.picked = position;
        render({ focus: `.ga-option[data-ga-pos="${position}"]` });
        break;
      }
      case 'submit': {
        if (!quiz || state.screen !== 'quiz') break;
        const item = quiz.items[quiz.index];
        if (item.submitted || item.picked === null) break;
        item.submitted = true;
        render({ focus: '[data-ga-focus="feedback"]' });
        break;
      }
      case 'next': {
        if (!quiz || state.screen !== 'quiz') break;
        const item = quiz.items[quiz.index];
        if (!item.submitted) break;
        if (quiz.index < quiz.items.length - 1) {
          quiz.index += 1;
          render({ focus: '[data-ga-focus="question"]' });
        } else {
          finishQuiz();
        }
        break;
      }
      case 'expand-all':
      case 'collapse-all':
        root.querySelectorAll('details.ga-tense').forEach(node => { node.open = action === 'expand-all'; });
        break;
      case 'reset':
        resetProgress();
        break;
      default:
        break;
    }
  }

  root.addEventListener('click', onClick);

  // Opening Grammar Academy from the sidebar, home card or Learn page always starts at the topic list.
  document.addEventListener('click', event => {
    if (event.target.closest && event.target.closest('[data-view="grammar"]')) {
      quiz = null;
      state = { screen: 'hub', topicId: null };
      render();
    }
  });

  // Keep progress in sync if it changes in another tab.
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    progress = loadProgress();
    updateHomeCard();
    if (state.screen === 'hub') render();
  });

  render();
  updateHomeCard();
})();
