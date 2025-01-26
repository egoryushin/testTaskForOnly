import React, { useCallback } from 'react'
import SwiperCore from 'swiper'
import * as styles from './controls.module.scss'

interface CircleControlsProps {
	currentSlide: number
	totalSlides: number
	nextSlide: () => void
	prevSlide: () => void
	slidesPerView: number
	swiperRef: React.RefObject<SwiperCore | null> // Ссылка на Swiper
}

const CircleConrols: React.FC<CircleControlsProps> = ({
	currentSlide,
	totalSlides,
	nextSlide,
	prevSlide,
	slidesPerView,
	swiperRef,
}) => {
	// константы для стрелок управления
	const arrowLeft = '&#10094;'
	const arrowRight = '&#10095;'

	const goToSlide = useCallback(
		(direction: 'next' | 'prev') => {
			if (!swiperRef.current) return

			const currentIndex = swiperRef.current.activeIndex
			let newIndex

			if (direction === 'next') {
				newIndex = currentIndex + slidesPerView
				newIndex = newIndex >= totalSlides ? 0 : newIndex
			} else {
				newIndex = currentIndex - slidesPerView
				newIndex = newIndex < 0 ? totalSlides - slidesPerView : newIndex
			}
			swiperRef.current.slideTo(newIndex)
		},
		[slidesPerView, totalSlides, swiperRef]
	)

	const handleNext = useCallback(() => {
		nextSlide()
		goToSlide('next')
	}, [goToSlide, nextSlide])

	const handlePrev = useCallback(() => {
		prevSlide()
		goToSlide('prev')
	}, [goToSlide, prevSlide])

	return (
		<div className={styles.controlsContainer}>
			<span className={styles.slideNumber}>
				{currentSlide} / {totalSlides / slidesPerView}
				{/* текущая страница / всего страниц */}
			</span>
			<div className={styles.controlsNavigation}>
				<button className={styles.arrowBtn} onClick={handlePrev}>
					<div
						className={styles.arrowCircleLeft}
						dangerouslySetInnerHTML={{ __html: arrowLeft }}
					/>
				</button>
				<button className={styles.arrowBtn} onClick={handleNext}>
					<div
						className={styles.arrowCircleRight}
						dangerouslySetInnerHTML={{ __html: arrowRight }}
					/>
				</button>
			</div>
		</div>
	)
}

export default CircleConrols
