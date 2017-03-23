import {IntlProvider} from 'react-intl'
import React from 'react'

const provideIntl = (node: React$Element<*>) => (
    <IntlProvider
        locale="de"
        defaultLocale="de"
    >
        {node}
    </IntlProvider>
)

export default provideIntl
