import Graph from "./components/Graph";

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <h1 className="border-b py-4 text-3xl font-semibold">
        <span className="ml-3 font-bold text-blue-600">FHIR TREE</span>
      </h1>
      <div className="flex flex-grow">
        <div className="border-slate-60 w-1/6 border-r">
          <div className="pl-3 pt-5 text-2xl font-medium">Sidebar</div>
          <div className="py-2 pl-3 ">entry</div>
          <div className="bg-blue-500 py-2 pl-3 font-medium text-blue-50">
            entry
          </div>
          <div className="pl-3 pt-1 ">entry</div>
        </div>
        <Graph />
      </div>
    </div>
  );
}

export default App;
