import SidebarAdmin from "../../components/admin/SidebarAdmin";

const AdminDashboard = () => {
  return (
    <div style={{display: 'flex'}}>
        <SidebarAdmin/>
        <main style={{padding: '20px', flexGrow: 1}}>
            <h2>Panel de Administrador</h2>
            <p>Bienvenido al panel. Selecciona una sección para gestionar los datos.</p>
        </main>
    </div>
  )
}

export default AdminDashboard