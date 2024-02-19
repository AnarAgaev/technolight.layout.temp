import React from 'react'
import Content from '../Content'
import SelectList from '../SelectList'
import Accordion from '../Accordion'
import Cart from '../Cart'
import style from './Body.module.scss'

const Body: React.FC = function () {

    const { wrapper } = style

    return (
        <>
            <div className={wrapper}>
                <Content />
                <SelectList />
            </div>
            <Cart />
            <Accordion />
        </>
    )
}

export default Body
