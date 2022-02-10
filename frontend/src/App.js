import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Distribution from './components/distribution/Distribution';
import Foods from './components/foods/Foods';
import Layout from './components/layout/Layout';
import Students from './components/students/Students';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Foods />} >

          </Route>
          <Route path='students' element={<Students />} />
          <Route path='distribution' element={<Distribution />
          } />
        </Route>
      </Routes>
    </BrowserRouter>


  );
}

export default App;
