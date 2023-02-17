import QuestionnaireGraphPage from "./pages/QuestionnaireGraphPage";
import { Route } from "wouter";
import IndexPage from "./pages/IndexPage";
import { decodeURLParam } from "./utils/urlParam";

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden font-inter text-slate-700">
      <Route path="">
        <IndexPage />
      </Route>
      <Route path="/graph/:questionnaireId/:itemLinkId">
        {(params: { questionnaireId: string; itemLinkId: string }) => (
          <QuestionnaireGraphPage
            questionnaireId={decodeURLParam(params.questionnaireId)}
            itemLinkId={decodeURLParam(params.itemLinkId)}
          />
        )}
      </Route>
    </div>
  );
}

export default App;
