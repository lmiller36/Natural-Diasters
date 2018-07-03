import { createStore,applyMiddleware} from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

const configureStore = (initialState) => {
    const middlewares = [
        thunk
    ];

    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middlewares)
    );
};

export default function configureAndResetStore(){
    const store = configureStore();
    store.dispatch({
        type: 'RESET_STORE'
    });
    return store;
}