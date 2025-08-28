import { useRoutes } from 'react-router-dom';
import './App.css';
import clientRoutes from './routes/clientRoutes';
import adminRoutes from './routes/adminRoutes';

function App() {
  const routes = [clientRoutes, adminRoutes];
  const element = useRoutes(routes);
  return element;
}

export default App;
