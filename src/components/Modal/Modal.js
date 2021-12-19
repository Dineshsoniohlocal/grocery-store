import React, { useEffect } from "react";
import PropTypes from "prop-types";

import styles from "./Modal.module.scss";

function Modal(props) {
  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <div
      className={styles.container}
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className={styles.inner}
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func,
};

export default Modal;
