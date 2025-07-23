import { Editor } from '@tinymce/tinymce-react'
import { useRef, useState } from 'react'
import colors from '../../constants/colors'

type Props = {
  value: string
  onChange: (content: string) => void
}

const DescriptionInput = ({ value, onChange }: Props) => {
  const editorRef = useRef<Editor | null>(null)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

  const addNewBlock = (editor: any) => {
    const blockId = `custom-block-${Date.now()}`
    editor.insertContent(
      `<div id="${blockId}" class="custom-block" contenteditable="true" onclick="this.focus()">Введіть текст тут...</div>`
    )
    setActiveBlockId(blockId)
  }

  const updateBlockStyle = () => {
    const editor: any = editorRef.current
    const block = editor.getBody().querySelector(`#${activeBlockId}`)
    if (block) {
      block.style.backgroundColor = '#F000000'
      block.style.borderRadius = `10px`
    }
  }

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_API_KEY}
      value={value}
      onEditorChange={onChange}
      onInit={(_evt, editor) => {
        editorRef.current = editor

        editor.ui.registry.addButton('insertBlock', {
          text: 'Додати блок',
          onAction: () => addNewBlock(editor),
        })

        editor.ui.registry.addSplitButton('highlightList', {
          text: 'Колір списку',
          icon: 'forecolor',
          onAction: () => {
            const color = prompt('Оберіть колір (наприклад, #FF0000 або red):')
            if (color) editor.formatter.apply('highlightList', { value: color })
          },
          fetch: (callback: any) => {
            const colors = [
              { type: 'choiceitem', text: 'Червоний', value: '#FF0000' },
              { type: 'choiceitem', text: 'Синій', value: '#0000FF' },
              { type: 'choiceitem', text: 'Зелений', value: '#00FF00' },
              { type: 'choiceitem', text: 'Помаранчевий', value: '#FFA500' },
            ]
            callback(colors)
          },
          onItemAction: (_: any, value: string) => {
            editor.formatter.apply('highlightList', { value })
          },
        })

        editor.formatter.register('highlightList', {
          inline: 'span',
          selector: 'li',
          styles: { color: '%value' },
        })
      }}
      init={{
        height: '500px',
        width: '100%',
        skin: 'oxide-dark',
        content_css: 'dark',
        directionality: 'ltr',
        menubar: true,
        resize: true,
        placeholder: 'text...',
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | highlightList | backgroundColor | image | insertBlock | blockSettings | help | link | touchtext',
        content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
          .custom-block { background-color: ${colors.grey}; border-radius: 10px; padding: 10px; }
          .touch-text { color: #F0B90B; text-decoration: none; cursor: pointer; position: relative; font-weight: bold; }
          .touch-text:hover::after {
            content: attr(data-description);
            position: absolute;
            background: #444;
            color: #fff;
            padding: 5px;
            border-radius: 5px;
            bottom:15px;
            left: 0;
            white-space: nowrap;
            font-size: 12px;
          }
        `,
        setup: (editor: any) => {
          editor.ui.registry.addButton('blockSettings', {
            text: 'Редагувати блок',
            onAction: () => updateBlockStyle(),
          })

          editor.ui.registry.addButton('touchtext', {
            text: 'Touch Text',
            onAction: () => {
              const selectedText = editor.selection.getContent({
                format: 'text',
              })
              if (!selectedText) {
                alert('Please select a word or phrase to add a description.')
                return
              }

              const description = prompt('Enter description for this word:')
              if (!description) return

              const textTag = `<span class="touch-text" data-description="${description}">${selectedText}</span>`
              editor.insertContent(textTag)
            },
          })
        },
      }}
    />
  )
}

export default DescriptionInput