import { useState, useId } from 'react'
import { useProduct } from '../../Store'
import Select from '../Select'
import style from './SelectList.module.scss'

const SelectList: React.FC = () => {
    const fields = useProduct(store => store.series.fields)

    const { selectors, title, body } = style

    const id = useId()

    const [selectsState, setSelectsState] = useState<boolean[]>(Object.keys(fields).map(() => false))

    const handleSelectClick = (idx: number) => {
        let newSelectsState: boolean[] = []

        if (selectsState[idx]) {
            newSelectsState = [...selectsState.fill(false)]
        } else {
            for (let i = 0; i < selectsState.length; i++) {
                newSelectsState.push(i === idx)
            }
        }

        setSelectsState(newSelectsState)
    }

    const closeAllSelects = () => {
        let newSelectsState: boolean[] = []
        newSelectsState = [...selectsState.fill(false)]
        setSelectsState(newSelectsState)
    }

    const getSelectsList = () => {
        const selectsList: React.ReactNode[] = []

        Object.keys(fields).forEach((key, idx) => {
            selectsList.push(<Select
                key={`${id}-${idx}`}
                active={selectsState[idx]}
                field={key}
                idx={idx}
                handleSelectClick={() => handleSelectClick(idx)}
                closeAllSelects={closeAllSelects} />)
        })

        return selectsList
    }

    return (
        <div className={selectors}>
            <h3 className={title}>Выбор комплектации</h3>
            <div className={body}>
                { getSelectsList() }
            </div>
        </div>
    )
}

export default SelectList