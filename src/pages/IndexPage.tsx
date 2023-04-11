import { Redirect } from "wouter";
import { useQuestionnaires } from "../api/questionnaire";
import { encodeURLParam } from "../utils/urlParam";
import { constructGraphPageUrl } from "./GraphPage";

export const INDEX_PAGE_ROUTE = "";

export default function IndexPage() {
  const { isSuccess, data: questionnaires } = useQuestionnaires();

  return (
    <main>
      {isSuccess && (
        <Redirect
          to={constructGraphPageUrl(
            questionnaires[0].id!,
            questionnaires[0].item![0].linkId
          )}
        />
      )}
    </main>
  );
}
