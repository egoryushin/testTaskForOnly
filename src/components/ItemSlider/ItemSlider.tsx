import React from 'react'
import * as styles from './Item.module.scss'

interface ItemSliderProps {
	year: number
	description: string
}

const ItemSlider: React.FC<ItemSliderProps> = ({ year, description }) => {
	return (
		<div className={styles.item}>
			<span className={styles.year}>{year}</span>
			<p className={styles.description}>{description}</p>
		</div>
	)
}

export default ItemSlider
