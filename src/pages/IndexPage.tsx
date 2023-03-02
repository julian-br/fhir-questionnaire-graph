import { Redirect } from "wouter";
import { useQuestionnaires } from "../api/questionnaire";
import { encodeURLParam } from "../utils/urlParam";

export const INDEX_PAGE_ROUTE = "";

export default function IndexPage() {
  const { isSuccess, data: questionnaires } = useQuestionnaires();

  return (
    <main>
      {isSuccess && (
        <Redirect
          to={`/graph/${encodeURLParam(questionnaires[0].id!)}/${encodeURLParam(
            questionnaires[0].item![0].linkId
          )}`}
        />
      )}
    </main>
  );
}
