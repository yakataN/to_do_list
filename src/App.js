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
    <div style={{
      maxWidth: 480,
      margin: "48px auto",
      padding: 32,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', 'Hiragino Sans', 'Meiryo', sans-serif"
    }}>
      <h2 style={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 24,
        color: "#1976d2"
      }}>ToDoリスト</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="タスクを入力..."
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid #bdbdbd",
            borderRadius: 8,
            fontSize: 16,
            outline: "none",
            transition: "border-color 0.2s"
          }}
        />
        <button
          onClick={addTask}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
            transition: "background 0.2s"
          }}
        >追加</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tasks.length === 0 ? (
          <li style={{ textAlign: "center", color: "#bdbdbd", fontSize: 16, marginTop: 32 }}>
            タスクはありません
          </li>
        ) : (
          tasks.map((task, i) => (
            <li key={i} style={{
              display: "flex",
              alignItems: "center",
              background: task.done ? "#e3f2fd" : "#f5f5f5",
              borderRadius: 8,
              marginBottom: 12,
              padding: "10px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
            }}>
              <span
                onClick={() => toggleDone(i)}
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? "#1976d2" : "#333",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: 17,
                  transition: "color 0.2s"
                }}
                title={task.done ? "未完了に戻す" : "完了にする"}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(i)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: 10,
                  boxShadow: "0 1px 4px rgba(229,57,53,0.08)",
                  transition: "background 0.2s"
                }}
              >削除</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
