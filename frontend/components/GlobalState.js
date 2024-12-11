import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  tts: false,
});

export { setGlobalState, useGlobalState };
