import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <nav
      style={{
        width: "200px",
        background: "#f0f0f0",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h3>Admin</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/admin/courses">Cursos</Link>{" "}
        </li>
        <li>
          <Link to="/admin/teachers">Profesores</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarAdmin;
