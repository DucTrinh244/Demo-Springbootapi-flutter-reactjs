import toast from 'react-hot-toast';
import './App.css';

function App() {

  return (
    <div>
      <h1>this is a mainpage </h1>
      <button onClick={()=> {toast.success("click me")}}> click me </button>
    </div>
  )
}

export default App
