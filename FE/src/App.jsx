import { useRoutes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clientRoutes from './routes/clientRoutes';

import adminRoutes from './routes/adminRoutes';

function App() {
  const routes = [...clientRoutes, adminRoutes];
  const element = useRoutes(routes);
  return(
  <>
    {element}
    <ToastContainer 
        position="top-center" 
        autoClose={1000}   
        hideProgressBar={true}
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="colored"
      />
  </>
  );
}

export default App;
