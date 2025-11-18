"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import AddTaskLogo from "@/components/logo/AddTaskLogo";
import Search from "@/components/logo/Search";
import Filter from "@/components/logo/Filter";
import Plus from "@/components/logo/Plus";
import AuthInput from "@/components/layout/AuthInput";
import Delete from "@/components/logo/Delete";
import Edit from "@/components/logo/Edit";
import { ProtectedRoute } from "@/components/protectedRoutes";
import { useTodos } from "@/hooks/useTodos";
import { Todo } from "@/types";
import TaskMenu from "@/components/logo/TaskMenu";

export default function DashboardPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"extreme" | "moderate" | "low">("moderate");
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const [filterOptions, setFilterOptions] = useState({
    today: false,
    next5Days: false,
    next10Days: false,
    next30Days: false,
  });

  const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();

  // NEW: Local state to maintain drag order (this fixes the snap-back issue)
  const [draggableTodos, setDraggableTodos] = useState<Todo[]>([]);

  // Sync draggableTodos whenever filtered todos change
  useEffect(() => {
    const filtered = todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todoDate = todo.todo_date ? new Date(todo.todo_date) : null;

      if (!todoDate) return true;

      if (filterOptions.today) {
        const isToday = todoDate.toDateString() === today.toDateString();
        if (!isToday) return false;
      }
      if (filterOptions.next5Days) {
        const fiveDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
        if (todoDate > fiveDaysFromNow) return false;
      }
      if (filterOptions.next10Days) {
        const tenDaysFromNow = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
        if (todoDate > tenDaysFromNow) return false;
      }
      if (filterOptions.next30Days) {
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (todoDate > thirtyDaysFromNow) return false;
      }

      return true;
    });

    setDraggableTodos(filtered);
  }, [todos, searchQuery, filterOptions]);

  // ------------------------
  // ADD TASK FUNCTION
  // ------------------------
  const addTask = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      await createTodo({
        title,
        description,
        priority,
        todo_date: date || new Date().toISOString().split("T")[0],
      });
      resetForm();
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  // ------------------------
  // UPDATE TASK FUNCTION
  // ------------------------
  const updateTask = async () => {
    if (!currentTodo) return;

    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      await updateTodo(currentTodo.id, {
        title,
        description,
        priority,
        todo_date: date || new Date().toISOString().split("T")[0],
      });

      resetForm();
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  // ------------------------
  // DELETE TASK FUNCTION
  // ------------------------
  const onDelete = async (id: number) => {
    toast.promise(
      deleteTodo(id),
      {
        loading: "Deleting task...",
        success: "Task deleted successfully!",
        error: "Failed to delete task. Please try again.",
      }
    );
  };

  // ------------------------
  // EDIT TASK FUNCTION
  // ------------------------
  const onEdit = (todo: Todo) => {
    setCurrentTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority);
    setDate(todo.todo_date || "");
    setShowModal(true);
  };

  // ------------------------
  // RESET FORM
  // ------------------------
  const resetForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setPriority("moderate");
    setCurrentTodo(null);
    setShowModal(false);
  };

  // ------------------------
  // FILTER HANDLER
  // ------------------------
  const handleFilterChange = (option: keyof typeof filterOptions) => {
    setFilterOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  // ------------------------
  // Format priority
  // ------------------------
  const formatPriority = (priority: string) => {
    switch (priority) {
      case "extreme": return "Extreme";
      case "moderate": return "Moderate";
      case "low": return "Low";
      default: return priority;
    }
  };

  // ------------------------
  // DRAG & DROP HANDLER (NOW WORKS!)
  // ------------------------
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(draggableTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDraggableTodos(items); // This persists the new order!

    // Optional: Send new order to backend later
    // console.log("New order:", items.map(t => t.id));
  };

  return (
    <ProtectedRoute>
      <main className="flex-1 p-5">
            <div className="mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-[#0D224A] pb-0 mb-6 w-max">
                  <span className="border-b-2 border-[#5272FF] inline-block w-[60%]">Todos</span>
                </h2>

                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-[#5272FF] text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <Plus />
                  New Task
                </button>
              </div>

              {/* Search + Filter */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search your task here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 h-10 pr-16 bg-white border text-[#4B5563] font-semibold text-xs border-[#D1D5DB] rounded-lg"
                  />
                  <Search className="absolute right-0 top-0 h-10 w-10 rounded-lg p-3 text-white bg-[#5272FF]" />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFilter((prev) => !prev)}
                    className="flex items-center gap-2 h-10 px-4 py-3 font-regular bg-white border border-[#D1D5DB] rounded-lg"
                  >
                    <Filter />
                    Filter
                  </button>

                  {showFilter && (
                    <div className="absolute right-0 w-[164px] bg-[#FCFCFC] shadow-[#00000029] rounded-xs shadow-lg p-3 z-10">
                      <p className="text-xs text-[#4B5563] border-b pb-2 border-[#00000040]">Date</p>
                      <div className="space-y-2 mt-2">
                        {(["today", "next5Days", "next10Days", "next30Days"] as const).map((key) => (
                          <label key={key} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={filterOptions[key]}
                              onChange={() => handleFilterChange(key)}
                            />{" "}
                            {key === "today" && "Deadline Today"}
                            {key === "next5Days" && "Expires in 5 days"}
                            {key === "next10Days" && "Expires in 10 days"}
                            {key === "next30Days" && "Expires in 30 days"}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="bg-white rounded-2xl border border-[#D1D5DB] p-16 text-center">
                  <p className="text-2xl font-regular text-[#201F1E]">Loading todos...</p>
                </div>
              )}

              {/* NO TASKS */}
              {!loading && draggableTodos.length === 0 && (
                <div className="bg-white rounded-2xl border border-[#D1D5DB] p-16 text-center">
                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    className="flex w-full items-center justify-center transition"
                  >
                    <AddTaskLogo />
                  </button>
                  <p className="mt-2 text-2xl font-regular text-[#201F1E]">
                    {searchQuery || Object.values(filterOptions).some(Boolean)
                      ? "No todos found"
                      : "No todos yet"}
                  </p>
                </div>
              )}

              {/* TASKS GRID WITH DRAG & DROP */}
              {!loading && draggableTodos.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-[#0D224A] mb-6">Your Tasks</h3>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="todos" direction="horizontal">
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {draggableTodos.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative ${snapshot.isDragging ? "opacity-80 scale-105" : ""}`}
                                >
                                  <div
                                    className={`flex flex-col bg-white justify-between h-full min-h-[220px] rounded-lg p-6 border shadow-sm transition-all ${
                                      todo.priority === "extreme"
                                        ? "border-[#DC2626]"
                                        : todo.priority === "moderate"
                                          ? "border-[#16A34A]"
                                          : todo.priority === "low"
                                            ? "border-[#CA8A04]"
                                            : "border-[#D1D5DB]"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <h3
                                        className={`font-medium text-[#0D224A] mb-2 text-lg ${
                                          todo.is_completed ? "line-through text-gray-400" : ""
                                        }`}
                                      >
                                        {todo.title}
                                      </h3>

                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`text-xs px-3 py-1 rounded font-medium ${
                                            todo.priority === "extreme"
                                              ? "bg-[#FEE2E2] text-[#DC2626]"
                                              : todo.priority === "moderate"
                                                ? "bg-[#DCFCE7] text-[#16A34A]"
                                                : "bg-[#FEF9C3] text-[#CA8A04]"
                                          }`}
                                        >
                                          {formatPriority(todo.priority)}
                                        </span>

                                        {/* Drag Handle */}
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab active:cursor-grabbing p-1"
                                        >
                                          <TaskMenu />
                                        </div>
                                      </div>
                                    </div>

                                    {todo.description && (
                                      <p className="text-sm text-[#4B5563] my-4 line-clamp-3">
                                        {todo.description}
                                      </p>
                                    )}

                                    <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
                                      {todo.todo_date && (
                                        <p className="text-sm font-regular text-[#4B5563]">
                                          Due{" "}
                                          {new Date(todo.todo_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </p>
                                      )}

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => onEdit(todo)}
                                          className="p-2.5 bg-[#EEF7FF] rounded-lg hover:bg-blue-100 transition"
                                          title="Edit"
                                        >
                                          <Edit />
                                        </button>

                                        <button
                                          onClick={() => onDelete(todo.id)}
                                          className="p-2.5 bg-[#FEF2F2] text-[#DC2626] rounded-lg hover:bg-red-100 transition"
                                          title="Delete"
                                        >
                                          <Delete />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </div>
          </main>

        {/* MODAL - unchanged */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={resetForm}
          >
            <div
              className="bg-white w-[640px] rounded-xl p-8 shadow-xl max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#0D224A]">
                  {currentTodo ? "Edit Task" : "Add New Task"}
                  <span className="block bg-[#5272FF] h-0.5 w-24 mt-1"></span>
                </h2>
                <button className="text-sm font-medium underline" onClick={resetForm}>
                  Go Back
                </button>
              </div>

              <div className="space-y-5">
                <AuthInput
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  inputClass="border border-[#A1A3AB] rounded-md h-[37px] px-3"
                  labelClass="block text-sm font-semibold text-[#0C0C0C]"
                />

                <div>
                  <label className="block text-sm font-semibold text-[#0C0C0C] mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-[#A1A3AB] rounded-md h-[37px] px-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0C0C0C] mb-2">Priority</label>
                  <div className="flex gap-6">
                    {([
                      { value: "extreme", label: "Extreme", color: "#EE0039" },
                      { value: "moderate", label: "Moderate", color: "#11C25D" },
                      { value: "low", label: "Low", color: "#EAB308" },
                    ] as const).map((p) => (
                      <label key={p.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <span style={{ color: p.color }}>●</span>
                        {p.label}
                        <input
                          type="radio"
                          name="priority"
                          checked={priority === p.value}
                          onChange={() => setPriority(p.value)}
                          className="ml-2 h-[15px] w-[15px]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0C0C0C] mb-1">
                    Task Description
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Start writing here..."
                    className="w-full border border-[#A1A3AB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={currentTodo ? updateTask : addTask}
                    className="bg-[#5272FF] text-white px-8 py-2.5 rounded-lg font-medium"
                  >
                    {currentTodo ? "Update" : "Done"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-[#EE0039] text-white p-3 rounded-lg"
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </ProtectedRoute>
  );
}