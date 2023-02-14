import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { NodeData, EdgeData } from "reaflow";
import { create } from "zustand";
import data from "../assets/fhir-questionnaire-example.json";

const questionnaireData = data as Questionnaire;
const currentGroup = questionnaireData.item![3];

interface GraphState {
  nodes: NodeData[];
  edges: EdgeData[];
  setNodeHeight: (nodeId: string, newHeight: number) => void;
}

export const useGraph = create<GraphState>((set) => ({
  nodes: determineNodes(currentGroup),
  edges: determineEdges(currentGroup),
  setNodeHeight(nodeId: string, newHeight: number) {
    set((state) => {
      const nodesCopy = [...state.nodes];
      const indexOfNodeToModify = nodesCopy.findIndex(
        (node) => node.id === nodeId
      );

      const nodeCopy = { ...nodesCopy[indexOfNodeToModify] };
      nodesCopy[indexOfNodeToModify] = { ...nodeCopy, height: newHeight };
      return { ...state, nodes: nodesCopy };
    });
  },
}));

function determineNodes(item: QuestionnaireItem) {
  if (item.type === "group" && item.item !== undefined) {
    return item.item.map((question) => ({
      id: question.linkId,
      text: question.text ?? "",
      width: 400,
    }));
  }

  return [
    {
      id: item.linkId,
      text: item.text ?? "",
      width: 400,
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
