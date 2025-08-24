import React, { useState } from "react";

// ToDoリストアプリのメインコンポーネント
function App() {
  // タスク一覧の状態
  const [tasks, setTasks] = useState([]);
  // 入力欄の状態
  const [input, setInput] = useState("");

  // タスク追加
  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  // タスク削除
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // 完了状態の切り替え
  const toggleDone = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>ToDoリスト</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="タスクを入力..."
          style={{ flex: 1 }}
        />
        <button onClick={addTask}>追加</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {tasks.map((task, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <span
              onClick={() => toggleDone(i)}
              style={{ textDecoration: task.done ? "line-through" : "none", cursor: "pointer", flex: 1 }}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(i)} style={{ marginLeft: 8 }}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
