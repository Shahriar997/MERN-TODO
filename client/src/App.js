import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err));
  }

  const complete = async id => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    };
    const data = await fetch(API_BASE + "/todo/"+id, requestOptions)
      .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id) {
        todo.complete = data.complete;
      }

      return todo;
    }));
  }

  const deleteTodo = async id => {
    const requestOptions = {
      method: 'DELETE'
    };

    const data = await fetch(API_BASE + "/todo/"+id, requestOptions)
      .then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  }

  const addTodo = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    };

    const data = await fetch(API_BASE + "/todo", requestOptions)
      .then(res => res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  }

  return (
    <div className="App">
      <h1>Welcome, Shahriar</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map(todo => (
            <div 
              className={"todo " + (todo.complete ? "is-complete" : "")} 
              key={todo._id}
            >
              <div className="checkbox" onClick={() => complete(todo._id)}></div>
              <div className="text">{ todo.text }</div>
              <div className="delete-todo" onClick={() => {deleteTodo(todo._id)}}>x</div>
            </div>
          ))}
      </div>

      <div className="addPopup" onClick={() => {setPopupActive(true)}}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => {setPopupActive(false)}}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input 
              type="text"
              className="add-todo-input"
              onChange={e => setNewTodo(e.target.value)}
              value={newTodo} />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default App;
