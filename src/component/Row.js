import { useEffect, useRef } from 'react'
import "./Row.scss"
import { ReactComponent as UnderArrow } from '../assets/add.svg'
// import { ReactComponent as Tree } from '../assets/tree-structure.svg'
// import { ReactComponent as UnderArrow } from '../assets/arrow-left-broken-angle.svg'
// import { ReactComponent as Settings } from '../assets/settings.svg'
import { ReactComponent as Duplicate } from '../assets/duplicate.svg'
export const FreshRow = ({
    onComplete = console.log,
    color = "#ff5e13",
    name,
    start,
    end,
    onSuppress,
    level = 0,
    modify
}) => {
    const ref = useRef(null)
    const complete = e => {
        e.preventDefault?.()
        console.log('complete')
        const values = Object.fromEntries(
            [...e.target]
                .filter(a => a.name)
                .map(a => ([a.name, a.value]))
        )
        if (!values.name) return window.alert('Vous devez nommer cette tâche.')
        onComplete({ level, ...values })
    }
    useEffect(() => ref.current?.focus?.())
    return (
        <form className="fresh" onSubmit={complete} style={{ marginLeft: level * 24 }}>
            <input className="name" name="name" ref={ref} type="text" placeholder="Nom de la tâche" defaultValue={name} onKeyDown={e => e.key === 'Enter' && complete({ target: e.target.parentElement })} />
            <input className="color" name="color" type="color" defaultValue={color} />
            <input className="date start" name="start" type="date" defaultValue={start || new Date().toJSON().slice(0, 10)} />
            <input className="date end" name="end" type="date" defaultValue={end || new Date(Date.now() + 86400000).toJSON().slice(0, 10)} />
            <button type="button" className="add" onClick={onSuppress}>{modify ? "Supprimer" : "Annuler"}</button>
            <button type="submit" className="add">{modify ? "Confirmer" : "Ajouter"}</button>
        </form>
    )
}

const formatDate = date => String(date.getDate()).padStart(2, 0) + '/' + String((date.getMonth() % 12) + 1).padStart(2, 0)
export const CompleteRow = ({
    askEditing = console.log,
    duplicate = console.log,
    createChild = console.log,
    color,
    name,
    start,
    end,
    level = 0
}) => {
    return <div className="row" style={{ marginLeft: level * 24 }} onClick={askEditing}>
        <div style={{ backgroundColor: color }} />
        <div className="name">
            <span>{name}</span>
        </div>
        <UnderArrow className="action move" onClick={createChild} />
        <Duplicate className="action modiffy" onClick={duplicate} />
        <div className='date'>{formatDate(new Date(start)) + " - " + formatDate(new Date(end))}
        </div>
    </div>
}