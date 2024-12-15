import { defaultValues } from "@/constants/Values";
import { ICurrencyObject } from "@/types/UserInputTypes";
import { create } from "zustand";

interface UserInputState {
  userInputValues: ICurrencyObject;
  setUserInputValues: (values: ICurrencyObject) => void;
}

export const useUserInputStore = create<UserInputState>((set) => ({
  userInputValues: defaultValues,
  setUserInputValues: (userInputValues: ICurrencyObject) => set({ userInputValues }),
}));
