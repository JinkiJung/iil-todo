import React, { createContext, useContext } from "react";
import { Confirm } from "./Confirm";

export interface IConfirmContext{
    open: boolean, title: string, message: string, onConfirmCallback: Function | undefined, onCancelCallback: Function | undefined
}

const defaultContext = {open: false, title: "", message: "", onConfirmCallback: undefined, onCancelCallback: undefined};

const ConfirmContext = createContext<any>(null);

type ConfirmContextType = {
    dialogConfig: IConfirmContext
    openDialog: (context: any) => void
}

const ConfirmProvider: React.FC = ({ children }) => {
  const [dialogConfig, setDialogConfig] = React.useState<IConfirmContext>(defaultContext);

  const openDialog = ({ title, message, onConfirmCallback: onConfirm, onCancelCallback: onCancel }: IConfirmContext) => {
    setDialogConfig({ open: true, title, message, onConfirmCallback: onConfirm, onCancelCallback: onCancel });
  };

  const resetDialog = () => {
    setDialogConfig({open:false, title: "", message: "", onConfirmCallback: undefined, onCancelCallback: undefined});
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.onConfirmCallback?.();
  };

  const onCancel = () => {
    resetDialog();
    dialogConfig.onCancelCallback?.();
  };

  return (
    <ConfirmContext.Provider value={{openDialog}}>
      <Confirm
        open={dialogConfig?.open}
        title={dialogConfig?.title}
        message={dialogConfig?.message}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
      {children}
    </ConfirmContext.Provider>
  );
};

const useConfirm = () => {
  const { openDialog } = useContext(ConfirmContext) as unknown as ConfirmContextType;
  const getConfirmation = ({ ...options }) =>
    new Promise((res) => {
        openDialog({ actionCallback: res, ...options });
    });

  return { getConfirmation };
};

export { ConfirmProvider, useConfirm };