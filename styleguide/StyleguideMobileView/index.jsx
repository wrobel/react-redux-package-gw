import Frame from 'react-frame-component'
import React from 'react'

const StyleguideMobileView = ({
    width = '320',
    height = '480',
    children
}) => (
    <div>
        <div
            style={{
                width: `${width}px`,
                height: '30px',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
                background: '#000'
            }}
        >
            <span
                style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '4px',
                    textAlign: 'center',
                    color: '#fff'
                }}
            >
                {`${width} x ${height} px`}
            </span>
        </div>
        <div
            style={{
                borderBottomLeftRadius: '15px',
                borderBottomRightRadius: '15px',
                width: `${width}px`,
                height: `${height}px`,
                border: '2px solid #000',
                overflow: 'scroll'
            }}
        >
            <Frame
                head={
                    <link
                        type="text/css"
                        rel="stylesheet"
                        href="styleguide.css"
                    />
                     }
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                {children}
            </Frame>
        </div>
    </div>
)

export default StyleguideMobileView
