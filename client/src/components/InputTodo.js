import { useState } from "react";
import { useCookies } from "react-cookie";

function InputTodo({ getData }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const [title, setTitle] = useState("");
  const user_email = cookies.Email;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    //send request
    try {
      const body = { title, user_email };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        console.log("todo added");
        getData();
      }
      // window.location = "/";
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="newTodo">
      <div>Create a new task:</div>
      <form className="newForm" onSubmit={onSubmitForm}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default InputTodo;
