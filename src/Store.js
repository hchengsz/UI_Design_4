import React, { createContext, useReducer } from "react";
import Reducer from "./Reducer";

const initialState = {
  session_id: null,
  username: "null",
  likedMovie: new Map(),
  movies: [],
  yourRate: "Not yet",
  error: null,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
