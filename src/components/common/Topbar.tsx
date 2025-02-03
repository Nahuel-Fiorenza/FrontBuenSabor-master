import { AppBar, Toolbar, Typography, Box, Avatar, Stack } from "@mui/material";
import FoodBankIcon from '@mui/icons-material/FoodBank';
import colorConfigs from "../../configs/colorConfig";
import sizeConfigs from "../../configs/sizeConfig";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import avatarImage from '../../assets/images/logo.png';
import SucursalDdl from "../iu/Sucursal/SucursalDdl";
import ProtectedComponent from "../auth0/ProtectedComponent";

const Topbar = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const [title, setTitle] = useState("");

  const isSucursalOrEmpresa = location.pathname.includes('empresas') || location.pathname.includes('sucursales');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("estadisticas")) setTitle("Estadisticas");
    else if (path.includes("manufacturados")) setTitle("Manufacturados");
    else if (path.includes("insumos")) setTitle("Insumos");
    else if (path.includes("categorias")) setTitle("Categorías");
    else if (path.includes("promociones")) setTitle("Promociones");
    else if (path.includes("unidad-medida")) setTitle("Unidades de Medida");
    else if (path.includes("empleados")) setTitle("Empleados");
    else if (path.includes("pedidos")) setTitle("Pedidos");
    else setTitle("");
  }, [location.pathname]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 0)`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative"
        }}
      >
        <Stack
          sx={{ width: "250px" }}
          direction="row"
          justifyContent="center"
        >
         <Link to="http://localhost:5173">
    <Avatar src={avatarImage} sx={{ width: 70, height: 70 }} />
  </Link>
        </Stack>
        <Typography variant="h6"></Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            fontSize: "24px", // Ajusta el tamaño de la letra (puedes cambiar el valor)
            fontWeight: "bold" // Hace que el texto sea negrita
          }}
        > El Buen Sabor <FoodBankIcon></FoodBankIcon></Box>
        {
          !isSucursalOrEmpresa && (
            <ProtectedComponent roles={["administrador", "superadmin"]}>
              <SucursalDdl />
            </ProtectedComponent>
          )
        }
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%"
          }}
        >
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <LoginButton />
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            left: "265px",
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}
        >
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
