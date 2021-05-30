import { useState, useRef, useEffect } from 'react'
import './Edit.scss'
import { FreshRow, CompleteRow } from './Row'

const Edit = ({ value = [], setValue = console.log }) => {
    const [edited, setE] = useState(null)
    const ref = useRef(null)
    const modify = index => e => {
        e.stopPropagation()
        setE({
            index,
            ...value[index]
        })
    }
    const createChild = index => e => {
        e.stopPropagation()
        const parent = value[index]
        const curLvl = parent.level || 0
        if (!value[index + 1]) return setE({
            index: index + 1,
            level: curLvl + 1,
        })

        if ((value[index + 1].level || 0) <= curLvl) return setE({
            index: index + 1,
            level: curLvl + 1
        })

        for (let i = index + 1; i < value.length; i++)
            if ((value[i].level || 0) <= curLvl) return setE({
                index: i,
                level: curLvl + 1
            })
        return setE({
            index: value.length,
            level: curLvl + 1,
        })
    }
    const suppressWithChild = (index, list) => () => {
        let k = index + 1
        while (list[k] && list[k].level > (list[index].level || 0)) {
            k++
        }
        setValue(list.filter((d, j) => !(j >= index && j < k)))
        setE(null)
    }
    var list = value;
    if (edited) {
        if (edited.name) list = value
        else list = [...value.slice(0, edited.index), undefined, ...value.slice(edited.index)]
    }
    return (
        <div className="edit-container noscrollbar">
            <h2 className='edit-title'>Edit</h2>
            {list?.map((a, i) => {
                if (i === edited?.index) {
                    return <FreshRow ref={ref} key={i}
                        {...edited}
                        onComplete={c => {
                            setValue(() => { list[i] = { ...a, ...c }; return list })
                            i === list.length - 1 ? setE({ index: i + 1 }) : setE(null)
                        }}
                        onSuppress={suppressWithChild(i, list)}
                    />
                }
                return <CompleteRow {...a} key={i} askEditing={modify(i)} createChild={createChild(i)} />
            })}
            {!edited && <button type='button' className='no-task-button' onClick={() => setE({ index: value.length, level: 0 })}>Ajouter une tâche</button>}
        </div>
    )
}

export default Edit