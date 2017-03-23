import {Provider} from 'react-redux'
import React from 'react'
import {createStore} from 'redux'

/* eslint-disable flowtype/no-weak-types */

type ReducerType = (state: Object) => Object

const provideStore = (
    node: React$Element<*>,
    hydrateState: Object,
    reducer: ReducerType = (state: Object): Object => state
): React$Element<*> => {
    const store = createStore(
        reducer,
        hydrateState
    )

    return (
        <Provider store={store}>
            {node}
        </Provider>
    )
}

export default provideStore
