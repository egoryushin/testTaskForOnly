import gsap from 'gsap'
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import * as styles from './circle.module.scss'

interface CircleAnimationProps {
	numbers: number[] // массив чисел для отображеня
	currentSlide: number // текущий слайд
	onRotate: (index: number) => void // для вращения
}
const Circle = forwardRef<HTMLDivElement, CircleAnimationProps>(
	({ numbers, onRotate, currentSlide }, ref) => {
		// state для скрытия цифр в круге
		const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

		// константы для удобства чтения
		const radius = 265 // радиус круга
		const angle = 360 / numbers.length // угол между цифрами
		const animationDuration = 1 // длительность анимации
		const smothness = 'power2.out' // плавность анимации

		// расчет кординат на окружности
		const calculatedPosition = useCallback(
			(index: number, radius: number, angle: number, activeIndex: number) => {
				// для смещения цифры:
				const shiftNum = activeIndex !== null ? -angle * activeIndex : 0
				const miltiply = ((angle * index + shiftNum) * Math.PI) / 180 // расчет угла
				const x = radius * Math.cos(miltiply) // расчет координат x
				const y = radius * Math.sin(miltiply) // расчет координат y
				return { x, y }
			},
			[]
		)

		// Кэш позиции элементов
		const positions = useMemo(() => {
			return numbers.map((_, index) =>
				calculatedPosition(index, radius, angle, currentSlide)
			)
		}, [numbers, radius, angle, calculatedPosition])

		// Обработчик клика, для оптимизации используем хук useCallback
		const handleClick = useCallback(
			(index: number) => {
				if (ref && typeof ref !== 'function') {
					let targetRotation = -angle * index // поворт на заданное число
					gsap.to(ref.current, {
						rotation: targetRotation,
						duration: animationDuration,
						ease: smothness,
						onComplete: () => {
							onRotate(index)
						},
					})
					// чтобы цифры всегда были вертикально
					numbers.forEach((_, numIndex) => {
						const numberElement = ref.current?.querySelector(
							`.${styles.number}:nth-child(${numIndex + 1})`
						) as HTMLElement
						if (numberElement) {
							// numberElement.style.transform = `rotate(${-targetRotation}deg) trnaslate(-50%, -50%)`
							gsap.to(numberElement, {
								rotation: -targetRotation,
								duration: animationDuration,
								ease: smothness,
							})
						}
					})
				}
			},
			[numbers, onRotate, angle, ref]
		)

		// инициализация цифр на круге
		useEffect(() => {
			if (ref && typeof ref !== 'function') {
				numbers.forEach((number, index) => {
					const { x, y } = positions[index]
					const numberElement = ref.current?.querySelector(
						`.${styles.number}:nth-child(${index + 1})`
					) as HTMLElement // для цифры на кругу
					if (numberElement) {
						// gsap.set(numberElement, { x: x, y: y }) // начальные позиции цифр
						gsap.set(numberElement, {
							x: x,
							y: y,
							transform: `rotate(0deg) translate(-50%, -50%)`,
							transformOrigin: 'center center',
						})
					}
				})
			}
		}, [numbers, positions, ref])

		return (
			<div className={styles.circle} ref={ref}>
				{numbers.map((num, index) => {
					const { x, y } = positions[index]
					const isActive = index === currentSlide - 1
					const isHovered = hoveredIndex === index
					return (
						<div
							className={`${styles.number} ${isActive ? styles.active : ''} ${
								isHovered ? styles.hovered : ''
							}`}
							key={num}
							onClick={() => handleClick(index)}
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}>
							{isActive || isHovered ? (
								<div className={styles.numberActive}>{num}</div>
							) : (
								<div className={styles.dot} />
							)}
						</div>
					)
				})}
			</div>
		)
	}
)

export default Circle
