import { createContext, useContext, useRef, useState } from "react";
import DeleteModal from "./DeleteModal";

const ConfirmDialog = createContext();

export function ConfirmDialogProvider({children}) {
  const [state, setState] = useState({ isOpen: false })
  const func = useRef();

  const confirm = (data) => {
    return new Promise((resolve) => {
      setState({...data, isOpen: true});
      func.current = (choice) => {
        resolve(choice);
        setState({ isOpen: false });
      }
    })
  }

  const { isOpen } = state
  return (
    <ConfirmDialog.Provider value={confirm}>
      {children}
      <DeleteModal
        isOpen={isOpen}
        {...state}
        onClose={() => func.current(false)}
        onConfirm={() => func.current(true)} />
    </ConfirmDialog.Provider>
  )
}

export default function useConfirm() {
  return useContext(ConfirmDialog)
}