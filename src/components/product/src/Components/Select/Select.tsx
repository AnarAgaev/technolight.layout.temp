import { getOptionListType } from './types'
import { productInterface } from './../../Store/types'
import { useId } from 'react'
import { useProduct } from '../../Store'
import Option from '../Option'
import style from './Select.module.scss'
interface SelectPropsInterface {
    active: boolean
    field: string
    idx: boolean | number
    handleSelectClick: () => void
    closeAllSelects: () => void
}

const Select: React.FC<SelectPropsInterface> = ({ active, field, handleSelectClick, closeAllSelects }) => {
    const fields = useProduct(store => store.series.fields)
    const selectMap = useProduct(store => store.selectsMap)
    const translate = useProduct(store => store.series.translate)
    const current = useProduct(store => store.current) as productInterface & { [key: string]: string }
    const units = useProduct(store => store.series.units)
    const updateProduct = useProduct(store => store.updateProduct)

    let selectedVal = current[field]
    if (typeof selectedVal === 'boolean') selectedVal = selectedVal ? 'Да' : 'Нет'

    const id = useId()

    const { select, select_open, caption, wrap, reset, value, value_open,
        value_disabled, drop, drop_open, options } = style

    const dropClass = active ? `${drop} ${drop_open}` : drop
    const selectClass = active ? `${select} ${select_open}` : select
    const valClass = selectMap[field] === undefined
        ? `${value} ${value_disabled}`
        : active
            ? `${value} ${value_open}`
            : value

    const handleResetClick = () => {
        updateProduct(field, undefined)
        handleSelectClick()
    }

    const getOptionList: getOptionListType = (current, fields, field, id, isSelected) => {
        const propsArr = fields[field]
        const optionList: React.ReactNode[] = [];

        (propsArr as Array<{ value: string }>).forEach((propsObj: { value: string }, idx: number) => {
            let value = propsObj.value
            const isActive = isSelected ? current[field] == value : false

            if (typeof value === 'boolean') value = value ? 'Да' : 'Нет'

            optionList.push(<Option
                key={`${id}-${idx}`}
                val={value}
                active={isActive}
                field={field}
                closeAllSelects={closeAllSelects} />)
        })

        return optionList
    }

    const isSelected = !(selectMap[field] === undefined || selectMap[field] === null)

    if (isSelected) {
        selectedVal = `${selectedVal}`
        selectedVal += units[field]
            ? field !== 'light_angle'
                ? ` ${units[field]}`
                : `${units[field]}`
            : ``
    } else {
        selectedVal = 'Не выбрано'
    }

    return (
        <div className={selectClass}>
            <span className={caption}>{translate[field]}</span>
            <div className={wrap}>
                <div className={valClass} onClick={() => handleSelectClick()}>
                    {selectedVal}
                </div>
                <div className={dropClass}>
                    <div className={options}>
                        {getOptionList(current, fields, field, id, isSelected)}
                        {isSelected
                            ? <label>
                                    <span className={reset} onClick={handleResetClick}>
                                        Сбросить
                                    </span>
                                </label>
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Select
