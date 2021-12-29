const { default: axios } = require("axios");
const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: logger } = require("redux-logger");
const { default: thunk } = require("redux-thunk");

//stats
let booksInitialState = {
  noOfBooks: 100,
};
let studentsInitialState = {
  noOfStudents: 100,
};

let statusOfData = {
  loading: false,
  data: [],
  error: "",
};

//actions

function getBook(name) {
  return { type: "GET_BOOK", name };
}

function getStudent() {
  return { type: "GET_STUDENT" };
}

function getData(data) {
  return { type: "GET_DATA", payload: data };
}

function startData() {
  return { type: "START_DATA" };
}

function errorData(data) {
  return { type: "ERROR_DATA", payload: data };
}

//reducer

function bookReducer(state = booksInitialState, action) {
  switch (action.type) {
    case "GET_BOOK":
      return {
        ...state,
        noOfBooks: state.noOfBooks - 1,
        bookName: action.name,
      };
      break;

    default:
      return state;
      break;
  }
}

function studentReducer(state = studentsInitialState, action) {
  switch (action.type) {
    case "GET_STUDENT":
      return { ...state, noOfStudents: state.noOfStudents - 1 };
      break;

    default:
      return state;
      break;
  }
}

function fetchReducer(state = statusOfData, action) {
  switch (action.type) {
    case "GET_DATA":
      return { ...state, loading: false, data: action.payload };
      break;

    case "START_DATA":
      return { ...state, loading: true };
      break;

    case "ERROR_DATA":
      return { ...state, loading: false, error: action.payload };
      break;

    default:
      return state;
      break;
  }
}

//fetch function call

function fetchData(url) {
  return async (dispatch) => {
    dispatch(startData());
    try {
      const response = await axios.get(url);
      dispatch(getData(response.data));
    } catch (error) {
      dispatch(errorData(error.toString()));
    }
  };
}

//store

const rootStore = combineReducers({
  bookReducer,
  studentReducer,
  fetchReducer,
});

let store = createStore(rootStore, applyMiddleware(logger, thunk));

store.subscribe(() => {
  console.log("store subscribed");
});

/* store.dispatch(getBook());
store.dispatch(getBook());
store.dispatch(getBook());
store.dispatch(getStudent());
store.dispatch(getBook("ragu"));
store.dispatch(getBook("my")); */

store.dispatch(fetchData("https://jsonplaceholder.typicode.com/users"));

console.log(store.getState());
