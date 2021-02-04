const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_ID":
      return {
        ...state,
        session_id: action.payload,
      };
    case "LOG_OUT":
      return {
        ...state,
        session_id: null,
        username: "null",
        likedMovie: new Map(),
        yourRate: "Not yet",
        error: null,
        movies: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_SELECTABLE":
      return {
        ...state,
        selectKey: action.payload,
      };
    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
      };
    case "SET_FAVORITE":
      return {
        ...state,
        likedMovie: action.payload,
      };
    case "SET_RATE":
      return {
        ...state,
        yourRate: action.payload,
      };
    case "SET_USERNAME":
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
