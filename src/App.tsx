import QuestionnaireGraphPage from "./pages/QuestionnaireGraphPage";
import { Route } from "wouter";
import IndexPage from "./pages/IndexPage";

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Route path="">
        <IndexPage />
      </Route>
      <Route path="/graph">
        <QuestionnaireGraphPage />
      </Route>
    </div>
  );
}

export default App;
