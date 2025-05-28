export function stop() {
  const loadingIsFinished = new CustomEvent('loadingIsFinished');
  document.dispatchEvent(loadingIsFinished);
}
