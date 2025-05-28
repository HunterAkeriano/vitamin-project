import { classManipulator, getElements } from '../composables/use-call-dom.ts';

export function removeSkeletons() {
  document.addEventListener('loadingIsFinished', () => {
    setTimeout(() => {
      const skeletons = getElements('.skeleton');

      skeletons.forEach((skeleton) => {
        classManipulator(skeleton, 'remove', 'skeleton');
      });
    }, 2000);
  })
}