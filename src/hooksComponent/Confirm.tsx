import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";

export interface IConfirm {
    open: boolean;
    title: string;
    message: string;
    onConfirm: any;
    onCancel: any;
}

/**
 * @name - Confirm
 * @description - Dialog for confirming an action
 */
export const Confirm = ({ open, title, message, onConfirm, onCancel }: IConfirm) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button color="primary" variant="contained" onClick={onConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}
  