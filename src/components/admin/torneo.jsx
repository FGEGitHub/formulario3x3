import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";
import { useParams } from "react-router-dom";
import servicio from "../../services/servicio";

export default function TorneoView() {
  const { id } = useParams();

  const [zonas, setZonas] = useState([]);
  const [partidosPorZona, setPartidosPorZona] = useState({});

  // 🔥 generar combinaciones
  const generarPartidos = (equipos) => {
    const partidos = [];

    for (let i = 0; i < equipos.length; i++) {
      for (let j = i + 1; j < equipos.length; j++) {
        partidos.push({
          equipo1: equipos[i],
          equipo2: equipos[j],
          goles1: "",
          goles2: "",
        });
      }
    }

    return partidos;
  };

  const traerTorneo = async () => {
    try {
      const response = await servicio.traerTorneo(id);
      console.log("DATA RAW:", response);

      const { zonas = [], participaciones = [], equipos = [] } = response;

      // 🔥 normalizar equipos
      const equiposPlanos = equipos.flatMap((e) =>
        Array.isArray(e) ? e : [e]
      );

      // 🔥 mapa de equipos
      const equiposMap = {};
      equiposPlanos.forEach((e) => {
        equiposMap[Number(e.id)] = e;
      });

      // 🔥 armar zonas con equipos
      const zonasConEquipos = zonas.map((zona) => {
        const equiposZona = participaciones
          .filter((p) => Number(p.id_zona) === Number(zona.id))
          .map((p) => equiposMap[Number(p.id_equipo)])
          .filter(Boolean);

        return {
          ...zona,
          equipos: equiposZona,
        };
      });

      console.log("ZONAS PROCESADAS:", zonasConEquipos);

      setZonas(zonasConEquipos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    traerTorneo();
  }, [id]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Zonas del torneo
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {zonas.map((zona) => (
          <Paper key={zona.id} sx={{ p: 2, minWidth: 350 }}>
            <Typography variant="h6" mb={2}>
              {zona.nombre || `Zona ${zona.id}`}
            </Typography>

            {/* TABLA DE EQUIPOS */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Equipo</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {zona.equipos?.length > 0 ? (
                  zona.equipos.map((equipo, index) => (
                    <TableRow key={equipo?.id || index}>
                      <TableCell>
                        {equipo?.nombre || "Sin nombre"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>Sin equipos</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* BOTÓN GENERAR PARTIDOS */}
            <Box mt={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  const nuevos = generarPartidos(zona.equipos);

                  setPartidosPorZona((prev) => ({
                    ...prev,
                    [zona.id]: nuevos,
                  }));
                }}
              >
                Generar partidos
              </Button>
            </Box>

            {/* PARTIDOS */}
            <Box mt={2}>
              {partidosPorZona[zona.id]?.map((p, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={1}
                  gap={1}
                >
                  <Typography sx={{ width: 100 }}>
                    {p.equipo1.nombre}
                  </Typography>

                  <input
                    style={{ width: 40 }}
                    value={p.goles1}
                    onChange={(e) => {
                      const val = e.target.value;

                      setPartidosPorZona((prev) => {
                        const copia = [...prev[zona.id]];
                        copia[index].goles1 = val;
                        return { ...prev, [zona.id]: copia };
                      });
                    }}
                  />

                  <Typography>-</Typography>

                  <input
                    style={{ width: 40 }}
                    value={p.goles2}
                    onChange={(e) => {
                      const val = e.target.value;

                      setPartidosPorZona((prev) => {
                        const copia = [...prev[zona.id]];
                        copia[index].goles2 = val;
                        return { ...prev, [zona.id]: copia };
                      });
                    }}
                  />

                  <Typography sx={{ width: 100 }}>
                    {p.equipo2.nombre}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={async () => {
                      const partido = partidosPorZona[zona.id][index];

                      const payload = {
                        id_torneo: id,
                        id_zona: zona.id,
                        id_equipo_1: partido.equipo1.id,
                        id_equipo_2: partido.equipo2.id,
                        goles_1: partido.goles1,
                        goles_2: partido.goles2,
                      };
await servicio.guardarPartido(payload);
alert("Partido guardado");

                      // 👉 después:
                      // servicio.guardarPartido(payload)
                    }}
                  >
                    Guardar
                  </Button>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}