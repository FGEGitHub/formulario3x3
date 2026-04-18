import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import servicio1 from "../services/servicio"
const jugadorVacio = {
  nombre: "",
  apellido: "",
  dni: "",
  fechaNacimiento: null,
  confirmado: false,
  editando: false,
};

export default function Formulario() {
  const [equipo, setEquipo] = useState("");
  const [jugadores, setJugadores] = useState([{ ...jugadorVacio }]);

  // 🎨 estilos inputs oscuros
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      backgroundColor: "#020617",
      borderRadius: 2,
      "& fieldset": { borderColor: "#475569" },
      "&:hover fieldset": { borderColor: "#f97316" },
      "&.Mui-focused fieldset": { borderColor: "#22c55e" },
    },
    "& .MuiInputLabel-root": { color: "#cbd5f5" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
  };

  const handleChangeJugador = (index, field, value) => {
    const nuevos = [...jugadores];
    nuevos[index][field] = value;
    setJugadores(nuevos);
  };

  const confirmarJugador = (index) => {
    const nuevos = [...jugadores];
    const j = nuevos[index];

    if (!j.nombre || !j.apellido || !j.dni) return;

    nuevos[index].confirmado = true;
    nuevos[index].editando = false;

    // solo agrega si es el último
    if (jugadores.length < 5 && index === jugadores.length - 1) {
      nuevos.push({ ...jugadorVacio });
    }

    setJugadores(nuevos);
  };

  const editarJugador = (index) => {
    const nuevos = [...jugadores];
    nuevos[index].editando = true;
    setJugadores(nuevos);
  };

  const eliminarJugador = (index) => {
    const nuevos = jugadores.filter((_, i) => i !== index);

    // si borrás todos, dejamos uno vacío
    if (nuevos.length === 0) {
      setJugadores([{ ...jugadorVacio }]);
    } else {
      setJugadores(nuevos);
    }
  };

  const jugadoresConfirmados = jugadores.filter(j => j.confirmado).length;
const handleSubmit = async () => {
  if (jugadoresConfirmados < 3 || !equipo) return;

  try {
    const jugadoresValidos = jugadores
      .filter(j => j.confirmado)
      .map(j => ({
        nombre: j.nombre,
        apellido: j.apellido,
        dni: j.dni,
        fechaNacimiento: j.fechaNacimiento,
      }));

    const payload = {
      equipo,
      jugadores: jugadoresValidos,
    };

    await servicio1.enviarequipo(payload);

    alert("Equipo registrado correctamente 🏀");

    // reset opcional
    setEquipo("");
    setJugadores([{ ...jugadorVacio }]);

  } catch (error) {
  console.error(error);

  // ✅ error con detalle (DNIs duplicados)
  if (error?.detalle) {
    error.detalle.forEach(d => {
      alert(d.mensaje);
    });
    return;
  }

  // ✅ error simple del backend
  if (error?.error) {
    alert(error.error);
    return;
  }

  // ❌ fallback
  alert("Error al enviar el equipo");
}
};

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          p: 2,
          background: "linear-gradient(135deg, #4CAF50 0%, #1E88E5 100%)",

          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          "@keyframes pulse": {
            "0%": { transform: "scale(1)", opacity: 1 },
            "50%": { transform: "scale(1.1)", opacity: 0.7 },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* TITULO */}
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            🏀 Registro de Equipo
          </Typography>

          {/* EQUIPO */}
          <TextField
            label="Nombre del equipo"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            fullWidth
            sx={inputStyles}
          />

          {/* JUGADORES */}
          {jugadores.map((jugador, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 4,
                background: "linear-gradient(180deg, #1e293b, #0f172a)",
                opacity: jugador.confirmado && !jugador.editando ? 0.6 : 1,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              }}
            >
              {/* BOTÓN BORRAR */}
              <IconButton
                onClick={() => eliminarJugador(index)}
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "#ef4444",
                  zIndex: 3,
                }}
              >
                <DeleteIcon />
              </IconButton>

              <Typography sx={{ color: "#f97316", mb: 1 }}>
                Jugador {index + 1}
              </Typography>

              {/* OVERLAY */}
              {jugador.confirmado && !jugador.editando && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(3px)",
                    animation: "fadeIn 0.4s ease",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#22c55e",
                      fontWeight: "bold",
                      fontSize: "2rem",
                      textAlign: "center",
                      animation: "pulse 1.2s infinite",
                    }}
                  >
                    ✔ REGISTRADO
                  </Typography>
                </Box>
              )}

              <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                  label="Nombre"
                  value={jugador.nombre}
                  onChange={(e) =>
                    handleChangeJugador(index, "nombre", e.target.value)
                  }
                  disabled={jugador.confirmado && !jugador.editando}
                  fullWidth
                  sx={inputStyles}
                />

                <TextField
                  label="Apellido"
                  value={jugador.apellido}
                  onChange={(e) =>
                    handleChangeJugador(index, "apellido", e.target.value)
                  }
                  disabled={jugador.confirmado && !jugador.editando}
                  fullWidth
                  sx={inputStyles}
                />

                <TextField
                  label="DNI"
                  type="number"
                  value={jugador.dni}
                  onChange={(e) =>
                    handleChangeJugador(index, "dni", e.target.value)
                  }
                  disabled={jugador.confirmado && !jugador.editando}
                  fullWidth
                  sx={inputStyles}
                />

                <DatePicker
                  label="Fecha de nacimiento"
                  value={jugador.fechaNacimiento}
                  onChange={(newValue) =>
                    handleChangeJugador(index, "fechaNacimiento", newValue)
                  }
                  disabled={jugador.confirmado && !jugador.editando}
                  renderInput={(params) => (
                    <TextField {...params} sx={inputStyles} />
                  )}
                />

                {/* BOTONES */}
                {!jugador.confirmado || jugador.editando ? (
                  <Button
                    variant="contained"
                    onClick={() => confirmarJugador(index)}
                    sx={{
                      bgcolor: "#f97316",
                      "&:hover": { bgcolor: "#ea580c" },
                    }}
                  >
                    {jugador.editando
                      ? "Guardar cambios"
                      : "Confirmar jugador"}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => editarJugador(index)}
                    sx={{
                      borderColor: "#22c55e",
                      color: "#22c55e",
                    }}
                  >
                    Editar
                  </Button>
                )}
              </Box>
            </Paper>
          ))}

          {/* FINAL */}
      <Button
  variant="contained"
  disabled={jugadoresConfirmados < 3 || !equipo}
  onClick={handleSubmit}
>
  Finalizar equipo ({jugadoresConfirmados}/5)
</Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}