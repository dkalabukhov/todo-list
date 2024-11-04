import TodoList from "./components/TodoList";

export default function App() {
  return (
    <div className="page">
      <main className="main">
        <div className="main__container">
          <TodoList />
        </div>
      </main>
    </div>
  )
}