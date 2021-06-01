import { useEffect, useState } from 'react'
import Edit from './component/Edit'
import './App.scss'
import { read, save } from './service/zipService'
import pdfExport from './service/pdfService'
import View from './component/View'
import ResizeBar from './component/ResizeBar'
import { ReactComponent as Arrow } from './assets/arrow.svg'
import { ReactComponent as Import } from './assets/import.svg'
import { ReactComponent as Save } from './assets/save.svg'
import { ReactComponent as Export } from './assets/pdf.svg'
import { ReactComponent as Undo } from './assets/back-arrow.svg'

const App = () => {
  const [gantt, setGantt] = useState([])
  const [history, setH] = useState([[]])
  const [hIndex, setHI] = useState(0)
  const [EditVisible, setEV] = useState(!0)
  const [width, setW] = useState(450)
  const [name, setN] = useState("View")
  const modifyGantt = a => {
    const ng = typeof a === 'function' ? a([...history]) : a
    // const deepCheck = ng.flatMap((a, i) => Object.entries(a).map(([key, value]) => history[history.length - 1][i]?.[key] === value))
    if (ng === history[history.length - 1]) return console.log('no change')
    setGantt([...ng])
    setH(b => [...b.slice(0, hIndex || b.length), ng])
    setHI(0)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setGantt([...history[history.length - 1 + hIndex]]), [hIndex])
  const askFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = e => read(e.target.files[0]).then(({ name, data }) => modifyGantt(data) && setN(name)).catch(console.error)
    input.click()
  }
  return (
    <>
      <header>
        <h1>Gantt Online</h1>
        <div>
          <Undo onClick={() => setHI(a => a - 1)} style={{ cursor: 'pointer', width: 20, height: 20, margin: '0 8px', fill: history.length - 1 + hIndex ? '#555' : '#aaa' }} title="Annuler" />
          <Undo onClick={hIndex && (() => setHI(a => a + 1))} style={{ cursor: 'pointer', width: 20, height: 20, margin: '0 8px', fill: hIndex ? '#555' : '#aaa', transform: 'scaleX(-1)' }} title="Refaire" />
          <Import onClick={askFile} style={{ cursor: 'pointer', width: 24, height: 24, margin: '0 8px 0 40px', fill: '#555' }} title="Importer un fichier" />
          <Save onClick={() => save(gantt, name)} style={{ cursor: 'pointer', width: 24, height: 24, margin: '0 8px', fill: '#555' }} title="Télécharger le ficher" />
          <Export
            style={{ cursor: 'pointer', width: 24, height: 24, margin: '0 0 0 8px', fill: '#555' }}
            onClick={() => pdfExport({ element: document.querySelector('main > div.view > .gantt'), quality: 3, name })} title="Exporter en pdf" />
        </div>
      </header>
      <main>
        <div className={"edit " + (EditVisible ? "visible" : "")} >
          {EditVisible && <ResizeBar
            style={{
              width: 16,
              height: '100%',
              position: 'absolute',
              top: 0,
              right: -14,
              cursor: 'ew-resize'
            }}
            set={({ x }) => document.documentElement.style.setProperty('--edit-width', (width + x) + 'px')}
            end={() => setW(parseInt(document.documentElement.style.getPropertyValue('--edit-width')))}
          />}
          <Arrow
            className='arrow'
            style={{ transform: 'rotate(' + (EditVisible ? '180deg' : '0deg') + ')' }}
            onClick={() => setEV(a => !a)}
          />
          <Edit value={gantt} setValue={modifyGantt} key={hIndex} />
        </div>
        <div className="view" onClick={EditVisible ? (() => setEV(false)) : undefined}>
          <View value={gantt} name={name} setName={a => setN(a) || true} />
        </div>
      </main>
      <footer>Made for his dad by&nbsp;<a href=/*"https://emmanuel.nuiro.me"*/"mailto:emmanuel@nuiro.me" target="_blank" rel="noreferrer">Emmanuel Nuiro</a>.</footer>
    </>
  )
}

export default App
