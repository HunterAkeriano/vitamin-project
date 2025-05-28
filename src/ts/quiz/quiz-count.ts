import { getElement, getElements } from '../composables/use-call-dom.ts';
import { validateEmailForm, validateNameForm } from './quiz-validate';

const countCurrent = getElement('.count__current');
const questions = getElements('.quiz');
const nextQuestionBtns = getElements('#next-btn');
const prevBtn = getElement('.back');

let currentQuestionIndex = getQuestionIndexFromURL();

function getQuestionIndexFromURL(): number {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('question') || '0', 10);
}

function updateURL(index: number) {
  const params = new URLSearchParams(window.location.search);
  params.set('question', index.toString());
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function showQuestion(index: number) {
  questions.forEach((question) => question.classList.remove('active'));
  questions[index].classList.add('active');

  if (countCurrent) {
    countCurrent.textContent = (index + 1).toString();
  }

  updateURL(index);
}

function changeQuestion(step: number) {
  const newIndex = currentQuestionIndex + step;

  if (newIndex >= 0 && newIndex < questions.length) {
    currentQuestionIndex = newIndex;
    showQuestion(currentQuestionIndex);
  }

  if (newIndex < 0) {
    window.history.back();
  }
}

export async function initQuestions() {
  showQuestion(currentQuestionIndex);

  if (!nextQuestionBtns) {
    return;
  }

  await validateNameForm();
  await validateEmailForm();

  nextQuestionBtns.forEach((button: HTMLElement) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      if (currentQuestionIndex === 0) {
        const isValid = await validateNameForm();
        if (!isValid) return;
        changeQuestion(1);
        return;
      }

      if (currentQuestionIndex === 8) {
        const isValid = await validateEmailForm();
        if (!isValid) return;
        window.location.href = '/Vitamin/personal-pack.html';
        return;
      }

      changeQuestion(1);
    });
  });

  if (!prevBtn) {
    return;
  }

  prevBtn.addEventListener('click', () => changeQuestion(-1));
}
