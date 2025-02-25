import { Container, Typography, Box, Button } from "@mui/material";
import LoginButton from "../components/common/LoginButton";
import LogoutButton from "../components/common/LogoutButton";
import ingresoImage from '../assets/images/ingreso.png';
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { EmpleadoGetByEmail } from "../services/EmpleadoService";
import { setUser } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { useNavigate } from "react-router-dom";
import colorConfigs from "../configs/colorConfig";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { EmpresaGetBySucursal, EmpresaGetBySucursalID } from "../services/EmpresaService";
import { setEmpresa } from "../redux/slices/empresaSlice";
import { SucursalGetById } from "../services/SucursalService";
import { setSucursal } from "../redux/slices/sucursalSlice";

const Ingreso = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const empleado = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const getEmpresaBySucursal = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    if (empleado?.sucursal) {

      return await EmpresaGetBySucursalID(empleado.sucursal.id, token);
    }
  };

  const getSucursalById = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    if (empleado?.sucursal) {
      console.log(empleado.sucursal.id);
      return await SucursalGetById(empleado.sucursal.id, token);
    }
  };

  const handleIngresar = () => {
    console.log(empleado?.usuario.rol);
    switch (empleado?.usuario.rol) {
      case "SUPERADMIN":
        navigate('/empresas');
        break;
      case "ADMIN":
        navigate('/sucursales');
        break;
      case "CAJERO":
        navigate('/pedidos');
        break;
      case "COCINERO":
        navigate('/pedidos');
        break;
      case "DELIVERY":
        navigate('/pedidos');
        break;
      default:
        navigate('/unauthorized');
        break;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const traerEmpleado = async (email: string) => {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });
        const empleado = await EmpleadoGetByEmail(email, token);
        console.log("id sucursal " + empleado.data.sucursal?.id);
        if (empleado) {
          dispatch(setUser(empleado.data));
          const empresa = await getEmpresaBySucursal();
          if (empresa) dispatch(setEmpresa(empresa));
          const sucursal = await getSucursalById();
          if (sucursal) dispatch(setSucursal(sucursal));
          console.log(empleado.data.sucursal?.id);
        }
      };
      if (isAuthenticated && user?.email) {
        traerEmpleado(user.email);
      }
    }
  }, [isAuthenticated]);

  return (
    <Container
      component="main"
      maxWidth={false} // Para que ocupe todo el ancho
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#af2919", // Fondo naranja
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white", // Fondo blanco del box
          width: "100%", // Ajusta si necesitas un ancho fijo
          maxWidth: "400px",
        }}
      >
        {!isAuthenticated ? (
          <>
            <Typography component="h1" variant="h5" gutterBottom>
              Iniciar Sesión
            </Typography>
            <Box
              component="img"
              src={ingresoImage}
              alt="Ingreso"
              sx={{ width: "100%", mb: 2, borderRadius: 2 }}
            />
            <LoginButton />
          </>
        ) : (
          <>
            <Typography component="h1" variant="h5" gutterBottom>
              Inició sesión como... {empleado?.nombre}
            </Typography>
            <LogoutButton />
            <Box
              component="img"
              src={ingresoImage}
              alt="Ingreso"
              sx={{ width: "100%", mb: 2, borderRadius: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleIngresar}
              sx={{ ...colorConfigs.buttonIngresar }}
            >
              <AccountCircleIcon /> Ingresar
            </Button>
           
          </>
        )}
      </Box>
    </Container>
  );
};

export default Ingreso;
