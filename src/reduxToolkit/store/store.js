// import {createStore} from 'redux';
import rootReducer from '../reducer/rootReducer';

// export const store = createStore(rootReducer);

import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: rootReducer,
});
