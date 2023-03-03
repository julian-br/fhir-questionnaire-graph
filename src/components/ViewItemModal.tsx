import { QuestionnaireItem } from "fhir/r4";
import TextArea from "./common/input/TextArea";
import Modal from "./common/Modal";

interface ViewItemModalProps {
  onClose: () => void;
  item: QuestionnaireItem;
}

export default function ViewItemModal({ onClose, item }: ViewItemModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="">
        <div className="">
          <span className="text-sm text-slate-500">{item.linkId}</span>
          <h5 className="pb-4 text-lg">
            {item.prefix !== undefined && (
              <span className="pr-2 font-medium">{item.prefix}</span>
            )}
            {item.text}
          </h5>

          <div>
            <h6 className="font-medium">Annotations</h6>
            <AnnotationFeed />
          </div>

          <TextArea placeholder="Add a new annotation..." fitContent={true} />
        </div>
      </div>
    </Modal>
  );
}

function AnnotationFeed() {
  const activityItems = [
    {
      id: 1,
      name: "Demo User",
      text: "Eventuell muss hier noch überprüft werden, wie alt die Patientin ist",
      time: "3h",
    },
    {
      id: 2,
      name: "Demo User",
      text: "Ja, dass ist eine gute Idee",
      time: "1h",
    },
  ];
  return (
    <div>
      <ul role="list" className="divide-y divide-gray-200">
        {activityItems.map((activityItem) => (
          <li key={activityItem.id} className="py-3">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{activityItem.name}</h3>
                  <p className="text-sm text-gray-500">{activityItem.time}</p>
                </div>
                <p className="text-sm text-gray-500">{activityItem.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
