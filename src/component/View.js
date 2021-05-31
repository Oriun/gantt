import { Fragment, useRef, useState, useEffect } from 'react'
import './View.scss'
import DayJs from 'dayjs'
import { ReactComponent as Edit } from '../assets/edit.svg'

const dateSort = (a, b) => a.getTime() - b.getTime()

const EditableText = ({ value, onChange, placeholder, Element }) => {
    const [state, setS] = useState(false)
    const ref = useRef(null)
    useEffect(() => ref.current?.focus?.(), [state])
    if (!state) return (
        <Element onClick={() => setS(true)}>
            {value}
            <Edit style={{ fill: '#333', width: 20, height: 20 }} />
        </Element>
    )

    return <Element >
        <input type="text" placeholder={placeholder} ref={ref} defaultValue={value} onKeyDown={e => e.key === 'Enter' && onChange(ref.current?.value || value) && setS(false)} />
    </Element>
}

const View = ({ value = [], name, setName }) => {
    const [period, setP] = useState('month')
    if (!value.length) return <><EditableText Element={({ children, onClick }) => <h2 className='view-title' onClick={onClick}>{children}</h2>} value={name} key={name} onChange={setName} /><div className="gantt" /></>
    // if (!value.length) return <><h2>{name}</h2><div className="gantt" /></>
    const formated = value.map(a => {
        const dates = [new Date(a.start), new Date(a.end)].sort(dateSort)
        return { ...a, start: dates[0], end: dates[1] }
    })
    const [minDate, maxDate] = (() => {
        const datesList = formated.flatMap(a => ([a.start, a.end])).sort(dateSort)
        return [DayJs(datesList[0]).startOf('month'), DayJs(datesList[datesList.length - 1]).endOf('month')]
    })()
    const columns = Math.floor(DayJs(maxDate).diff(DayJs(minDate), period, true)) + 1

    const getStart = start => {
        return Math.ceil(DayJs(start).startOf('month').diff(minDate, 'month', true))
    }
    const getEnd = end => {
        return Math.ceil(DayJs(end).endOf('month').diff(minDate, 'month', true))
    }
    const getLength = (start, end) => {
        return 100 + '%'
    }
    const Header = ({ row, up }) => new Array(columns).fill().map((a, i) => (
        <div className={"gantt-period " + (up ? 'up' : 'down')} key={i} style={{ gridRow: `${row}/${row + 1}`, gridColumn: `${2 + i}/${2 + i}` }}>
            {minDate.add(i, 'month').format('MMM')}
        </div>
    ))
    // const Head = new Array(columns).fill()
    //     .map((a, i) => minDate.add(i, 'month').format('YYYY'))
    //     .reduce((prev, cur, i) => {
    //         if(){ }
    //     }, [])
    //     .map((a, i) => (
    //         <div className="gantt-period" style={{ gridRow: `1/${formated.length + 3}`, gridColumn: `${2 + i}/${2 + i}` }} />
    //     ))
    return (
        <>
            <EditableText Element={({ children, onClick }) => <h2 className='view-title' onClick={onClick}>{children}</h2>} value={name} key={name} onChange={setName} />
            <div className="gantt noscrollbar" style={{ gridTemplateColumns: `auto repeat(${columns}, 1fr)` }}>
                {new Array(columns).fill().map((a, i) => (
                    <div className="gantt-background" key={i} style={{ gridRow: `1/${formated.length + 4}`, gridColumn: `${2 + i}/${2 + i}`, backgroundColor: i % 2 && '#f8f8f8' }} />
                ))}
                <Header row={2} up />
                {formated.map((a, i) => (
                    <Fragment key={i}>
                        <div className="task-title" style={{ gridColumn: '1/2', gridRow: `${3 + i}/${3 + i}`, paddingLeft: a.level * 24 }}>{a.name}</div>
                        {(!formated[i + 1] || formated[i + 1].level <= formated[i].level) && <div className="task-duration" style={{
                            backgroundColor: a.color,
                            gridRow: `${3 + i}/${3 + i}`,
                            gridColumn: (getStart(a.start) + 2) + ' / ' + (getEnd(a.end) + 2),
                            width: getLength(a.start, a.end)
                        }} />}
                    </Fragment>
                ))}
                {formated.length > 15 && <Header row={formated.length + 3} />}
            </div>
        </>
    )
}

export default View
