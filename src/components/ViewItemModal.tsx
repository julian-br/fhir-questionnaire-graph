import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem } from "fhir/r4";
import moment from "moment";
import { useRef, useState } from "react";
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

  const annotationsSortedByDate = getItemAnnotations(item).sort(
    (a, b) => Date.parse(a.time) - Date.parse(b.time)
  );
  const hasAnnotations = annotationsSortedByDate.length > 0;

  function handleSubmitAnnotation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

          <h4 className="font-bold text-slate-600">Annotations</h4>
          {hasAnnotations ? (
            <div className="mb-5">
              <AnnotationFeed annotations={annotationsSortedByDate} />
            </div>
          ) : (
            <div className="ml-2 mb-2 py-1">-</div>
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

function AnnotationFeed({
  annotations,
}: {
  annotations: QuestionnaireItemAnnotation[];
}) {
  return (
    <div className="max-h-72 overflow-y-auto rounded-xl">
      <ul role="list" className="p-2">
        {annotations.map((anntation, index) => (
          <li key={anntation.id}>
            <Annotation
              author={anntation.authorString}
              time={anntation.time}
              text={anntation.text}
            />
            {index !== annotations.length - 1 && (
              <div className="my-2 ml-2 h-4 w-0.5 rounded-full bg-slate-300"></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AnnotationProps {
  author: string;
  time: string;
  text: string;
}
function Annotation({ author, time, text }: AnnotationProps) {
  const timePassedSinceAnnotation = moment(time).fromNow();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon
            className="mr-2 h-4 rounded-full  text-primary-500"
            icon={faMessage}
          />
          <h3 className="mb-0.5 flex items-center text-sm font-medium">
            {author}
          </h3>
        </div>
        <time className="pr-1 text-sm text-gray-500">
          {timePassedSinceAnnotation}
        </time>
      </div>
      <p className="w-11/12  text-sm text-gray-500">{text}</p>
    </>
  );
}
