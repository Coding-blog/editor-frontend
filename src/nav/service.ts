import g2re from 'glob-to-regexp';
import { expr } from 'callbag-common';
import state, { State } from 'callbag-state';


export type RouteParams = {[name: string]: string};

export class NavService {
  static __instance: NavService;
  static get instance() {
    return this.__instance || (this.__instance = new NavService());
  }

  nav: State<string>;

  constructor() {
    this.nav = state<string>(window.location.hash.substr(1) || 'articles/unapproved');
    window.addEventListener('popstate', () => this.navigate(window.location.hash.substr(1), {}, false));
  }

  navigate(nav: string, params: RouteParams = {}, push = true) {
    if (!nav.length) {
      nav = 'articles/unapproved';
    }

    const absolute = this.absolutify(this.inject(nav, params));

    this.nav.set(absolute);
    if (push) {
      history.pushState(absolute, '', '#' + absolute);
    }
  }

  match(route: string) {
    const path = route.split('/').map(s => s.startsWith(':') ? '*' : s).join('/');
    const re = g2re(path);

    return expr($ => re.test($(this.nav, '')));
  }

  extract(route: string) {
    const splits = this.nav.get().split('/');
    const P: RouteParams = {};

    route.split('/').forEach((s, i) => {
      if (s.startsWith(':')) {
        P[s.substr(1)] = decodeURIComponent(splits[i]);
      }
    });

    return P;
  }

  inject(route: string, params: RouteParams) {
    return route.split('/').map(s => {
      if (s.startsWith(':')) {
        return encodeURIComponent(params[s.substr(1)]);
      } else {
        return s;
      }
    }).join('/');
  }

  absolutify(route: string, depth = 1): string {
    if (route.startsWith('../')) {
      return this.nav.get().split('/').slice(0, -depth).concat(this.absolutify(route.substr(3), depth + 1)).join('/');
    } else {
      return route;
    }
  }
}

export function navigate(nav: string, params: RouteParams = {}, push = true) {
  NavService.instance.navigate(nav, params, push);
}

export function match(route: string) {
  return NavService.instance.match(route);
}
