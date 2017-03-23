import {Provider} from 'react-redux'
import React from 'react'
import {createStore} from 'redux'

/* eslint-disable flowtype/no-weak-types */

const ProvideProvider = ({
    mockStore,
    children,
    reducer
}: {
    mockStore: Object,
    children: React$Element<*>,
    reducer?: Function
}) => (
    <Provider
        store={
            createStore(
                typeof reducer === 'function' ?
                reducer
                : () => mockStore,
                mockStore
            )
              }
    >
        {children}
    </Provider>
)

ProvideProvider.defaultProps = {
    reducer: undefined
}

export default ProvideProvider
