import React from "react";
import dayjs from "dayjs";

const PRIORITIES = ["Low", "Medium", "High"];

export default function TaskModal({ form, setForm, saveTask, delTask, closeModal, editId }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h4>{editId ? "Edit Task" : "New Task"}</h4>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded mb-2 resize-y min-h-[80px]"
        />
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full border px-3 py-2 rounded mb-2"
        >
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <input
          type="date"
          value={form.dueDate ? dayjs(form.dueDate).format("YYYY-MM-DD") : ""}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <div className="modal-actions">
          <button onClick={saveTask} className="btn-primary">Save</button>
          <button onClick={closeModal} className="btn-secondary">Cancel</button>
          {editId && <button onClick={delTask} className="btn-danger">Delete</button>}
        </div>
      </div>
    </div>
  );
}