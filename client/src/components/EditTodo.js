import { useState } from "react";

function EditTodo({ task, getData }) {
  // console.log(task);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState(task.title);

  //edit description function
  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      const body = { title };
      const response = await fetch(`http://localhost:5000/todos/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
      if (response.status === 200) {
        console.log("todo edited");
        getData();
      }
      // window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>EDIT</button>

      {showModal && (
        <>
          {" "}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="button" onClick={(e) => updateDescription(e)}>
            Edit
          </button>
          <button type="button" onClick={() => setShowModal(false)}>
            Close
          </button>{" "}
        </>
      )}

      {/* <div>Edit your todo</div>
      <input type="text" />
      <button type="button">Edit</button>
      <button type="button">Close</button> */}
    </>
  );
}

export default EditTodo;
