import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Formulario() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos:", form);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          mx: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" textAlign="center">
          Formulario de Registro
        </Typography>

        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />

        <TextField
          label="DNI"
          name="dni"
          type="number"
          value={form.dni}
          onChange={handleChange}
          required
        />

        <DatePicker
          label="Fecha de Nacimiento"
          value={form.fechaNacimiento}
          onChange={(newValue) =>
            setForm({ ...form, fechaNacimiento: newValue })
          }
          renderInput={(params) => <TextField {...params} />}
        />

        <Button type="submit" variant="contained">
          Enviar
        </Button>
      </Box>
    </LocalizationProvider>
  );
}