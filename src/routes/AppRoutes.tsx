import { Route, Routes } from "react-router-dom";
import Ingreso from "../screens/Ingreso";
import PreLayout from "../components/layout/PreLayout";
import ProtectedRoute from "../components/auth0/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../screens/Dashboard";
import Empresa from "../screens/EmpresaList";
import Sucursal from "../screens/SucursalList";
import EmpleadosList from "../screens/EmpleadosList";
import ArticuloManufacturadoList from "../screens/ArticuloManufacturadoList";
import CategoriaList from "../screens/CategoriaList";
import PromocionList from "../screens/PromocionList";
import ArticuloInsumoList from "../screens/ArticuloInsumoList";
import UnidadMedidaList from "../screens/UnidadMedidaList";
import PedidosList from "../screens/PedidosList";
import Unauthorized from "../screens/unauthorized";


export const AppRoutes: React.FC = () => {

    return (
        <Routes>
            <Route path="/" element={<Ingreso />}></Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<PreLayout />}>
                <Route element={<ProtectedRoute roles={['SUPERADMIN']} />}>
                    <Route path="/empresas" element={<Empresa />} />
                </Route>
                <Route element={<ProtectedRoute roles={['ADMIN', 'SUPERADMIN']} />}>
                        <Route path="/sucursales" element={<Sucursal />} />
                    </Route>
            </Route>
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute roles={['SUPERADMIN', 'ADMIN']} />}>
                    <Route path="/estadisticas" element={<Dashboard />} />
                </Route>
                <Route element={<ProtectedRoute roles={['SUPERADMIN']} />}>
                    <Route path="/empleados" element={<EmpleadosList />} />
                </Route>
                <Route element={<ProtectedRoute roles={['SUPERADMIN', 'ADMIN', 'COCINERO', 'CAJERO']} />}>
                    <Route path="/manufacturados" element={<ArticuloManufacturadoList />} />
                    <Route path="/categorias" element={<CategoriaList />} />
                    <Route path="/promociones" element={<PromocionList />} />
                    <Route path="/insumos" element={<ArticuloInsumoList />} />
                </Route >
                <Route element={<ProtectedRoute roles={['SUPERADMIN', 'ADMIN', 'COCINERO']} />}>
                    <Route path="/unidad-medida" element={<UnidadMedidaList />} />
                </Route >

                <Route element={<ProtectedRoute roles={['ADMIN', 'SUPERADMIN', 'COCINERO', 'DELIVERY', 'CAJERO']} />}>
                    <Route path="/pedidos" element={<PedidosList />} />
                </Route>
            </Route>
        </Routes>
    );
}