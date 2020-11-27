import { RendererLike } from 'render-jsx';
import { state } from 'callbag-state';

import { AuthService } from './service';
import { Header } from '../misc/header';
import { Buttons } from '../misc/buttons';


export function Login(_: unknown, renderer: RendererLike<Node>) {
  const token = state('');
  const login = () => AuthService.instance.login(token.get());

  return <>
    <Header>Login</Header>
    <br/>
    Please provide your login token: <br/>
    <input type='text' _state={token} placeholder='login token goes here ...'/>
    <Buttons>
      <button onclick={login}>
        Login
      </button>
    </Buttons>
  </>;
}
