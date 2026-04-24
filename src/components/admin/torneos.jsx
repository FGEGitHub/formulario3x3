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
  Paper,
  TableContainer
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import servicio from "../../services/servicio";

export default function TorneosAdmin() {
  const [torneos, setTorneos] = useState([]);
  const navigate = useNavigate();

  const traerTorneos = async () => {
    try {
      const response = await servicio.traerTorneos();
      console.log("Torneos traídos:", response);
      setTorneos(response);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
                  <TableCell>Acciones</TableCell> {/* 👈 nueva */}

            </TableRow>
          </TableHead>

         <TableBody>
  {torneos.length > 0 ? (
    torneos.map((torneo) => (
      <TableRow key={torneo.id}>
        <TableCell>{torneo.nombre || "Sin nombre"}</TableCell>

        <TableCell>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/torneo/${torneo.id}`)}
          >
            Ir a torneo
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={2}>No hay torneos</TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}