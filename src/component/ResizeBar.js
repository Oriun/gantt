import { useState, useEffect } from 'react'

const track = (set, mouse) => {
    const start = { ...mouse }
    return e => {
        e.preventDefault()
        set({ x: e.clientX - start.x, y: e.clientY - start.y })
    }
}
const ResizeBar = ({ style, className, set, end, start }) => {
    const [mouseDown, setMS] = useState()
    useEffect(() => {
        if (!mouseDown) return
        start?.(mouseDown)
        const t = track(set, mouseDown)
        document.body.addEventListener('mousemove', t)
        document.body.addEventListener('mouseup', e => setMS(!1) || end?.({ x: e.clientX, y: e.clientY }), { once: true })
        return () => document.body.removeEventListener('mousemove', t)
    }, [mouseDown, set, end, start])
    return (
        <div style={style} className={className} onMouseDown={e => e.preventDefault(setMS({ x: e.clientX, y: e.clientY }))}>
        </div>
    )
}

export default ResizeBar
