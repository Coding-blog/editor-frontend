import state, { State } from 'callbag-state';


export type NavModule = 'articles' | 'issues' | 'readers';

export class NavService {
  static __instance: NavService;
  static get instance() {
    return this.__instance || (this.__instance = new NavService());
  }

  nav: State<NavModule>;

  constructor() {
    this.nav = state<NavModule>(window.location.hash.substr(1) as NavModule || 'articles');
    window.addEventListener('popstate', () => this.navigate(window.location.hash.substr(1) as NavModule, false));
  }

  navigate(nav: NavModule, push = true) {
    if (!nav.length) {
      nav = 'articles';
    }
    this.nav.set(nav);
    if (push) {
      history.pushState(nav, '', '#' + nav);
    }
  }
}
