import 'rsuite/dist/styles/rsuite-default.css';
import './custom-theme.less'; // Style customization.
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
