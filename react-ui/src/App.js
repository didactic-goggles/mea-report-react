import 'rsuite/lib/styles/index.less';
import { useSelector } from 'react-redux';
import { getAuthState } from './store/reducers/upload';

import Header from './components/Header/Header';
import Content from './components/Content/Content';

const App = (props) => {
  console.log('Rendering => App');
  const authState = useSelector(getAuthState);
  console.log(authState);
  if(authState == false) {
    return (
      <div>
        Unauthorized
      </div>
    )
  }
  return (
    <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
      <Header />
      <Content />
    </div>
  );
}

export default App;
