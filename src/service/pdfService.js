
import { Document, Page, Image, pdf as PDF, Text } from '@react-pdf/renderer'
import { saveAs } from 'file-saver';
import { toPng, toJpeg } from 'html-to-image'

const View = ({ src, padding, name }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={{ display: 'flex', justifyContent: "center", alignItems: "flex-start", padding, flexDirection: 'column' }}>
            <Text>{name}</Text>
            <Image src={src} />
        </Page>
    </Document>
)

/* Can't be lighter than PNG and have a lesser quality for the same weight */
// eslint-disable-next-line no-unused-vars
const html2Jpeg2Pdf = ({ element, quality = 1, name = "Gantt", padding = 24 }) => toJpeg(element, {
    pixelRatio: quality,
    width: element.getClientRects()[0].width + element.scrollLeftMax,
    heigt: element.getClientRects()[0].heigt + element.scrollTopMax,
    quality: .1
})
    .then(dataUrl => {
        PDF(<View src={dataUrl} padding={padding} name={name} />).toBlob().then(blob => saveAs(blob, (name || ("Gant_Chart_" + new Date().toLocaleString().replace(/[^\d]+/gi, '-'))) + '.pdf'))
    })
    
const html2Png2Pdf = ({ element, quality = 1, name = "Gantt", padding = 24 }) => toPng(element, {
    pixelRatio: quality,
    width: element.getClientRects()[0].width + element.scrollLeftMax,
    heigt: element.getClientRects()[0].heigt + element.scrollTopMax
})
    .then(dataUrl => {
        PDF(<View src={dataUrl} padding={padding} name={name} />).toBlob().then(blob => saveAs(blob, (name || ("Gant_Chart_" + new Date().toLocaleString().replace(/[^\d]+/gi, '-'))) + '.pdf'))
    })

export default html2Png2Pdf