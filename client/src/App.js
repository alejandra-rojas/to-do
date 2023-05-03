import Auth from "./components/Auth";
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;

  return (
    <div className="todos">
      {/* <InputTodo /> */}
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListTodos authToken={authToken} />
        </>
      )}
    </div>
  );
}

export default App;
