import React, { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState("")

  const API_BASE = "http://localhost:5068"

  // ----- AUTH -----
  const signup = async () => {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    alert(await res.text());
  };

  const login = async () => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setIsLoggedIn(true);
      loadTodos();
    } else {
      alert("Invalid login");
    }
  };

  // ----- TODOS -----
  const loadTodos = async () => {
    const res = await fetch(`${API_BASE}/todo`, {
      headers: {
        "X-User": username,
        "X-Pass": password,
      },
    });
    if (res.ok) {
      setTodos(await res.json());
    }
  };

  const addTodo = async () => {
    if (!newTask.trim()) return;
    const res = await fetch(`${API_BASE}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User": username,
        "X-Pass": password,
      },
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      const todo = await res.json();
      setTodos([...todos, todo]);
      setNewTask("");
    }
  };

  const toggleTodo = async (id) => {
    await fetch(`${API_BASE}/${id}/toggle`, {
      method: "POST",
      headers: { "X-User": username, "X-Pass": password },
    });
    loadTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { "X-User": username, "X-Pass": password },
    });
    loadTodos();
  };

  // ----- UI -----
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-80">
          <h1 className="text-xl font-bold mb-4 text-center">Todo App</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
          />
          <div className="flex justify-between">
            <button
              onClick={signup}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Signup
            </button>
            <button
              onClick={login}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">My Todo List</h1>

        {/* Add Task */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="New task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 border p-2 rounded-l"
          />
          <button
            onClick={addTodo}
            className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.itemId}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span
                className={`flex-1 cursor-pointer ${
                  t.isDone ? "line-through text-red-500" : ""
                }`}
                onClick={() => toggleTodo(t.itemId)}
              >
                {t.task}
              </span>
              <button
                onClick={() => deleteTodo(t.itemId)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          onClick={() => setIsLoggedIn(false)}
          className="mt-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
