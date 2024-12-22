//archivo principal donde tenemos la aplicación
import logo from './LogoSC.png'
import './App.css';
//importamos componentes 
import CompShowDeportivos from './sportconnect/ShowDeportivos';
import CompEditDireccion from './sportconnect/EditDireccion';
import CompEditEncargado from './sportconnect/EditEncargado';
import CompEditCancha from './sportconnect/EditCancha';
import CompEditDeportivo from './sportconnect/EditDeportivo';
import CompCreateDeportivo from './sportconnect/CreateDeportivo';
import CompCreateCancha from './sportconnect/CreateCancha';
import CompCreateDireccion from './sportconnect/CreateDireccion';
import CompCreateEncargado from './sportconnect/CreateEncargado';
import CompLogin from './sportconnect/login';
//Importamos herramientas de enrutamiento 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CompCreateHorario from './sportconnect/CreateHorario';
import CompEditHorario from './sportconnect/EditHorario';


function App() {
  return (
    <div className="App">
        <img className='LogoMain' src={logo}/>
        {/*Se utilizan 3 componentes para el enrutador, browser, routes, route. Aqui se envuelve el componente en el contexto de enrutamiento */}
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<CompLogin/>} />    
            <Route path='/showDeportivos/:userType/:RFC_CURP' element={<CompShowDeportivos/>} />    
            <Route path='/editDireccion/:ID_Direccion' element={<CompEditDireccion/>} /> {/*Agregar los dos puntos para asegurarse de que se estan pasando los parametros y cargue bien la pagina*/}               
            <Route path='/editEncargado/:ID_Encargado' element={<CompEditEncargado/>} /> {/*Asegurarse de que se esta pasando la ID adecuada*/}               
            <Route path='/editCancha/:ID_Cancha/:ID_Deportivo/:RFC_CURP' element={<CompEditCancha/>} /> {/*Asegurarse de que se esta pasando la ID adecuada, en este caso 2 para modificar la cancha y el segundo para obtener el deportivo y todas sus canchas correspondientes*/}                         
            <Route path='/editDeportivo/:ID_Deportivo' element={<CompEditDeportivo/>} /> {/*Asegurarse de que se esta pasando la ID adecuada*/}                         
            <Route path='/createDireccion/:deportivo_id' element={<CompCreateDireccion/>} /> 
            <Route path='/createDeportivo/' element={<CompCreateDeportivo/>} /> {/*Asegurarse de que se esta pasando la ID adecuada*/}                         
            <Route path='/createEncargado/:deportivo_id' element={<CompCreateEncargado/>} /> {/*Asegurarse de que se esta pasando la ID adecuada, en este caso la de el ID_Deportivo, que no servirá para referenciar a que Deportivo corresponde el encargado que se va a crear*/}                                     
            <Route path='/createCancha/:ID_Deportivo/:coordsParam/:RFC_CURP' element={<CompCreateCancha/>} /> {/*Asegurarse de que se esta pasando la ID adecuada, las coordenadas y el rfc, para que cuando volvamos al menu se sigan cargando los deportivos coorespondientes al encargado*/}                         
            <Route path='/createHorario/:deportivo_id/' element={<CompCreateHorario/>} /> {/*Asegurarse de que se esta pasando la ID adecuada*/}
            <Route path='/editHorario/:ID_Deportivo/' element={<CompEditHorario/>} /> {/*Asegurarse de que se esta pasando la ID adecuada*/}
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
