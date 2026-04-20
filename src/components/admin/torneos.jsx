import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import servicio from "../../services/servicio";

export default function TorneosAdmin() {
  const [torneos, setTorneos] = useState([]);
  const navigate = useNavigate();

  const traerTorneos = async () => {
    try {
      const response = await servicio.traerTorneos();
      setTorneos(response?.data || []);
    } catch (error) {
      console.error("Error al traer torneos:", error);
    }
  };

  useEffect(() => {
    traerTorneos();
  }, []);

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Torneos</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/admincreartorneo")}
        >
          Crear Torneo
        </Button>
      </Box>

      {/* Tabla */}
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {torneos.length > 0 ? (
            torneos.map((torneo) => (
              <TableRow key={torneo.id}>
                <TableCell>{torneo.nombre}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No hay torneos</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}