"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import AddTaskLogo from "@/components/logo/AddTaskLogo";
import Search from "@/components/logo/Search";
import Filter from "@/components/logo/Filter";
import Plus from "@/components/logo/Plus";
import AuthInput from "@/components/layout/AuthInput";
import Delete from "@/components/logo/Delete";

export default function DashboardPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const [tasks, setTasks] = useState([]);

  // ------------------------
  // ADD TASK FUNCTION
  // ------------------------
  const addTask = () => {
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      date,
      description,
      priority,
    };

    setTasks((prev) => [...prev, newTask]);

    // Reset
    setTitle("");
    setDate("");
    setDescription("");
    setPriority("");

    setShowModal(false);
  };

  // ------------------------
  return (
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

            {/* If NO TASKS */}
            {tasks.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#D1D5DB] p-16 text-center">
                <button className="flex w-full items-center justify-center transition">
                  <AddTaskLogo />
                </button>
                <p className="mt-2 text-2xl font-regular text-[#201F1E]">
                  No todos yet
                </p>
              </div>
            )}

            {/* If TASKS EXIST */}
            {tasks.length > 0 && (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-5 rounded-xl shadow border border-[#D1D5DB]"
                  >
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold text-[#0D224A]">
                        {task.title}
                      </h3>

                      <span
                        className={`text-sm px-3 py-1 rounded-lg ${
                          task.priority === "Extreme"
                            ? "bg-[#EE0039]/20 text-[#EE0039]"
                            : task.priority === "Moderate"
                            ? "bg-[#11C25D]/20 text-[#11C25D]"
                            : task.priority === "Low"
                            ? "bg-[#EAB308]/20 text-[#EAB308]"
                            : ""
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.date && (
                      <p className="text-xs text-[#4B5563] mt-1">
                        Deadline: {task.date}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-[#4B5563]">
                      {task.description}
                    </p>
                  </div>
                ))}
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
                    checked={priority === "Extreme"}
                    onChange={() => setPriority("Extreme")}
                  />
                </label>

                <label className="flex items-center gap-2 text-[13px] font-regular">
                  <span className="text-[#11C25D]">●</span>
                  <span className="text-[#4B5563]">Moderate</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "Moderate"}
                    onChange={() => setPriority("Moderate")}
                  />
                </label>

                <label className="flex items-center gap-2 text-[13px] font-regular">
                  <span className="text-[#EAB308]">●</span>
                  <span className="text-[#4B5563]">Low</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "Low"}
                    onChange={() => setPriority("Low")}
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
  );
}
