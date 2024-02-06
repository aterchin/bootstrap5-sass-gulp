// import libs
import axios from 'axios';
import bootstrap from '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
// Loading this fixes 'ReferenceError: regeneratorRuntime is not defined' when doing production build
// Need "@babel/plugin-transform-runtime" in dev and "@babel/runtime" in prod
//import '../../node_modules/regenerator-runtime/runtime.js'

// import functional items
import debounce from './debounce.js';

// I didn't include jQuery in this install. Don't even think of using it.  Be a man. Use vanilla JS.
if (window.jQuery && typeof $ === 'undefined') { $ = jQuery; }

class app {
  constructor() {
  }

  init() {
    this.activateEventListeners();
  }

  activateEventListeners() {
    const app = this;
  }

}

window.addEventListener('load', (e) => {
  const screen = new app();
  screen.init();

});

