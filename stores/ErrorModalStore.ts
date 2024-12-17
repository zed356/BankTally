import { create } from "zustand";

interface ErrorModalState {
  isVisible: boolean;
  message: string;
  actionButtonName: string;
  onActionButtonPress: () => void;
  showErrorModal: (
    message: string,
    actionButtonName: string,
    onActionButtonPress: () => void
  ) => void;
  closeErrorModal: () => void;
}

export const useErrorModalStore = create<ErrorModalState>((set) => ({
  isVisible: false,
  message: "",
  actionButtonName: "",
  actionButtonType: "negative",
  onActionButtonPress: () => {},
  showErrorModal: (message: string, actionButtonName: string, onActionButtonPress: () => void) => {
    set({ isVisible: true, message, actionButtonName, onActionButtonPress });
  },
  closeErrorModal: () => {
    set({ isVisible: false });
  },
}));
