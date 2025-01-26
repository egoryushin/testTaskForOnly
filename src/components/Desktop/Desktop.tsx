import React from 'react'
import * as styles from './line.module.scss'

interface DesktopProps {
	children: React.ReactNode
}

const Desktop: React.FC<DesktopProps> = ({ children }) => {
	return (
		<>
			<div className={styles.horizontalLine}></div>
			<div className={styles.verticalLine}></div>
			<div className={styles.leftVerticalLine}></div>
			<div className={styles.rightVerticalLine}></div>
			{children}
		</>
	)
}

export default Desktop
