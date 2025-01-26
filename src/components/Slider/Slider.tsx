import React, { useEffect, useState } from 'react'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { DataItem } from '../../App'
import ItemSlider from '../ItemSlider/ItemSlider'
import * as styles from './slider.module.scss'

interface SliderProps {
	data: DataItem[] // Данные для слайдов
	currentSlide: number // Текущий слайд
	slidesPerView: number // Кол-во слайдов на экране
	swiperRef: React.RefObject<SwiperCore | null> // Ссылка на Swiper
	onSlideChange: (swiper: SwiperCore) => void // Обработчик изменения слайдов
}

const Slider: React.FC<SliderProps> = ({
	data,
	currentSlide,
	slidesPerView,
	swiperRef,
	onSlideChange,
}) => {
	// для отображения элементов управления
	const [controlVisibility, setControlVisibility] = React.useState({
		isBeginning: true,
		isEnd: false,
	})

	// для управления слайдером на мобильных устройствах
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
	// активный слайд
	const [activeIndex, setActiveIndex] = useState(currentSlide)

	// константы для стрелок управления
	const arrowLeft = '&#10094;'
	const arrowRight = '&#10095;'

	useEffect(() => {
		swiperRef.current &&
			setControlVisibility({
				isBeginning: swiperRef.current.isBeginning,
				isEnd: swiperRef.current.isEnd,
			})
	}, [currentSlide, swiperRef])

	// useEffect для ресайза окна
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleNext = () => {
		swiperRef.current && swiperRef.current.slideNext()
	}

	const handlePrev = () => {
		swiperRef.current && swiperRef.current.slidePrev()
	}

	const handleDotClicks = (index: number) => {
		const targetSlide = index * 4
		swiperRef.current && swiperRef.current.slideTo(targetSlide)
	}

	return (
		<div className={styles.sliderContainer}>
			<Swiper
				spaceBetween={30}
				slidesPerView={isMobile ? 1.7 : slidesPerView}
				pagination={{ clickable: true }}
				initialSlide={currentSlide}
				speed={1000}
				onSwiper={swiper => {
					swiperRef.current = swiper
					setControlVisibility({
						isBeginning: swiper.isBeginning,
						isEnd: swiper.isEnd,
					})
				}}
				onSlideChange={swiper => {
					onSlideChange(swiper)
					setActiveIndex(swiper.activeIndex)
					setControlVisibility({
						isBeginning: swiper.isBeginning,
						isEnd: swiper.isEnd,
					})
				}}>
				{data.map((item, index) => (
					<SwiperSlide key={index}>
						<div
							className={`${styles.slide} ${
								index === activeIndex + 1 ? styles.blurredSlide : ''
							}`}>
							<ItemSlider year={item.year} description={item.description} />
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<div className={styles.sliderControls}>
				<button
					className={`${styles.arrowBtn} ${
						controlVisibility.isBeginning ? styles.hidden : ''
					}`}
					dangerouslySetInnerHTML={{ __html: arrowLeft }}
					onClick={handlePrev}
				/>
				<button
					className={`${styles.arrowBtn} ${
						controlVisibility.isEnd ? styles.hidden : ''
					}`}
					dangerouslySetInnerHTML={{ __html: arrowRight }}
					onClick={handleNext}
				/>
			</div>
			<div className={styles.pagination}>
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className={`${styles.paginationDot} ${
							Math.floor(activeIndex / 4) === index ? styles.active : ''
						}`}
						onClick={() => handleDotClicks(index)}
					/>
				))}
			</div>
		</div>
	)
}

export default Slider
