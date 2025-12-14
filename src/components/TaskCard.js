import React from "react";
import { Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";

const STATUSES = ["To-Do", "In-Progress", "Completed"];

export default function TaskCard({ t, index, openEdit, onStatusChange }) {
  const next = () => {
    const i = STATUSES.indexOf(t.status);
    onStatusChange(t.id, STATUSES[(i + 1) % STATUSES.length]);
  };

  return (
    <Draggable draggableId={t.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card ${t.priority.toLowerCase()}`}
          onClick={() => openEdit(t)}
        >
          <div className="card-title">{t.title}</div>
          <div className="card-desc">{t.description}</div>
          <div className="card-meta">Due: {t.dueDate ? dayjs(t.dueDate).format("DD/MM/YY") : "-"}</div>
          <div className="card-meta">Created: {dayjs(t.createdAt).format("DD/MM HH:mm")}</div>

          <div className="mt-2 flex justify-between items-center">
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
            >
              {t.status}
            </button>
            <span className="text-xs text-gray-500">Edit</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}