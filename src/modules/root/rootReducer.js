const initialState = {
  page: 0,
  results: [],
  mainMovie: null,
  currentVideo: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ITEMS_FETCH_DATA_SUCCESS':
      return {
        ...state,
        page: action.payload.page,
        results: action.payload.results,
        mainMovie: action.payload.results[0].id,
      };
    case 'FETCH_VIDEO_SUCCESS':
      return {
        ...state,
        currentVideo: action.payload,
      };
    case 'CLEAR_CURRENT_MOVIE':
      return {
        ...state,
        currentVideo: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;

export { initialState };