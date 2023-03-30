import {
  faArrowLeft,
  faArrowRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Questionnaire } from "fhir/r4";
import { Link } from "wouter";
import Button from "../../../components/common/Button";
import { constructGraphPageUrl } from "../../../pages/GraphPage";
import { findItemByLinkId } from "../../../utils/findItemByLinkId";
import { findGroupOfItem } from "../utils/findGroupOfItem";

interface ActiveItemOverviewProps {
  activeItemId: string;
  questionnaire: Questionnaire;
}

export default function ActiveItemOverview({
  activeItemId,
  questionnaire,
}: ActiveItemOverviewProps) {
  const activeItem = findItemByLinkId(activeItemId, questionnaire);
  const groupOfActiveItem = findGroupOfItem(activeItem!, questionnaire);

  return (
    <div className="border-b px-7 py-3">
      <h4 className="mb-2 flex w-4/6 items-center">
        {groupOfActiveItem !== undefined && (
          <Link
            to={constructGraphPageUrl(
              questionnaire.id ?? "",
              groupOfActiveItem.linkId
            )}
            className="font block w-1/3 cursor-pointer overflow-hidden truncate text-sm text-slate-500 hover:text-primary-400"
            title={groupOfActiveItem.text}
          >
            {groupOfActiveItem?.text}
          </Link>
        )}

        {groupOfActiveItem !== undefined && (
          <FontAwesomeIcon
            className="mx-3 h-3 text-slate-400"
            icon={faChevronRight}
          />
        )}

        <div
          className="w-2/3 truncate text-sm font-semibold text-slate-500"
          title={activeItem?.text}
        >
          {activeItem?.text}
        </div>
      </h4>

      <ItemPagnation />
    </div>
  );
}

function ItemPagnation() {
  return (
    <div className="text-sm font-medium text-primary-600">
      <Button variant="custom" className=" mr-3 hover:text-primary-400">
        <FontAwesomeIcon className="h-3" icon={faArrowLeft} /> previous Item
      </Button>
      <Button className="hover:text-primary-400" variant="custom">
        next Item <FontAwesomeIcon className="h-3" icon={faArrowRight} />
      </Button>
    </div>
  );
}
