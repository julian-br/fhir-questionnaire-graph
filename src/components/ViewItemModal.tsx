import TextArea from "./common/input/TextArea";
import Modal from "./common/Modal";

interface ViewItemModalProps {
  onClose: () => void;
}

export default function ViewItemModal({ onClose }: ViewItemModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="">
        <div className="">
          <span className="text-sm text-slate-500">Link12141.1232.base.ff</span>
          <h5 className="pb-7 text-xl">
            <span className="font-medium">3.1</span> Waren sie schonmal
            schwanger
          </h5>

          <TextArea
            label="New Annotation"
            placeholder="Add a new annotation..."
          />
        </div>
      </div>
    </Modal>
  );
}
