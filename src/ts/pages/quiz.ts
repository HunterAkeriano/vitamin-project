import { initQuestions } from '../quiz/quiz-count';
import { saveAnswers } from '../quiz/quiz-save-answers';

document.addEventListener('DOMContentLoaded', async () => {
  initQuestions();
  saveAnswers();
});
