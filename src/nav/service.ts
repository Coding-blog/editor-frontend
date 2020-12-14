import g2re from 'glob-to-regexp';
import isEqual from 'lodash.isequal';
import { expr, pipe, subscribe } from 'callbag-common';
import state, { State } from 'callbag-state';


export type RouteParams = {[name: string]: string};
export type QueryParams = {[name: string]: string};

export interface NavigationOptions {
  route?: RouteParams;
  query?: QueryParams;
}


export class NavService {
  static __instance: NavService;
  static get instance() {
    return this.__instance || (this.__instance = new NavService());
  }

  nav: State<string>;
  query: State<QueryParams>;

  constructor() {
    this.nav = state<string>(this.url() || 'articles/unapproved');
    this.query = state<QueryParams>(this.parseQ(this.q()));
    window.addEventListener('popstate', () => this.navigate(this.url(), {
      query: this.parseQ(this.q())
    }, false));
    pipe(
      this.query,
      subscribe(q => {
        if (!isEqual(q, this.parseQ(this.q()))) {
          const nav = this.nav.get();
          history.pushState(nav, '', '#' + nav + '?' + this.serializeQ(q));
        }
      })
    );
  }

  url() { return window.location.hash.substr(1).split('?')[0]; }
  q() { return window.location.hash.substr(1).split('?')[1]; }

  navigate(nav: string, options?: NavigationOptions, push = true) {
    if (!nav.length) {
      nav = 'articles/unapproved';
    }

    if (nav.startsWith('/')) {
      nav = nav.substr(1);
    }

    const absolute = this.absolutify(this.inject(nav, options?.route || {}));

    if (options?.query) {
      this.query.set(options.query);
      if (push) {
        history.pushState(absolute, '', '#' + absolute + '?' + this.serializeQ(options.query));
      }
    } else {
      if (push) {
        history.pushState(absolute, '', '#' + absolute);
      }
    }

    this.nav.set(absolute);
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

  parseQ(query = '') {
    return query.split('&').reduce((t, s) => {
      const p = s.split('=');
      t[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');

      return t;
    }, {} as QueryParams);
  }

  serializeQ(query: QueryParams) {
    return Object.entries(query)
      .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
      .join('&')
    ;
  }
}

export function navigate(nav: string, options?: NavigationOptions, push = true) {
  NavService.instance.navigate(nav, options, push);
}

export function match(route: string) {
  return NavService.instance.match(route);
}

export function Q() {
  return NavService.instance.query;
}
