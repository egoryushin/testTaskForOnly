import gsap from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import SwiperCore from 'swiper'
import Circle from './components/Circle/Circle'
import CircleConrols from './components/CircleControls/CircleControls'
import Desktop from './components/Desktop/Desktop'
import Slider from './components/Slider/Slider'
import Title from './components/Title/Title'
import { dates } from './dates.js'
import './index.scss'

export interface DataItem {
	year: number
	description: string
}
const numbersCircle = [1, 2, 3, 4, 5, 6]
const initialData: DataItem[] = dates

const App: React.FC = () => {
	const [data, setData] = useState<DataItem[]>(initialData)
	const [currentSlide, setCurrentSlide] = useState(0)
	// реф для слайдера
	const swiperRef = useRef<SwiperCore | null>(null)
	// реф для круга
	const circleRef = useRef<HTMLDivElement>(null)
	// рефы для дат
	const startYearRef = useRef<HTMLDivElement>(null)
	const endYearRef = useRef<HTMLDivElement>(null)

	const slidesPerView = 4 // количество отображаемых слайдов

	const handleNext = () => {
		setCurrentSlide(prev => {
			const nextSlide = prev + slidesPerView
			return nextSlide >= data.length ? 0 : nextSlide
		})
	} // cледующий слайд
	const handlePrev = () => {
		setCurrentSlide(prev => {
			const prevSlide = prev - slidesPerView
			return prevSlide < 0 ? data.length - slidesPerView : prevSlide
		})
	} // предыдущий слайд
	const handleRotate = (index: number) => {
		const newSlide = index * slidesPerView
		setCurrentSlide(newSlide)
		if (swiperRef.current) swiperRef.current.slideTo(newSlide)
	} // поворот круга
	const handleSlideChange = (swiper: SwiperCore) => {
		setCurrentSlide(swiper.activeIndex)
	} // изменение слайдера

	// обновление круга при измении слайда
	useEffect(() => {
		if (circleRef.current) {
			const currentIndex = Math.floor(currentSlide / slidesPerView) // индекс текущего слайда
			const targetRotation = -currentIndex * (360 / numbersCircle.length)
			gsap.to(circleRef.current, {
				rotation: targetRotation,
				duration: 1,
				ease: 'power2.out',
			})
		}
	}, [currentSlide])

	// логика и отображение главных дат
	const getDateRange = () => {
		const startIndex = currentSlide
		const endIndex = Math.min(currentSlide + slidesPerView - 1, data.length - 1)
		const startYear = data[startIndex].year.toString()
		const endYear = data[endIndex].year.toString()

		return (
			<div className='date-range'>
				<div className='start-year' ref={startYearRef}>
					{startYear.split('').map((digit, index) => (
						<span key={index} className='digit'>
							{digit}
						</span>
					))}
				</div>
				<div className='end-year' ref={endYearRef}>
					{endYear.split('').map((digit, index) => (
						<span key={index} className='digit'>
							{digit}
						</span>
					))}
				</div>
			</div>
		)
	}

	// анимация главных дат
	useEffect(() => {
		if (startYearRef.current && endYearRef.current) {
			const startDigit = startYearRef.current.querySelectorAll('.digit')
			const endDigit = endYearRef.current.querySelectorAll('.digit')
			// первая дата
			startDigit.forEach((digit, index) => {
				gsap.fromTo(
					digit,
					{ y: -30, opacity: 0 }, // начальное состояние
					{ y: 0, opacity: 1, duration: 0.5, delay: index * 0.1 } // конечное состояние
				)
			})
			// вторая дата
			endDigit.forEach((digit, index) => {
				gsap.fromTo(
					digit,
					{ y: -30, opacity: 0 }, // начальное состояние
					{ y: 0, opacity: 1, duration: 0.5, delay: index * 0.1 } // конечное состояние
				)
			})
		}
	}, [currentSlide])

	return (
		<div className='container'>
			<Desktop>
				{getDateRange()}
				<Circle
					numbers={numbersCircle}
					onRotate={handleRotate}
					ref={circleRef}
					currentSlide={Math.floor(currentSlide / slidesPerView) + 1}
				/>
				<Title text='Исторические даты' />
				<CircleConrols
					currentSlide={Math.floor(currentSlide / slidesPerView) + 1}
					totalSlides={data.length}
					nextSlide={handleNext}
					prevSlide={handlePrev}
					slidesPerView={slidesPerView}
					swiperRef={swiperRef}
				/>
				<Slider
					data={data}
					currentSlide={currentSlide}
					slidesPerView={slidesPerView}
					swiperRef={swiperRef}
					onSlideChange={handleSlideChange}
				/>
			</Desktop>
		</div>
	)
}

export default App
