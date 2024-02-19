import { useState, useEffect } from 'react'
import { useProduct } from '../../Store'
import { usePopper } from 'react-popper'
import style from './Cart.module.scss'

interface CustomWindow extends Window {
    showModalMsg: (title: string, message: string) => void
    addProductToCart: ({ art, count }: { art: string, count: number }) => void
    cartLink: string
}
declare let window: CustomWindow

const Cart: React.FC = () => {
    const series = useProduct(store => store.series)
    const currentProd = useProduct(store => store.current)

    const { cart, counter, calc, message, buttons, inc, dec, informer } = style

    const [count, setCount] = useState<number | string>(1)

    const [inCart, setInCart] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const onlyDigits = /^\d+$/.test(inputValue)

        if (inputValue === '') setCount('')

        if (!onlyDigits || '') return

        setCount(parseInt(inputValue))
    }

    const handleInc: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (count === '') {
            setCount(1)
            return
        }

        if (typeof count === 'number') {
            setCount(count + 1)
        } else {
            setCount(parseInt(count) + 1)
        }
    }

    const handleDec: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (count === '') {
            setCount(1)
            return
        }

        let newCount = typeof count === 'number'
            ? count - 1
            : parseInt(count) - 1

        if (newCount <= 0) newCount = 1

        setCount(newCount)
    }

    const handleBlur = () => {
        if (count === '' || count === 0) setCount(1)
    }

    // Setting tooltip about product is out of stock
    const [tooltipBtn, setTooltipBtn] = useState<HTMLButtonElement | null>(null)
    const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null)
    const [isTooltipVisible, setIsTooltipVisible] = useState(false)
    const { styles, attributes } = usePopper(tooltipBtn, tooltip, {
        placement: 'top-end',
        modifiers: [
            { name: 'offset', options: { offset: [-20, 0] } },
        ],
    })

    const handleTooltipButtonClick = () => {
        setIsTooltipVisible(!isTooltipVisible)
    }

    useEffect(() => {
        const handleClickOutsideTooltip = (event: MouseEvent) => {
            const el: HTMLElement | null = event.target as HTMLElement

            if (el && !el.classList.contains(informer)) {
                setIsTooltipVisible(false)
            }
        }

        document.addEventListener('click', handleClickOutsideTooltip)

        return () => {
            document.removeEventListener('click', handleClickOutsideTooltip)
        }
    }, [informer])


    const handleClick = () => {
        try {
            window.showModalMsg(`${series.title}`, "Добавлен в корзину")
        } catch (e) {
            console.warn(e)
        }
        if (!currentProd.article) return

        const value = typeof count === 'string'
            ? parseInt(count)
            : count

        window.addProductToCart({
            art: currentProd.article,
            count: value
        })

        setInCart(true)
    }

    return (
        <div className={cart}>
            <form className={counter} onSubmit={e => e.preventDefault()}>
                <div className={`${calc}`}>
                    <button className="btn btn_lite" type="button" onClick={handleDec}>
                        <i className={inc}></i>
                    </button>
                    <input type="text" value={count} onChange={handleChange} onBlur={handleBlur} />
                    <button className="btn btn_lite" type="button" onClick={handleInc}>
                        <i className={dec}></i>
                    </button>
                </div>
                <div className={message}>
                    Товара нет на складе
                    <button type="button"
                        ref={setTooltipBtn}
                        onClick={handleTooltipButtonClick}
                        className={`tooltip__icon ${informer}`}></button>
                    {isTooltipVisible && (
                        <div ref={setTooltip}
                            style={styles.popper}
                            className='tooltip__body'
                            {...attributes.popper}>
                            Количество и сроки уточняйте у менеджера
                        </div>
                    )}
                </div>
            </form>
            <div className={buttons}>
                {
                    inCart
                        ? <a className="btn btn_block btn_dark" href={window.cartLink}>
                            <span>В корзине</span>
                        </a>
                        : <button className="btn btn_block btn_dark" onClick={handleClick}>
                            <span>Добавить в корзину</span>
                        </button>
                }
                <a className="btn btn_block btn_lite" href="#">
                    <span>Перейти в конфигуратор</span>
                </a>
            </div>
        </div>
    )
}

export default Cart