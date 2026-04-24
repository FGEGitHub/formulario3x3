import React from "react";

import Formulario from "../../components/admin/torneo";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
const HeroSection = () => {
    const navigate = useNavigate();
  return (
   <>
  
   <Formulario/>
   </>
  );
};

export default HeroSection;