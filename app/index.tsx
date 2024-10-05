import { Fragment, useEffect } from "react";

import UserInputList from "../components/user-inputs/UserInputList";

import { readItemFromStorage } from "@/stores/PersistentStorage";
import { useUserInputStore } from "@/stores/UserInputContext";

export default function Index() {
  const userInputStore = useUserInputStore();

  // loads old data if there is any upon app start
  useEffect(() => {
    (async () => {
      let res;
      try {
        res = await readItemFromStorage();
        userInputStore.update(res);
      } catch {
        console.log("oh noo");
      }
    })();
  }, []);

  return (
    <Fragment>
      {/* hides keyboard if pressing empty elements */}
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
      <UserInputList />
      {/* </TouchableWithoutFeedback> */}
    </Fragment>
  );
}
