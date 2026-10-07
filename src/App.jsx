import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";

const formVacio = { nombre: "", deporte: "", pais: "", edad: "", retirado: false };

const obtenerDeportistas = () =>
  supabase.from("deportistas").select("*").order("id", { ascending: true });

function App() {
  const [deportistas, setDeportistas] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  const consulta = async () => {
    const { data, error } = await obtenerDeportistas();
    if (error) {
      setError("Error en la consulta: " + error.message);
    } else {
      setDeportistas(data);
    }
  };

  useEffect(() => {
    obtenerDeportistas().then(({ data, error }) => {
      if (error) {
        setError("Error en la consulta: " + error.message);
      } else {
        setDeportistas(data);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.deporte.trim()) {
      setError("Nombre y deporte son obligatorios");
      return;
    }

    const datos = {
      nombre: form.nombre.trim(),
      deporte: form.deporte.trim(),
      pais: form.pais.trim() || null,
      edad: form.edad === "" ? null : Number(form.edad),
      retirado: form.retirado,
    };

    const { error } = editandoId
      ? await supabase.from("deportistas").update(datos).eq("id", editandoId)
      : await supabase.from("deportistas").insert([datos]);

    if (error) {
      setError("Error al guardar: " + error.message);
    } else {
      setError("");
      cancelar();
      consulta();
    }
  };

  const editar = (deportista) => {
    setEditandoId(deportista.id);
    setForm({
      nombre: deportista.nombre,
      deporte: deportista.deporte,
      pais: deportista.pais ?? "",
      edad: deportista.edad ?? "",
      retirado: deportista.retirado,
    });
  };

  const cancelar = () => {
    setEditandoId(null);
    setForm(formVacio);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este deportista?")) return;
    const { error } = await supabase.from("deportistas").delete().eq("id", id);
    if (error) {
      setError("Error al eliminar: " + error.message);
    } else {
      setDeportistas((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="contenedor">
      <h1>Deportistas Famosos</h1>

      <form onSubmit={guardar} className="formulario">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="deporte" placeholder="Deporte" value={form.deporte} onChange={handleChange} />
        <input name="pais" placeholder="País" value={form.pais} onChange={handleChange} />
        <input name="edad" type="number" min="0" placeholder="Edad" value={form.edad} onChange={handleChange} />
        <label>
          <input name="retirado" type="checkbox" checked={form.retirado} onChange={handleChange} />
          Retirado
        </label>
        <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
        {editandoId && (
          <button type="button" onClick={cancelar}>Cancelar</button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Deporte</th>
            <th>País</th>
            <th>Edad</th>
            <th>Retirado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {deportistas.map((d) => (
            <tr key={d.id}>
              <td>{d.nombre}</td>
              <td>{d.deporte}</td>
              <td>{d.pais}</td>
              <td>{d.edad}</td>
              <td>{d.retirado ? "Sí" : "No"}</td>
              <td>
                <button onClick={() => editar(d)}>Editar</button>
                <button onClick={() => eliminar(d.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
