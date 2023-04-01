import { QuestionnaireItem } from "fhir/r4";
import moment from "moment";
import { useMemo, useState } from "react";
import {
  QuestionnaireItemAnnotation,
  useAnnotationMutation,
} from "../../api/questionnaire";
import { getItemAnnotations } from "../../utils/getItemAnnotations";
import Button from "../common/Button";
import TextArea from "../common/input/TextArea";
import Modal from "../common/Modal";
import { AnnotationFeed } from "./AnnotationFeed";

interface ViewItemModalProps {
  onClose: () => void;
  item: QuestionnaireItem;
  questionnaireId: string;
}

export default function ViewItemModal({
  onClose,
  item,
  questionnaireId,
}: ViewItemModalProps) {
  const [annotationText, setAnnotationText] = useState("");
  const annotationMutation = useAnnotationMutation();

  const annotationsSortedByDate = useMemo(
    () =>
      getItemAnnotations(item).sort(
        (a, b) => Date.parse(a.time) - Date.parse(b.time)
      ),
    [item]
  );

  function handleSubmitAnnotation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (annotationText.length === 0) {
      return;
    }

    const newAnnotation = {
      authorString: "Demo User",
      time: moment(Date.now()).toISOString(),
      text: annotationText,
    };

    annotationMutation.add.mutate(
      {
        questionnaireId,
        itemLinkId: item.linkId,
        newAnnotation,
      },
      { onSuccess: () => setAnnotationText("") }
    );
  }

  function handleDeleteAnnotation(annotation: QuestionnaireItemAnnotation) {
    annotationMutation.delete.mutate({
      annotationId: annotation.id,
      itemLinkId: item.linkId,
      questionnaireId,
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="mb-4 w-[50rem]">
        <div className="">
          <span className="text-sm font-light text-slate-500">
            {item.linkId}
          </span>
          <h5 className="pb-4 text-lg font-medium text-slate-700">
            {item.prefix !== undefined && (
              <span className="pr-2 font-semibold ">{item.prefix}</span>
            )}
            {item.text}
          </h5>

          <h4 className="mb-2 font-medium text-slate-900">Annotations</h4>

          <div className="mb-4">
            <AnnotationFeed
              annotations={annotationsSortedByDate}
              onDeleteAnnotationClick={handleDeleteAnnotation}
            />
          </div>

          <form className="w-full" onSubmit={handleSubmitAnnotation}>
            <TextArea
              onInput={setAnnotationText}
              placeholder="Add a new annotation..."
              fitContent={true}
              value={annotationText}
            />
            <Button
              type="submit"
              className="mt-3 block text-sm"
              variant="primary"
            >
              <span className="font-bold">+</span>
              <span>Add Annotation</span>
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
