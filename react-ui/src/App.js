import 'rsuite/lib/styles/index.less';

import Header from './components/Header/Header';
import Content from './components/Content/Content';

function App() {
  console.log('Rendering => App');
  return (
    <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
      <Header />
      <Content />
    </div>
  );
}

export default App;
