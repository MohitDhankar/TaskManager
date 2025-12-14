import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function Column({ s, tasks, openEdit }) {
  return (
    <Droppable droppableId={s}>
      {(provided, snapshot) => (
        <div className="w-80 bg-gray-100 rounded p-3" ref={provided.innerRef} {...provided.droppableProps}>
          <h3 className="font-semibold mb-2">{s}</h3>
          <div className={`min-h-[200px] ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}>
            {tasks.map((t, idx) => (
              <TaskCard key={t.id} t={t} index={idx} openEdit={openEdit} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}