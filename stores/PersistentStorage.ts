import { defaultValues } from "@/constants/Values";
import { ICurrencyObject } from "@/types/UserInputTypes";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const { getItem, setItem } = useAsyncStorage("values");

export const getUserInputValuesFromStorage = async (): Promise<ICurrencyObject> => {
  const item = await getItem();
  const res = item != null ? JSON.parse(item) : defaultValues;
  return res;
};

export const writeUserInputValuesToStorage = async (values: ICurrencyObject) => {
  await setItem(JSON.stringify(values));
};
