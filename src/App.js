import React from 'react';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import AppHeader from './components/Header';
import Todo from './components/Todo';

import './App.scss';

function App() {
  return (
    <>
      <AppHeader />
      <Content>
        <Todo />
      </Content>
    </>
  );
}

export default App;
