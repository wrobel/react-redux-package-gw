import {IntlProvider} from 'react-intl'
import React from 'react'
import renderer from 'react-test-renderer'

const renderWithIntl = (node) => renderer.create(
    <IntlProvider
        locale="de"
        defaultLocale="de"
    >
        {node}
    </IntlProvider>
)

export default renderWithIntl
