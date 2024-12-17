import { create } from "zustand";

interface ConfirmationModalState {
  isVisible: boolean;
  text: string;
  onConfirm: () => void;
  showConfirmationModal: (text: string, onConfirm: () => void) => void;
  hideConfirmationModal: () => void;
}

export const useConfirmationModalStore = create<ConfirmationModalState>((set) => ({
  isVisible: false,
  text: "",
  onConfirm: () => {},
  showConfirmationModal: (text: string, onConfirm: () => void) => {
    set({ isVisible: true, text, onConfirm });
  },
  hideConfirmationModal: () => {
    set({ isVisible: false });
  },
}));
