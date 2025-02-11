import { Button, Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import Empresa from "../../../types/Empresa";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import EmpresaModal from "./EmpresaModal";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../redux/hook";
import { setEmpresa } from "../../../redux/slices/empresaSlice";
import { useAuth0 } from "@auth0/auth0-react";
import Sucursal from "../../../types/Sucursal";
import { SucursalGetByEmpresaId } from "../../../services/SucursalService";
import { EmpresaUpdate } from "../../../services/EmpresaService";

interface EmpresaCardProps {
    onClose: () => void;
    empresa: Empresa;
}

const EmpresaCard: React.FC<EmpresaCardProps> = ({ onClose, empresa }) => {
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { getAccessTokenSilently } = useAuth0();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    

    const redirectSucursal = () => {
        dispatch(setEmpresa(empresa));
        navigate('/sucursales');
    };

    const handleOpen = () => {
        setEditOpen(true);
    };

    const handleClose = () => {
        setEditOpen(false);
        onClose();
    }

    const handleDelete = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });
    
            const sucursales: Sucursal[] = await SucursalGetByEmpresaId(empresa.id, token);
    
            const sucursalesActivas = sucursales.some(sucursal => !sucursal.eliminado);
            if (sucursalesActivas) {
                toast.error("No se puede eliminar la empresa porque tiene sucursales activas.", {
                    position: "top-right",
                    autoClose: 5000,
                    style: { 
                        width: 'auto', // Ajusta el ancho automáticamente al contenido
                        maxWidth: '400px', // Opcional: Establece un ancho máximo si lo necesitas
                        wordWrap: 'break-word', // Permite cortar palabras
                        whiteSpace: 'pre-wrap', // Conserva espacios y saltos de línea
                    }
                });
                return; // Detener la eliminación
            } else { 
                const empresaEliminada: Empresa = { ...empresa, eliminado: true };
    
                const response = await EmpresaUpdate(empresaEliminada, token);
    
                if (response.status === 200) {
                    toast.success("Empresa eliminada correctamente", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                    onClose(); // Cierra el modal
                } else {
                    toast.error("Error al eliminar la empresa", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            }
        } catch (error) {
            console.error("Error al eliminar la empresa:", error);
            toast.error("Error al eliminar la empresa", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };
    


    const handleSuccess = () => {
        toast.success("Se actualizó correctamente la empresa", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            toastId: 'success-toast' // Asegura que el toast tenga un ID único
        });
    }

    const handleError = () => {
        toast.error("Error al actualizar la empresa, intentelo de nuevo", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    return (
        <>
            <Card key={empresa.id} style={{ width: '280px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                <CardHeader
                    title={empresa.nombre}
                    subheader={empresa.razonSocial}
                    titleTypographyProps={{ variant: 'h5', color: 'black' }}
                    subheaderTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                />
                <CardActions style={{ justifyContent: 'space-between' }}>
                    <Tooltip title="Editar">
                        <IconButton onClick={handleOpen} color="primary">
                            <EditIcon sx={{ color: "#334e77" }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">

                    <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Sucursales">
                        <Button
                            variant="contained"
                            sx={{
                                height: '30px',
                                width: '170px',
                                backgroundColor: '#af2919',
                                '&:hover': {
                                    backgroundColor: '#af2800',
                                },
                            }}
                            onClick={redirectSucursal}
                        >
                            <VisibilityIcon /> Ver Sucursales
                        </Button>
                    </Tooltip>
                </CardActions>
            </Card>

            <EmpresaModal open={editOpen} onClose={handleClose} empresa={empresa} success={handleSuccess} error={handleError} />
        </>
    )
}

export default EmpresaCard;