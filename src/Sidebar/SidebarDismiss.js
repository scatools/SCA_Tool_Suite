import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMinus,
  faChevronLeft,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const arrowIcon = (
  <FontAwesomeIcon icon={faArrowLeft} color="white" size="lg" />
);

const collapseIcon = (
  <FontAwesomeIcon icon={faEyeSlash} color="white" size="lg" />
);

const SidebarDismiss = ({ setActiveSidebar }) => {
  return (
    <div
      id="dismiss"
      onClick={() => {
        setActiveSidebar(false);
      }}
    >
      {collapseIcon}
    </div>
  );
};

export default SidebarDismiss;
