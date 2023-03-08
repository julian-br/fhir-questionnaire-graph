import { faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem } from "fhir/r4";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  QuestionnaireItemAnnotation,
  useAnnotationMutation,
} from "../api/questionnaire";
import { getItemAnnotations } from "../utils/getItemAnnotations";
import Button from "./common/Button";
import TextArea from "./common/input/TextArea";
import Modal from "./common/Modal";

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
  const hasAnnotations = annotationsSortedByDate.length > 0;

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
      <div className="mb-3 w-[50rem]">
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
          {hasAnnotations ? (
            <div className="mb-5">
              <AnnotationFeed
                annotations={annotationsSortedByDate}
                onDeleteAnnotationClick={handleDeleteAnnotation}
              />
            </div>
          ) : (
            <AnnotationEmptyState />
          )}
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

function AnnotationEmptyState() {
  return (
    <div className="my-2 flex items-center rounded-xl">
      <FontAwesomeIcon icon={faMessage} className="h-4 pb-2 text-slate-300" />
      <p className="ml-2 mb-2 py-1 text-sm text-slate-500">
        No Annotations added yet...
      </p>
    </div>
  );
}

function AnnotationFeed({
  annotations,
  onDeleteAnnotationClick,
}: {
  annotations: QuestionnaireItemAnnotation[];
  onDeleteAnnotationClick: (annotation: QuestionnaireItemAnnotation) => void;
}) {
  const scrollAnchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView();
  }, [annotations]);

  return (
    <div className="max-h-72 overflow-y-auto rounded-xl bg-slate-50">
      <ul role="list">
        {annotations.map((anntation, index) => (
          <li key={anntation.id}>
            <Annotation
              annotation={anntation}
              onDeleteClick={onDeleteAnnotationClick}
            />
            {index !== annotations.length - 1 && (
              <div className="my-1 ml-2 h-4 w-0.5 rounded-full bg-slate-300"></div>
            )}
          </li>
        ))}
        <span ref={scrollAnchor}></span>
      </ul>
    </div>
  );
}

interface AnnotationProps {
  annotation: QuestionnaireItemAnnotation;
  onDeleteClick: (annotationToDelete: QuestionnaireItemAnnotation) => void;
}
function Annotation({ annotation, onDeleteClick }: AnnotationProps) {
  const timePassedSinceAnnotation = moment(annotation.time).fromNow();

  return (
    <div className="group relative p-2 hover:bg-slate-100">
      <div className="hidden group-hover:block">
        <Button
          onClick={() => onDeleteClick(annotation)}
          variant="custom"
          title="Delete Annotation"
          className="absolute top-1 right-3 rounded-lg py-1 px-2 text-slate-500 hover:bg-primary-200 hover:text-primary-600"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>

      <div className="flex items-center">
        <div className="flex items-center">
          <FontAwesomeIcon
            className="mr-2 h-4 rounded-full  text-primary-500"
            icon={faMessage}
          />
          <h3 className="text mb-0.5 flex items-center text-sm font-semibold">
            {annotation.authorString}
          </h3>
        </div>
        <time className="ml-2 pr-1 text-xs text-slate-600">
          {timePassedSinceAnnotation}
        </time>
      </div>
      <p className="w-11/12  whitespace-pre text-sm text-slate-600">
        {annotation.text}
      </p>
    </div>
  );
}
