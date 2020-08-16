import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './stores'
import '../sass/index.scss'
import { CookiesProvider } from 'react-cookie';

import { Main } from './components/Main'

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <Main />
    </Provider>
  </CookiesProvider>,
  document.getElementById('root')
);