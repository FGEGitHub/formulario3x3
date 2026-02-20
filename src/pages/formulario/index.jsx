import React from "react";

import Nav from "../../components/nav";
import Formulario from "../../components/form";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
const HeroSection = () => {
    const navigate = useNavigate();
  return (
   <>
   <Nav/>
   <Formulario/>
   </>
  );
};

export default HeroSection;