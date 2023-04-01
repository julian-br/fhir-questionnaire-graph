import { faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useRef } from "react";
import { QuestionnaireItemAnnotation } from "../../api/questionnaire";
import Button from "../common/Button";

interface AnnotationFeedProps {
  annotations: QuestionnaireItemAnnotation[];
  onDeleteAnnotationClick: (annotation: QuestionnaireItemAnnotation) => void;
}

export function AnnotationFeed({
  annotations,
  onDeleteAnnotationClick,
}: AnnotationFeedProps) {
  const scrollAnchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView();
  }, [annotations]);

  if (annotations.length === 0) {
    return <AnnotationEmptyState />;
  }

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
      <p className="w-11/12 whitespace-pre text-sm text-slate-600">
        {annotation.text}
      </p>
    </div>
  );
}

function AnnotationEmptyState() {
  return (
    <div className="my-2 flex items-center rounded-xl bg-slate-50 py-4 px-3">
      <FontAwesomeIcon icon={faMessage} className="h-4  text-slate-300" />
      <p className="ml-2 text-sm font-medium text-slate-500">
        No Annotations added yet...
      </p>
    </div>
  );
}
