import Graph from "../components/Graph/Graph";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import { useState } from "react";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
const questionnaireData = data as Questionnaire;

export default function QuestionnaireGraphPage() {
  const [activeItemId, setActiveItemId] = useState(
    questionnaireData.item![0].linkId
  );

  return (
    <>
      <Navbar />
      <main className="flex flex-grow">
        <SideBar>
          <div>
            <QuestionnaireItemsNav
              onItemClick={(clickedItemId) => setActiveItemId(clickedItemId)}
              items={questionnaireData.item!}
              activeItemId={activeItemId}
            />
          </div>
        </SideBar>
        <div className="w-full">
          <Graph
            questionnaire={questionnaireData}
            activeItemId={activeItemId}
          />
        </div>
      </main>
    </>
  );
}
