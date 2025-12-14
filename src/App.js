import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import dayjs from "dayjs";
import Column from "./components/Column";
import TaskModal from "./components/TaskModal";
import initialTasks from "./data/initialTasks.json";

const STATUSES = ["To-Do", "In-Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", dueDate: "", status: "To-Do" });
  const [filter, setFilter] = useState({ priority: "", status: "", sort: "newest" });

  useEffect(() => localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [moved] = newTasks.splice(result.source.index, 1);
    moved.status = result.destination.droppableId;
    newTasks.splice(result.destination.index, 0, moved);
    setTasks(newTasks);
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const openAdd = () => {
    setForm({ title: "", description: "", priority: "Medium", dueDate: "", status: "To-Do" });
    setEditId(null);
    setModal(true);
  };

  const openEdit = (t) => {
    setForm(t);
    setEditId(t.id);
    setModal(true);
  };

  const saveTask = () => {
    if (!form.title) return;
    let title = form.title;
    const same = tasks.filter(t => t.status === form.status && t.title.replace(/\s\(\d+\)$/, "") === form.title);
    if (same.length) title += ` (${same.length})`;
    const now = dayjs().toISOString();
    if (editId) {
      setTasks(tasks.map(t => t.id === editId ? { ...t, ...form, title } : t));
    } else {
      setTasks([...tasks, { ...form, id: now, title, createdAt: now }]);
    }
    setModal(false);
  };

  const delTask = () => {
    setTasks(tasks.filter(t => t.id !== editId));
    setModal(false);
  };

  const filtered = () => {
    let t = tasks;
    if (filter.priority) t = t.filter(x => x.priority === filter.priority);
    if (filter.status) t = t.filter(x => x.status === filter.status);
    if (filter.sort === "newest") t.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    if (filter.sort === "oldest") t.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());
    if (filter.sort === "due") t.sort((a, b) => (a.dueDate && b.dueDate ? dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf() : 0));
    return t;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">Task Manager</span>
        <button onClick={openAdd} className="bg-blue-600 text-white px-3 py-1 rounded">+ Add Task</button>
      </nav>

      <div className="filters">
        <select value={filter.priority} onChange={e => setFilter({...filter, priority: e.target.value})}>
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filter.sort} onChange={e => setFilter({...filter, sort: e.target.value})}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="due">Closest Due</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {STATUSES.map(s => (
            <Column
              key={s}
              s={s}
              tasks={filtered().filter(t => t.status === s)}
              openEdit={openEdit}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </DragDropContext>

      {modal && <TaskModal form={form} setForm={setForm} saveTask={saveTask} delTask={delTask} closeModal={() => setModal(false)} editId={editId} />}
    </div>
  );
}