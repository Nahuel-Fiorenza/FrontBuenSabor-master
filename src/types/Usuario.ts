import { Rol } from "./enums/Rol";

export default interface Usuario{
    id: number | null,
    eliminado: boolean
    email: string,
    rol: Rol | null
    auth0Id: string
}