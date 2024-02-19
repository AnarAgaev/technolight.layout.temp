import React, { useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperRef } from 'swiper/react'
import { useProduct } from '../../Store'
import style from './Gallery.module.scss'
import 'swiper/scss'

interface CustomWindow extends Window {
    showModalMsg: (title: string, message: string) => void
}

declare let window: CustomWindow

const Gallery: React.FC = function () {
    const product = useProduct(state => state.current)
    const series = useProduct(state => state.series)

    const { gallary, image, paginationContainer,
        pagination, bullet, bullet_active,
        navigation, swiper, favorite, badge,
        favorite_selected, pagination_hide } = style

    const swiperRef = React.useRef<SwiperRef | null>(null)
    const prevRef = React.useRef<HTMLButtonElement>(null)
    const nextRef = React.useRef<HTMLButtonElement>(null)

    const hanlerPrevClick = () => { swiperRef.current && swiperRef.current.swiper.slidePrev() }
    const hanlerNextClick = () => { swiperRef.current && swiperRef.current.swiper.slideNext() }

    const [slidesCount, setSlidesCount] = useState<number | null>(0)
    const [slideCurrent, setSlideCurrent] = useState<number | null>(1)
    const [isFavorite, setFavorite] = useState<boolean | null>(false)

    return (
        <div className={gallary}>
            <span className={badge}>черная пятница</span>
            <Swiper className={swiper}
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                grabCursor
                observer
                observeParents
                observeSlideChildren
                watchOverflow
                onSlideChange={(swiper) => {
                    setSlideCurrent(swiper.activeIndex + 1)
                }}
                onSwiper={() => {
                    const slidesCount = swiperRef.current
                        && swiperRef.current.swiper.slides.length
                    setSlidesCount(slidesCount)
                }}
                pagination={{
                    el: `.${pagination}`,
                    bulletClass: bullet,
                    bulletActiveClass: bullet_active,
                    clickable: true,
                }}>
                <button type="button"
                    onClick={() => {
                        setFavorite(!isFavorite)

                        if (!isFavorite) {
                            window.showModalMsg(`${series.title}`, "Добавлен в избранное")
                        }
                    }}
                    className={isFavorite ? `${favorite} ${favorite_selected}` : favorite}></button>
                <SwiperSlide>
                    <div className={image}>
                        <img src={product.image} alt="" loading="lazy" />
                    </div>
                </SwiperSlide>
            </Swiper>
            <div className={paginationContainer}>
                {slidesCount && slidesCount > 1 ?
                    <button ref={prevRef}
                        className={navigation}
                        onClick={hanlerPrevClick}>{slideCurrent}</button>
                    : null}
                <div className={
                    slidesCount && slidesCount > 1
                        ? `${pagination}`
                        : `${pagination} ${pagination_hide}`
                }></div>
                {slidesCount && slidesCount > 1 ?
                    <button ref={nextRef}
                        className={navigation}
                        onClick={hanlerNextClick}>{slidesCount}</button>
                    : null}
            </div>
        </div>
    )
}

export default Gallery
