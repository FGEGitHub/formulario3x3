import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import servicio from "../../services/servicio";

import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

export default function CrearTorneo() {
  const [step, setStep] = useState(1);

  const [nombre, setNombre] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [usarTodos, setUsarTodos] = useState(true);

  const [cantidadZonas, setCantidadZonas] = useState(2);
  const [zonas, setZonas] = useState([]);
  const [modo, setModo] = useState(null);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    traerEquipos();
  }, []);

  const traerEquipos = async () => {
    const res = await servicio.traerEquipos();
    const data = res || [];
    setEquipos(data);
    setSeleccionados(data);
  };

  const equiposFinal = usarTodos ? equipos : seleccionados;

  // 🔀 shuffle real
  const shuffle = (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // 🧠 zonas flexibles
  const generarZonasFlex = (equipos, zonasCant) => {
    const total = equipos.length;
    const base = Math.floor(total / zonasCant);
    const extra = total % zonasCant;

    const zonas = [];
    let index = 0;

    for (let i = 0; i < zonasCant; i++) {
      const size = base + (i < extra ? 1 : 0);
      zonas.push(equipos.slice(index, index + size));
      index += size;
    }

    return zonas;
  };

  // 🎲 animación sorteo
  const hacerSorteo = () => {
    setModo("random");
    setAnimando(true);

    let vueltas = 12;
    let temp = [...equiposFinal];

    const interval = setInterval(() => {
      temp = shuffle(temp);
      setZonas(generarZonasFlex(temp, cantidadZonas));
      vueltas--;

      if (vueltas === 0) {
        clearInterval(interval);
        setAnimando(false);
      }
    }, 120);
  };

  // 🧲 drag & drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceZona = parseInt(result.source.droppableId);
    const destZona = parseInt(result.destination.droppableId);

    const sourceItems = [...zonas[sourceZona]];
    const destItems = [...zonas[destZona]];

    const [moved] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, moved);

    const nuevas = [...zonas];
    nuevas[sourceZona] = sourceItems;
    nuevas[destZona] = destItems;

    setZonas(nuevas);
  };

  const toggleEquipo = (eq) => {
    if (seleccionados.find(e => e.id === eq.id)) {
      setSeleccionados(seleccionados.filter(e => e.id !== eq.id));
    } else {
      setSeleccionados([...seleccionados, eq]);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">Crear Torneo</Typography>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <TextField
            label="Nombre"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Typography mt={2}>
            Equipos disponibles: {equipos.length}
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={usarTodos}
                onChange={(e) => {
                  setUsarTodos(e.target.checked);
                  setSeleccionados(e.target.checked ? equipos : []);
                }}
              />
            }
            label="Participan todos"
          />

          <Button onClick={() => setStep(2)} variant="contained">
            Siguiente
          </Button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && !usarTodos && (
        <>
          <Typography>Seleccionar equipos</Typography>

          <Grid container spacing={1} mt={1}>
            {equipos.map((eq) => (
              <Grid item key={eq.id}>
                <Button
                  variant={seleccionados.find(e => e.id === eq.id) ? "contained" : "outlined"}
                  onClick={() => toggleEquipo(eq)}
                >
                  {eq.nombre}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Typography mt={2}>
            Seleccionados: {seleccionados.length}
          </Typography>

          <Button onClick={() => setStep(1)}>Volver</Button>
          <Button
            onClick={() => setStep(3)}
            disabled={seleccionados.length < 4}
            variant="contained"
          >
            Siguiente
          </Button>
        </>
      )}

      {/* STEP 3 */}
      {(step === 2 && usarTodos) || step === 3 ? (
        <>
          <Typography mt={3}>
            Cantidad de zonas
          </Typography>

          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            {[2,3,4,5,6,7,8].map((n) => (
              <Button
                key={n}
                variant={cantidadZonas === n ? "contained" : "outlined"}
                onClick={() => setCantidadZonas(n)}
              >
                {n} zonas
              </Button>
            ))}
          </Box>

          <Typography mt={2}>
            Se distribuirán {equiposFinal.length} equipos
          </Typography>

          <Button onClick={() => setStep(2)}>Volver</Button>
          <Button onClick={() => setStep(4)} variant="contained">
            Confirmar
          </Button>
        </>
      ) : null}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <Typography mt={3}>Modo de distribución</Typography>

          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={() => {
                hacerSorteo();
                setStep(5);
              }}
            >
              🎲 Random
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                setModo("manual");
                setZonas(generarZonasFlex(equiposFinal, cantidadZonas));
                setStep(5);
              }}
            >
              ✋ Manual
            </Button>
          </Box>

          <Button onClick={() => setStep(3)}>Volver</Button>
        </>
      )}

      {/* STEP 5 RESULTADO */}
      {step === 5 && (
        <>
          <Typography mt={3}>
            Zonas ({modo}) {animando && "🎬 sorteando..."}
          </Typography>

          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container spacing={2} mt={2}>
              {zonas.map((zona, i) => (
                <Grid item xs={12} md={3} key={i}>
                  <Droppable droppableId={i.toString()}>
                    {(provided) => (
                      <Card ref={provided.innerRef} {...provided.droppableProps}>
                        <CardContent>
                          <Typography variant="h6">
                            Zona {i + 1} ({zona.length})
                          </Typography>

                          {zona.map((eq, index) => (
                            <Draggable
                              key={eq.id}
                              draggableId={eq.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    p: 1,
                                    m: 1,
                                    background: "#eee",
                                    borderRadius: 1,
                                    cursor: "grab"
                                  }}
                                >
                                  {eq.nombre}
                                </Box>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </CardContent>
                      </Card>
                    )}
                  </Droppable>
                </Grid>
              ))}
            </Grid>
          </DragDropContext>

          <Button onClick={() => setStep(4)}>Volver</Button>
        </>
      )}
    </Box>
  );
}