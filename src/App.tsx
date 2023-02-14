import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { Canvas, CanvasPosition, ElkNodeLayoutOptions } from "reaflow";
import data from "./fhir-questionnaire-example.json";

const questionnaireData = data as Questionnaire;
const currentGroup = questionnaireData.item![23];

function App() {
  console.log(currentGroup);

  function determineNodes(item: QuestionnaireItem) {
    if (item.type === "group" && item.item !== undefined) {
      return item.item.map((question) => ({
        id: question.linkId,
        text: question.text ?? "",
      }));
    }

    return [
      {
        id: item.linkId,
        text: item.text ?? "",
      },
    ];
  }

  function determineEdges(item: QuestionnaireItem) {
    if (item.type === "group" && item.item !== undefined) {
      const nestedQuestions = item.item.filter(
        (question) => question.enableWhen !== undefined
      );

      return nestedQuestions.map((nestedQuestion) => {
        return {
          id: nestedQuestion.linkId,
          from: nestedQuestion.enableWhen![0].question,
          to: nestedQuestion.linkId,
        };
      });
    }

    return [];
  }

  const nodes = determineNodes(currentGroup);
  const edges = determineEdges(currentGroup);

  return (
    <div className="App">
      <h1 className="bg-slate-800 py-4 text-3xl font-semibold ">
        <span className="ml-3 font-semibold text-sky-100">
          Fhir Questionnaire Viewer
        </span>
      </h1>
      <Canvas
        className="bg-slate-50"
        nodes={nodes}
        edges={edges}
        maxHeight={800}
        maxWidth={1000}
        readonly={true}
        direction="RIGHT"
        defaultPosition={CanvasPosition.LEFT}
      />
    </div>
  );
}

export default App;
