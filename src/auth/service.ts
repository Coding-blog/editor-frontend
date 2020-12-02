import { verifyToken } from '@api/editor-backend';
import { state, State } from 'callbag-state';
import { pipe, map, subscribe} from 'callbag-common';


export class AuthService {
  static __instance: AuthService;

  static get instance() {
    return this.__instance || (this.__instance = new AuthService());
  }

  token: State<string | undefined>;

  constructor() {
    this.token = state(localStorage.getItem('auth_token') || undefined);
    pipe(this.token, subscribe(t => {
      if (t) {
        localStorage.setItem('auth_token', t);
      } else {
        localStorage.removeItem('auth_token');
      }
    }));
  }

  login(token: string) {
    verifyToken(token)
      .then(() => this.token.set(token))
      .catch(() => window.alert('Invalid token!'))
    ;
  }

  logout() {
    this.token.set(undefined);
  }

  get loggedIn() {
    return pipe(this.token, map(_ => !!_));
  }
}


export function authToken() {
  return AuthService.instance.token.get();
}
