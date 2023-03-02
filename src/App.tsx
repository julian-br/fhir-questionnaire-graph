import GraphPage, { GRAPH_PAGE_ROUTE } from "./pages/GraphPage";
import { Route } from "wouter";
import IndexPage, { INDEX_PAGE_ROUTE } from "./pages/IndexPage";
import { decodeURLParam } from "./utils/urlParam";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-col overflow-hidden font-inter text-slate-700">
        <Route path={INDEX_PAGE_ROUTE}>
          <IndexPage />
        </Route>
        <Route path={GRAPH_PAGE_ROUTE}>
          {(params: { questionnaireId: string; itemLinkId: string }) => (
            <GraphPage
              questionnaireId={decodeURLParam(params.questionnaireId)}
              itemLinkId={decodeURLParam(params.itemLinkId)}
            />
          )}
        </Route>
      </div>
    </QueryClientProvider>
  );
}

export default App;
