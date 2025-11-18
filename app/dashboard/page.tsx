"use client";

import { useState } from "react";
import toast from "react-hot-toast";

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

export default function DashboardPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"extreme" | "moderate" | "low">("moderate");

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
        todo_date: date || new Date().toISOString().split('T')[0],
      });
      
      // Reset
      setTitle("");
      setDate("");
      setDescription("");
      setPriority("moderate");
      setShowModal(false);
      toast.success("Task created successfully!");
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  // Filter todos based on search
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format priority for display
  const formatPriority = (priority: string) => {
    if (priority === 'extreme') return 'Extreme';
    if (priority === 'moderate') return 'Moderate';
    if (priority === 'low') return 'Low';
    return priority;
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
                <span className="border-b-2 border-[#5272FF] inline-block w-[60%]">
                  Todos
                </span>
              </h2>

              <button
                onClick={() => setShowModal(true)}
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
                    <p className="text-xs text-[#4B5563] border-b pb-2 border-[#00000040]">
                      Date
                    </p>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Deadline Today
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Expires in 5 days
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Expires in 10 days
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Expires in 30 days
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* If LOADING */}
            {loading && (
              <div className="bg-white rounded-2xl border border-[#D1D5DB] p-16 text-center">
                <p className="text-2xl font-regular text-[#201F1E]">Loading todos...</p>
              </div>
            )}

            {/* If NO TASKS */}
            {!loading && filteredTodos.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#D1D5DB] p-16 text-center">
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex w-full items-center justify-center transition"
                >
                  <AddTaskLogo />
                </button>
                <p className="mt-2 text-2xl font-regular text-[#201F1E]">
                  {searchQuery ? "No todos found" : "No todos yet"}
                </p>
              </div>
            )}

            {/* Your Tasks Section */}
            {!loading && filteredTodos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-[#0D224A] mb-6">Your Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="bg-white rounded-xl shadow-sm border border-[#D1D5DB] p-5 hover:shadow-md transition-shadow"
                    >
                      {/* Title */}
                      <h3 className={`text-lg font-bold text-[#0D224A] mb-2 ${todo.is_completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.title}
                      </h3>

                      {/* Description */}
                      {todo.description && (
                        <p className="text-sm text-[#4B5563] mb-4 line-clamp-2">
                          {todo.description}
                        </p>
                      )}

                      {/* Priority Badge */}
                      <div className="mb-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            todo.priority === "extreme"
                              ? "bg-[#EE0039]/20 text-[#EE0039]"
                              : todo.priority === "moderate"
                              ? "bg-[#11C25D]/20 text-[#11C25D]"
                              : todo.priority === "low"
                              ? "bg-[#EAB308]/20 text-[#EAB308]"
                              : ""
                          }`}
                        >
                          {formatPriority(todo.priority)}
                        </span>
                      </div>

                      {/* Due Date */}
                      {todo.todo_date && (
                        <p className="text-xs text-[#4B5563] mb-4">
                          Due {new Date(todo.todo_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#D1D5DB]">
                        <button
                          onClick={() => {
                            // TODO: Implement edit functionality
                            toast.info("Edit functionality coming soon");
                          }}
                          className="text-[#5272FF] hover:text-[#3B5FE8] p-1"
                          title="Edit"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this task?")) {
                              try {
                                await deleteTodo(todo.id);
                                toast.success("Task deleted successfully!");
                              } catch (error) {
                                toast.error("Failed to delete task");
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Delete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-[640px] rounded-xl p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold">
                Add New Task
                <span className="block bg-[#5272FF] h-[2px] w-[60%] mt-0.5"></span>
              </h2>

              <button
                className="text-sm font-semibold text-[#000000] underline"
                onClick={() => setShowModal(false)}
              >
                Go Back
              </button>
            </div>

            {/* Title */}
            <div className="mb-4">
              <AuthInput
                label="Title"
                value={title}
                onChange={setTitle}
                inputClass="border border-[#A1A3AB] rounded-md h-[37px]"
                labelClass="text-sm font-semibold text-[#0C0C0C]"
              />
            </div>

            {/* Date */}
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

            {/* Priority */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#0C0C0C]">
                Priority
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 text-[13px] font-regular">
                  <span className="text-[#EE0039]">●</span>
                  <span className="text-[#4B5563]">Extreme</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "extreme"}
                    onChange={() => setPriority("extreme")}
                  />
                </label>

                <label className="flex items-center gap-2 text-[13px] font-regular">
                  <span className="text-[#11C25D]">●</span>
                  <span className="text-[#4B5563]">Moderate</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "moderate"}
                    onChange={() => setPriority("moderate")}
                  />
                </label>

                <label className="flex items-center gap-2 text-[13px] font-regular">
                  <span className="text-[#EAB308]">●</span>
                  <span className="text-[#4B5563]">Low</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "low"}
                    onChange={() => setPriority("low")}
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mb-9">
              <label className="text-sm font-semibold text-[#0C0C0C]">
                Task Description
              </label>
              <textarea
                rows={5}
                className="w-full border border-[#A1A3AB] rounded-md px-3 py-2 mt-1 text-[13px] focus:outline-none"
                placeholder="Start writing here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={addTask}
                className="bg-[#5272FF] text-white px-6 py-2 rounded-lg text-sm font-semibold w-[90px]"
              >
                Done
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white p-2.5 rounded-lg text-sm"
              >
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
