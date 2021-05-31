import JSZip from 'jszip'
import { saveAs } from 'file-saver';

export const save = (gantt, name) => new JSZip()
    .file('gantt.json', JSON.stringify({
        name: name || "Gantt",
        data: gantt.map(({ color, level, name, start, end }) => ({ c: color, n: name, l: level, s: start, e: end }))
    }))
    .generateAsync({ type: "blob" })
    .then(blob => saveAs(blob, (name || ("Gant_Chart_" + new Date().toLocaleString().replace(/[^\d]+/gi, '-'))) + '.ogan'))

export const read = file => new JSZip()
    .loadAsync(file)
    .then(zip => zip.file("gantt.json").async("string"))
    .then(str => JSON.parse(str))
    .then(({ name, data }) => ({ name, data: data.map(({ c, l, n, s, e }) => ({ name: n, start: s, end: e, color: c, level: l })) }))