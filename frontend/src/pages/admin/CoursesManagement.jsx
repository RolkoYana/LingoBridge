import SidebarAdmin from "../../components/admin/SidebarAdmin";

const CoursesManagement = () => {
  return (
    <div style={{ display: "flex" }}>
      <SidebarAdmin />
      <main style={{ padding: "20px", flexGrow: 1 }}>
        <h2>Gestión de Cursos</h2>
        {/* Aquí pondrás la tabla o tarjetas con los cursos */}
      </main>
    </div>
  );
};

export default CoursesManagement;
