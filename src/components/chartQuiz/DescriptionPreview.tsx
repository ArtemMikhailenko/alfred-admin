import parse from 'html-react-parser'
import './description.css'

function DescriptionPreview({ text }: { text: string }) {
  return (
    <div className="lesson-html-web-scroll">
      <div className="lesson-html-web">{parse(text)}</div>
    </div>
  )
}

export default DescriptionPreview
