import NavBar from "./components/NavBar";
import Store from "./Store";

function App() {
  return (
    <div>
      <Store>
        <NavBar></NavBar>
      </Store>
    </div>
  );
}

export default App;
