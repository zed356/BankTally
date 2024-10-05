import { defaultValues } from "@/constants/DefaultUserInputValues";
import { ICurrencyObject } from "@/types/UserInputTypes";
import { create } from "zustand";

interface UserInputsState {
  values: ICurrencyObject;
  update: (newValues: ICurrencyObject) => void;
  clear: () => void;
}

export const useUserInputStore = create<UserInputsState>()((set) => ({
  values: defaultValues,
  update: (newValues) => set((state) => ({ values: newValues })),
  clear: () => set((state) => ({ values: defaultValues })),
}));
