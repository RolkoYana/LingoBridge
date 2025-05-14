import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { fetchWithAuth } from "../../api/api";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchWithAuth("/admin/statistics");
        console.log("Datos recibidos:", data);
        setStats(data);
      } catch (err) {
        console.error("Error al cargar estadísticas", err);
      }
    };

    loadStats();
  }, []);

  if (!stats) return <p>Cargando estadísticas...</p>;

  const {
    languages,
    coursesPerLanguage,
    teachersPerLanguage,
    studentsPerLanguage,
  } = stats;

  const createBarData = (label, data, bgColor) => {
    const roundedData = data.map((value) => Math.round(value));
    return {
      labels: languages,
      datasets: [
        {
          label,
          data: roundedData,
          backgroundColor: bgColor,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
  };

  return (
    <div>
      <h4>Estadísticas Generales</h4>

      <div className="mb-5">
        <h6>Cursos por Idioma</h6>
        <Bar
          data={createBarData(
            "Cursos",
            coursesPerLanguage,
            "rgba(54, 162, 235, 0.6)"
          )}
          options={chartOptions}
        />
      </div>

      <div className="mb-5">
        <h6>Profesores por Idioma</h6>
        <Bar
          data={createBarData(
            "Profesores",
            teachersPerLanguage,
            "rgba(255, 206, 86, 0.6)"
          )}
          options={chartOptions}
        />
      </div>

      <div className="mb-5">
        <h6>Estudiantes por Idioma</h6>
        <Bar
          data={createBarData(
            "Estudiantes",
            studentsPerLanguage,
            "rgba(75, 192, 192, 0.6)"
          )}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default AdminStats;
