import { useMemo } from "react";
import "./App.css";
import { hello } from "@global-shared/hello";

function App() {
  const helloMessage = useMemo(() => hello("world"), []);

  return <>{helloMessage}</>;
}

export default App;
