

import Ruta1 from '../pages/formulario/index';
import Jugadores from '../pages/adminjugadores';
import Torneos from '../pages/admintorneos';
import Creartorneo from '../pages/admincreartorneo';
import Admintorneo from '../pages/admintorneo';


const Rutas = [
 
    { path: '/', element: <Ruta1 /> },
{ path: '/formulario', element: <Ruta1 /> },
{ path: '/adminjugadores', element: <Jugadores /> },
{ path: '/admintorneos', element: <Torneos /> },
{ path: '/admincreartorneo', element: <Creartorneo /> },
{ path: '/torneo/:id', element: <Admintorneo /> }

    ];


export default Rutas;