

import Ruta1 from '../pages/formulario/index';
import Jugadores from '../pages/adminjugadores';


const Rutas = [
 
    { path: '/', element: <Ruta1 /> },
{ path: '/formulario', element: <Ruta1 /> },
{ path: '/adminjgadores', element: <Jugadores /> },

    ];


export default Rutas;