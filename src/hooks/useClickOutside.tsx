
import { RefObject, useEffect } from 'react'

const useClickOutside = (ref: RefObject<HTMLElement>, cb: () => void) => {
	const handleClick = (e: any) => {
		if (ref.current && !ref.current.contains(e.target)) {
			cb()
		}
	}
	useEffect(() => {
		document.addEventListener('mousedown', handleClick)
		return () => {
			document.removeEventListener('mousedown', handleClick)
		}
	})
}

export default useClickOutside
