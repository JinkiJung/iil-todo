import React from "react";
import Button from "@material-ui/core/Button";
import {IConfirmContext, useConfirm} from "./ConfirmContext";

const DeleteButton: React.FC<IConfirmContext> = ({title, message, onConfirmCallback, onCancelCallback }) => {
    const { getConfirmation } = useConfirm();
  const onClick = async () => {
    return await getConfirmation({
        open: true, 
        title,
        message,
        onConfirmCallback,
        onCancelCallback,
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      Delete
    </Button>
  );
};

export default DeleteButton;