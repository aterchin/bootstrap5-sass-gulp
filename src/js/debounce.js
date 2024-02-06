// debounce timer
//webdesign.tutsplus.com/tutorials/javascript-debounce-and-throttle--cms-36783

/*
 *   Usage:
 *   window.addEventListener('resize', (e) => {
 *     let myvar = debounce('mycallback', 500);
 *   });
 */

export let debounceTimer;

export default function debounce(callback, time) {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(callback, time);
};
