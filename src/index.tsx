import jss from 'jss';
import preset from 'jss-preset-default';
import { Conditional, makeRenderer } from 'callbag-jsx';

import { Login } from './auth/login';
import { AuthService } from './auth/service';
import { NavBar } from './nav/navbar';

import { Style } from './style';
import { Articles } from './articles';
import { Issues } from './issues';
import { Readers } from './readers';
import { Route } from './nav/route';


jss.setup(preset());

const renderer = makeRenderer();
renderer.render(<>
  <link rel="preconnect" href="https://fonts.gstatic.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Hind:wght@300;600&display=swap" rel="stylesheet"/>
  <Style/>
</>).on(document.head);

renderer.render(<div class='container'>
  <Conditional if={AuthService.instance.loggedIn}
    then={() => <>
      <NavBar/>
      <Route path='articles' comp={() => <Articles/>}/>
      <Route path='issues' comp={() => <Issues/>}/>
      <Route path='readers' comp={() => <Readers/>}/>
    </>}
    else={() => <Login/>}
  />
</div>).on(document.body);
