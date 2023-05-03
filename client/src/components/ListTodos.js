import { useState, useEffect } from "react";
import EditTodo from "./EditTodo";
import InputTodo from "./InputTodo";
import { useCookies } from "react-cookie";

function ListTodos() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;

  const [tasks, setTasks] = useState([]);

  //get todos from db
  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  // delete function
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        console.log("todo deleted");
        getData();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const sortedTasks = tasks?.sort((a, b) => a.id - b.id);

  const signOut = () => {
    console.log("sign out");
    removeCookie("Email");
    removeCookie("AuthToken");
  };

  return (
    <>
      <p>
        Logged in as {userEmail} <button onClick={signOut}>Sign out</button>
      </p>

      <InputTodo getData={getData} />
      <h3>Your list of things to do:</h3>
      <table>
        <tr>
          <th>Description</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        {sortedTasks?.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>
              <EditTodo task={task} getData={getData} />
            </td>
            <td>
              <button onClick={() => deleteTodo(task.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default ListTodos;
