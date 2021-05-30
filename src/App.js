import { useEffect, useState } from 'react'
import Edit from './component/Edit'
import './App.scss'
import { read, save } from './service/zipService'
import pdfExport from './service/pdfService'

const App = () => {
  const [gantt, setGantt] = useState([])
  const [history, setH] = useState([[]])
  const [hIndex, setHI] = useState(0)
  const [EditVisible, setEV] = useState(!0)

  const modifyGantt = a => {
    const ng = typeof a === 'function' ? a([...gantt]) : a
    if (ng === gantt) return
    setGantt([...ng])
    setH(b => [...b.slice(0, hIndex || b.length), ng])
    setHI(0)
  }
  useEffect(() => setGantt([...history[history.length - 1 + hIndex]]), [hIndex])

  return (
    <>
      <header>
        <h1>Gantt Online</h1>
        <div>
          <button type="button" onClick={() => setHI(a => a - 1)}>Previous</button>
          {hIndex < 0 && <button type="button" onClick={() => setHI(a => a + 1)}>Next</button>}
          <input type="file" onChange={e => read(e.target.files[0]).then(modifyGantt).catch(console.error)} />
          <button type="button" onClick={() => save(gantt)}>Save</button>
          <button type="button" onClick={() => pdfExport({ element: document.querySelector('main > div.view > gantt'), quality: 6 })}>Export</button>
        </div>
      </header>
      <main>
        <div className={"edit " + (EditVisible ? "visible" : "")}>
          <img
            className='arrow'
            alt=''
            src='/img/arrow.svg'
            height='20'
            width='20'
            style={{ transform: 'rotate(' + (EditVisible ? '180deg' : '0deg') + ')' }}
            onClick={() => setEV(a => !a)}
          />
          <Edit value={gantt} setValue={modifyGantt} key={hIndex} />
        </div>
        <div className="view">
          <h2>View</h2>
          <div className="gantt">
            {JSON.stringify(gantt)}
          </div>
        </div>
      </main>
      <footer>Made with heart by&nbsp;<a href="https://emmanuel.nuiro.me" target="_blank" rel="noreferrer">Emmanuel Nuiro</a>.</footer>
    </>
  )
}

export default App
