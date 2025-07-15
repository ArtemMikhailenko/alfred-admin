import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import styles from './DescriptionInput.module.css'

interface DescriptionInputProps {
  value: string
  onChange: (content: string) => void
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

  const addNewBlock = (editor: any) => {
    const blockId = `custom-block-${Date.now()}`
    editor.insertContent(
      `<div id="${blockId}" class="custom-block" contenteditable="true" onclick="this.focus()">Enter your text here...</div>`
    )
    setActiveBlockId(blockId)
  }

  const updateBlockStyle = () => {
    const editor = editorRef.current
    if (!editor || !activeBlockId) return
    
    const block = editor.getBody().querySelector(`#${activeBlockId}`)
    if (block) {
      block.style.backgroundColor = '#444444'
      block.style.borderRadius = '10px'
      block.style.padding = '16px'
    }
  }

  const editorConfig = {
    height: 'calc(100vh - 500px)',
    width: '100%',
    skin: 'oxide-dark',
    content_css: 'dark',
    directionality: 'ltr',
    menubar: true,
    resize: true,
    placeholder: 'Enter your quiz description...',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: [
      'undo redo | blocks | bold italic forecolor',
      'alignleft aligncenter alignright alignjustify',
      'bullist numlist outdent indent | removeformat',
      'highlightList | backgroundColor | image | insertBlock',
      'blockSettings | help | link | touchtext'
    ].join(' | '),
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #eaecef;
        background-color: #1f1f1f;
        margin: 20px;
      }
      .custom-block { 
        background-color: #444444;
        border-radius: 12px;
        padding: 16px;
        margin: 16px 0;
        border: 2px solid #515155;
        transition: all 0.2s ease;
      }
      .custom-block:hover {
        border-color: #f0b90b;
        box-shadow: 0 4px 12px rgba(240, 185, 11, 0.1);
      }
      .touch-text { 
        color: #f0b90b;
        text-decoration: underline;
        cursor: pointer;
        position: relative;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      .touch-text:hover {
        color: #f09d01;
        text-decoration: none;
      }
      .touch-text:hover::after {
        content: attr(data-description);
        position: absolute;
        background: #262626;
        color: #eaecef;
        padding: 8px 12px;
        border-radius: 8px;
        bottom: 25px;
        left: 0;
        white-space: nowrap;
        font-size: 14px;
        z-index: 1000;
        border: 1px solid #515155;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      p { margin: 0 0 16px 0; }
      h1, h2, h3, h4, h5, h6 { 
        color: #f0b90b;
        margin: 24px 0 16px 0;
        font-weight: 700;
      }
      ul, ol { 
        margin: 16px 0;
        padding-left: 24px;
      }
      li { 
        margin: 8px 0;
      }
      blockquote {
        border-left: 4px solid #f0b90b;
        margin: 16px 0;
        padding: 16px 20px;
        background-color: #333439;
        border-radius: 0 8px 8px 0;
      }
      code {
        background-color: #333439;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
      }
      pre {
        background-color: #333439;
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 16px 0;
      }
    `,
    setup: (editor: any) => {
      editor.ui.registry.addButton('insertBlock', {
        text: 'Add Block',
        tooltip: 'Insert custom styled block',
        icon: 'plus',
        onAction: () => addNewBlock(editor),
      })

      editor.ui.registry.addButton('blockSettings', {
        text: 'Edit Block',
        tooltip: 'Edit selected block styles',
        icon: 'settings',
        onAction: () => updateBlockStyle(),
      })

      editor.ui.registry.addButton('touchtext', {
        text: 'Touch Text',
        tooltip: 'Add interactive text with description',
        icon: 'help',
        onAction: () => {
          const selectedText = editor.selection.getContent({ format: 'text' })
          if (!selectedText) {
            editor.windowManager.alert('Please select text first to add a description.')
            return
          }

          editor.windowManager.open({
            title: 'Add Touch Text Description',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'input',
                  name: 'description',
                  label: 'Description',
                  placeholder: 'Enter description for this text...'
                }
              ]
            },
            buttons: [
              {
                type: 'cancel',
                text: 'Cancel'
              },
              {
                type: 'submit',
                text: 'Add',
                primary: true
              }
            ],
            onSubmit: (api: any) => {
              const data = api.getData()
              if (data.description) {
                const textTag = `<span class="touch-text" data-description="${data.description}">${selectedText}</span>`
                editor.insertContent(textTag)
              }
              api.close()
            }
          })
        },
      })

      editor.ui.registry.addSplitButton('highlightList', {
        text: 'Text Color',
        icon: 'forecolor',
        tooltip: 'Change text color',
        onAction: () => {
          editor.windowManager.open({
            title: 'Choose Text Color',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'input',
                  name: 'color',
                  label: 'Color',
                  placeholder: 'Enter color (e.g., #FF0000 or red)'
                }
              ]
            },
            buttons: [
              {
                type: 'cancel',
                text: 'Cancel'
              },
              {
                type: 'submit',
                text: 'Apply',
                primary: true
              }
            ],
            onSubmit: (api: any) => {
              const data = api.getData()
              if (data.color) {
                editor.formatter.apply('highlightList', { value: data.color })
              }
              api.close()
            }
          })
        },
        fetch: (callback: any) => {
          const colors = [
            { type: 'choiceitem', text: 'Red', value: '#FF0000' },
            { type: 'choiceitem', text: 'Blue', value: '#0000FF' },
            { type: 'choiceitem', text: 'Green', value: '#00FF00' },
            { type: 'choiceitem', text: 'Orange', value: '#FFA500' },
            { type: 'choiceitem', text: 'Yellow', value: '#F0B90B' },
            { type: 'choiceitem', text: 'Purple', value: '#8B00FF' },
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
    },
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Quiz Description</h3>
        <p className={styles.subtitle}>
          Create rich content with interactive elements
        </p>
      </div>
      
      <div className={styles.editorWrapper}>
        <Editor
          apiKey={process.env.REACT_APP_TINY_API_KEY}
          value={value}
          onEditorChange={onChange}
          onInit={(_evt, editor) => {
            editorRef.current = editor
          }}
          init={editorConfig}
        />
      </div>
    </div>
  )
}

export default DescriptionInput