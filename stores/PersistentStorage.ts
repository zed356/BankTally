import { defaultValues } from "@/constants/DefaultUserInputValues";
import { ICurrencyObject } from "@/types/UserInputTypes";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const { getItem, setItem } = useAsyncStorage("values");

export const readItemFromStorage = async (): Promise<ICurrencyObject> => {
  const item = await getItem();
  const res = item != null ? JSON.parse(item) : defaultValues;
  return res;
};

export const writeItemToStorage = async (values: ICurrencyObject) => {
  await setItem(JSON.stringify(values));
};
