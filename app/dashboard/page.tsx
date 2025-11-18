"use client";

import { useState } from "react";
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
      (async () => {
        await deleteTodo(id);
      })(),
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
  const handleFilterChange = (option: string) => {
    setFilterOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  // ------------------------
  // Filter todos based on search and date
  // ------------------------
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const today = new Date();
    const todoDate = new Date(todo.todo_date || "");

    if (filterOptions.today && todoDate.toDateString() !== today.toDateString()) return false;
    if (filterOptions.next5Days && todoDate > new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)) return false;
    if (filterOptions.next10Days && todoDate > new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)) return false;
    if (filterOptions.next30Days && todoDate > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) return false;

    return true;
  });

  // ------------------------
  // Format priority
  // ------------------------
  const formatPriority = (priority: string) => {
    if (priority === "extreme") return "Extreme";
    if (priority === "moderate") return "Moderate";
    if (priority === "low") return "Low";
    return priority;
  };

  // ------------------------
  // DRAG & DROP HANDLER
  // ------------------------
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(filteredTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log("New Order:", items.map((t) => t.id));
    // Optional: update backend order here
  };

  // ------------------------
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#EEF7FF] flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Navbar />

          <main className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
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
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filterOptions.today}
                            onChange={() => handleFilterChange("today")}
                          />{" "}
                          Deadline Today
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filterOptions.next5Days}
                            onChange={() => handleFilterChange("next5Days")}
                          />{" "}
                          Expires in 5 days
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filterOptions.next10Days}
                            onChange={() => handleFilterChange("next10Days")}
                          />{" "}
                          Expires in 10 days
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filterOptions.next30Days}
                            onChange={() => handleFilterChange("next30Days")}
                          />{" "}
                          Expires in 30 days
                        </label>
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
              {!loading && filteredTodos.length === 0 && (
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
                    {searchQuery ? "No todos found" : "No todos yet"}
                  </p>
                </div>
              )}

              {/* TASKS GRID WITH DRAG & DROP */}
              {!loading && filteredTodos.length > 0 && (
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
                          {filteredTodos.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <div
                                    className={`flex flex-col bg-white justify-between h-full min-h-[220px] rounded-lg p-6 border ${
                                      todo.priority === "extreme"
                                        ? "border-[#DC2626]"
                                        : todo.priority === "moderate"
                                        ? "border-[#16A34A]"
                                        : todo.priority === "low"
                                        ? "border-[#CA8A04]"
                                        : "border-[#D1D5DB]"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center gap-2">
                                      <h3
                                        className={`font-medium text-[#0D224A] mb-2 ${
                                          todo.is_completed ? "line-through text-gray-400" : ""
                                        }`}
                                      >
                                        {todo.title}
                                      </h3>

                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`text-xs px-3 py-1 rounded font-regular ${
                                            todo.priority === "extreme"
                                              ? "bg-[#FEE2E2] text-[#DC2626]"
                                              : todo.priority === "moderate"
                                              ? "bg-[#DCFCE7] text-[#16A34A]"
                                              : todo.priority === "low"
                                              ? "bg-[#FEF9C3] text-[#CA8A04]"
                                              : "bg-gray-100 text-gray-500"
                                          }`}
                                        >
                                          {formatPriority(todo.priority)}
                                        </span>

                                        <TaskMenu />
                                      </div>
                                    </div>

                                    {todo.description && (
                                      <p className="text-sm text-[#4B5563] my-4 line-clamp-2">
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
                                          className="text-[#00000000] rounded-xs p-2.5 bg-[#EEF7FF] h-8 w-8"
                                          title="Edit"
                                        >
                                          <Edit />
                                        </button>

                                        <button
                                          onClick={() => onDelete(todo.id)}
                                          className="text-[#DC2626] p-2.5 rounded-xs bg-[#EEF7FF] h-8 w-8"
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
        </div>

        {/* MODAL */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={resetForm}
          >
            <div className="bg-white w-[640px] rounded-xl p-8 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold">
                  {currentTodo ? "Edit Task" : "Add New Task"}
                  <span className="block bg-[#5272FF] h-[2px] w-[60%] mt-0.5"></span>
                </h2>
                <button className="text-sm font-semibold text-[#000000] underline" onClick={resetForm}>
                  Go Back
                </button>
              </div>

              <div className="mb-4">
                <AuthInput
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  inputClass="border border-[#A1A3AB] rounded-md h-[37px]"
                  labelClass="text-sm font-semibold text-[#0C0C0C]"
                />
              </div>

              <div className="mb-4">
                <AuthInput
                  label="Date"
                  type="date"
                  value={date}
                  onChange={setDate}
                  inputClass="border border-[#A1A3AB] rounded-md h-[37px]"
                  labelClass="text-sm font-semibold text-[#0C0C0C]"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold text-[#0C0C0C]">Priority</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-[13px] font-regular">
                    <span className="text-[#EE0039]">●</span>Extreme
                    <input type="radio" name="priority" checked={priority === "extreme"} onChange={() => setPriority("extreme")} />
                  </label>
                  <label className="flex items-center gap-2 text-[13px] font-regular">
                    <span className="text-[#11C25D]">●</span>Moderate
                    <input type="radio" name="priority" checked={priority === "moderate"} onChange={() => setPriority("moderate")} />
                  </label>
                  <label className="flex items-center gap-2 text-[13px] font-regular">
                    <span className="text-[#EAB308]">●</span>Low
                    <input type="radio" name="priority" checked={priority === "low"} onChange={() => setPriority("low")} />
                  </label>
                </div>
              </div>

              <div className="mb-9">
                <label className="text-sm font-semibold text-[#0C0C0C]">Task Description</label>
                <textarea
                  rows={5}
                  className="w-full border border-[#A1A3AB] rounded-md px-3 py-2 mt-1 text-[13px] focus:outline-none"
                  placeholder="Start writing here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={currentTodo ? updateTask : addTask}
                  className="bg-[#5272FF] text-white px-6 py-2 rounded-lg text-sm font-semibold w-[90px]"
                >
                  Done
                </button>

                <button onClick={resetForm} className="bg-red-500 text-white p-2.5 rounded-lg text-sm">
                  <Delete />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
