import axios from "axios"


const API = import.meta.env.VITE_API_URL;


const baseUrl = API+'tresxtres/'




const enviarequipo = async (config) => {
  try {
    const { data } = await axios.post(baseUrl + "equipo", config);
    return data;

  } catch (error) {
    // 🔥 si el backend mandó error (ej: DNI duplicado)
    if (error.response) {
      return Promise.reject(error.response.data);
    }

    // 🔥 error de red u otro
    return Promise.reject({
      error: "Error de conexión con el servidor",
    });
  }
};


const traerEquipos = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'equipos-con-jugadores', datos)
  return data

}
export default {traerEquipos, enviarequipo}