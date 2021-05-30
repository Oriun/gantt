
import { Document, Page, Image, pdf as PDF } from '@react-pdf/renderer'
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image'

const View = ({ src }) => (
    <Document>
        <Page size="A4" orientation="landscape">
            <Image src={src} />
        </Page>
    </Document>
)

const html2Png2Pdf = ({ element, quality = 1, name }) => toPng(document.querySelector('main > div.view'), { pixelRatio: quality })
    .then(dataUrl => {
        PDF(<View src={dataUrl} />).toBlob().then(blob => saveAs(blob, (name || ("Gant_Chart_" + new Date().toLocaleString().replace(/[^\d]+/gi, '-'))) + 'pdf'))
    })

export default html2Png2Pdf