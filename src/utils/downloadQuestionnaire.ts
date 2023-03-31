import { Questionnaire } from "fhir/r4";

export function downloadQuestionnaire(questionnaire: Questionnaire) {
  const blob = new Blob([JSON.stringify(questionnaire)], {
    type: "application/json",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const tempAElement = document.createElement("a");
  tempAElement.href = downloadUrl;
  tempAElement.download = "questionnaire.json";

  tempAElement.click();
  URL.revokeObjectURL(downloadUrl);
}
