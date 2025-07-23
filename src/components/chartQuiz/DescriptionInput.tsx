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
      // Исправлено: было '#F000000', должно быть корректным цветом
      block.style.backgroundColor = colors.greyhard
      block.style.borderRadius = '10px'
    }
  }

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_API_KEY}
      value={value}
      onEditorChange={onChange}
      onInit={(_evt, editor) => {
        editorRef.current = editor

        // Кнопка для добавления блока
        editor.ui.registry.addButton('insertBlock', {
          text: 'Додати блок',
          onAction: () => addNewBlock(editor),
        })

        // Кнопка для редактирования блока
        editor.ui.registry.addButton('blockSettings', {
          text: 'Редагувати блок',
          onAction: () => updateBlockStyle(),
        })

        // Кнопка Touch Text
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

        // Улучшенная кнопка для цвета списков
        editor.ui.registry.addSplitButton('highlightList', {
          text: 'Колір списку',
          icon: 'forecolor',
          onAction: () => {
            const color = prompt('Оберіть колір (наприклад, #FF0000 або red):')
            if (color) {
              editor.formatter.apply('highlightList', { value: color })
            }
          },
          fetch: (callback: any) => {
            const colorOptions = [
              { type: 'choiceitem', text: 'Червоний', value: '#FF0000' },
              { type: 'choiceitem', text: 'Синій', value: '#0000FF' },
              { type: 'choiceitem', text: 'Зелений', value: '#00FF00' },
              { type: 'choiceitem', text: 'Помаранчевий', value: '#FFA500' },
              { type: 'choiceitem', text: 'Жовтий', value: colors.yellow },
              { type: 'choiceitem', text: 'Сірий', value: colors.grey },
            ]
            callback(colorOptions)
          },
          onItemAction: (_: any, value: string) => {
            editor.formatter.apply('highlightList', { value })
          },
        })

        // Регистрация форматтера для списков
        editor.formatter.register('highlightList', {
          inline: 'span',
          selector: 'li',
          styles: { color: '%value' },
        })
      }}
      init={{
        height: '500px', // Фиксированная высота вместо calc()
        width: '100%',
        skin: 'oxide-dark',
        content_css: 'dark',
        directionality: 'ltr',
        menubar: true,
        resize: true,
        placeholder: 'text...',
        
        // Обновленный список плагинов
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
          'help',
          'wordcount',
          'emoticons', // Добавлен для эмодзи
          'codesample', // Добавлен для блоков кода
        ],
        
        // Улучшенная панель инструментов
        toolbar: [
          'undo redo | blocks fontsize',
          'bold italic underline strikethrough | forecolor backcolor',
          'alignleft aligncenter alignright alignjustify',
          'bullist numlist outdent indent | removeformat',
          'link image media table | codesample emoticons',
          'insertBlock blockSettings | highlightList | touchtext',
          'searchreplace | visualblocks code fullscreen | help'
        ].join(' | '),
        
        // Обновленные стили контента
        content_style: `
          body { 
            font-family: Helvetica, Arial, sans-serif; 
            font-size: 14px; 
            background-color: ${colors.bg};
            color: ${colors.white};
            line-height: 1.6;
          }
          .custom-block { 
            background-color: ${colors.greyhard}; 
            border-radius: 10px; 
            padding: 15px; 
            margin: 10px 0;
            border-left: 4px solid ${colors.yellow};
          }
          .touch-text { 
            color: ${colors.yellow}; 
            text-decoration: none; 
            cursor: pointer; 
            position: relative; 
            font-weight: bold;
            padding: 2px 4px;
            border-radius: 3px;
            background-color: rgba(240, 185, 11, 0.1);
          }
          .touch-text:hover::after {
            content: attr(data-description);
            position: absolute;
            background: #444;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            bottom: 25px;
            left: 0;
            white-space: nowrap;
            font-size: 12px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          .touch-text:hover::before {
            content: '';
            position: absolute;
            bottom: 20px;
            left: 10px;
            border: 5px solid transparent;
            border-top-color: #444;
            z-index: 1001;
          }
        `,
        
        branding: false, 
        elementpath: false, // Убрать путь элементов внизу
        statusbar: true, // Показать статус бар
        
        // Настройки изображений
        image_advtab: true,
        image_caption: true,
        image_title: true,
        
        // Настройки ссылок
        link_title: false,
        default_link_target: '_blank',
        
        // Настройки таблиц
        table_responsive_width: true,
        table_default_attributes: {
          border: '1'
        },
        table_default_styles: {
          borderCollapse: 'collapse'
        },
        
        // Настройки автосохранения (опционально)
        // autosave_ask_before_unload: false,
        // autosave_interval: '30s',
        // autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
        
        // Валидация контента
        valid_elements: '*[*]',
        extended_valid_elements: 'span[*],div[*]',
        
        // Настройки вставки
        paste_data_images: true,
        paste_as_text: false,
        paste_auto_cleanup_on_paste: true,
      }}
    />
  )
}

export default DescriptionInput