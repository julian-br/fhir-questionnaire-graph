import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Canvas, CanvasPosition } from "reaflow";
import data from "./fhir-questionnaire-example.json";

const questionnaireData = data as Questionnaire;
const currentGroup = questionnaireData.item![3];

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
    <div className="flex min-h-screen flex-col">
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
        <div className="w-5/6 bg-slate-100">
          <TransformWrapper
            wheel={{ step: 4 }}
            limitToBounds={false}
            panning={{ velocityDisabled: true }}
            doubleClick={{
              disabled: true,
            }}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Canvas
                onLayoutChange={() => console.log("layout changed")}
                pannable={true}
                zoomable={false}
                fit={true}
                nodes={nodes}
                edges={edges}
                maxHeight={885}
                maxWidth={1000}
                readonly={true}
                direction="RIGHT"
                defaultPosition={CanvasPosition.LEFT}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </div>
  );
}

export default App;
