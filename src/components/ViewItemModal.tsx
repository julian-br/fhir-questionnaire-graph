import { faMemory, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Extension, Questionnaire, QuestionnaireItem } from "fhir/r4";
import TextArea from "./common/input/TextArea";
import Modal from "./common/Modal";

interface ViewItemModalProps {
  onClose: () => void;
  item: QuestionnaireItem;
}

interface QuestionnaireItemAnnotation {
  authorString: string;
  time: string;
  text: string;
}

const test: Extension = {
  url: "annotation",
  valueAnnotation: {
    time: "2023-03-03T08:45:07+00:00",
    authorString: "Demo User",
    text: "Diese Frage sollte nur angezeigt werden, wenn die Patientin älter als 12 ist!",
  },
};

export default function ViewItemModal({ onClose, item }: ViewItemModalProps) {
  const annotations = item.extension
    ?.map((extension) => extension.valueAnnotation)
    .filter(
      (extension) => extension !== undefined
    ) as QuestionnaireItemAnnotation[];

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

          <div className="mb-5">
            <h4 className="font-bold text-slate-600">Annotations</h4>
            <AnnotationFeed annotations={annotations} />
          </div>
          <TextArea placeholder="Add a new annotation..." fitContent={true} />
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
    <div className="max-h-96 overflow-y-auto rounded-xl">
      <ul role="list" className="p-2">
        {annotations.map((anntation, index) => (
          <li key={anntation.time}>
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
        <time className="pr-1 text-sm text-gray-500">{time}</time>
      </div>
      <p className="w-11/12  text-sm text-gray-500">{text}</p>
    </>
  );
}
