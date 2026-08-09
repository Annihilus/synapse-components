# dropdown-item

## Description

Описание
Dropdown-Item — вспомогательный компонент строки списка внутри слота Dropdown. Не самостоятельный компонент.

Состояния
- Default (не hover, не selected, не disabled) — фон bg/surface-container (#2a2a2a)
- Hover — фон-оверлей hover/hover-color (rgba(255,255,255,0.12))
- Selected=True — фон bg/surface-high (#3b3b3b)
- Disabled — иконка/текст/hint с прозрачностью disabled/disabled-number (0.32), клик недоступен

Анатомия элемента
- Checkbox — опциональный чекбокс 20x20px слева (checkbox=True/False, множественный выбор)
- Icon — опциональная иконка 20px (icon=True/False)
- Text-block — основной текст (font/size/body1, 16px) + опциональное описание (description=True/False, font/size/small, 12px, text-and-icons/on-surface-variant)
- Hint — опциональный текст справа (hint=True/False), text-and-icons/on-surface-low (#a5a5a5)

Размеры и отступы
- Padding: 8px по горизонтали, 6px по вертикали
- Border-radius: radius/m (8px)
- Gap между элементами: 6px

Кастомизация
- checkbox: True/False, по умолчанию False
- icon: True/False, по умолчанию True
- description: True/False, по умолчанию True
- hint: True/False, по умолчанию True
- selected: True/False, по умолчанию False
- disabled: True/False, по умолчанию False

Токены / переменные
- bg/surface-container — #2a2a2a
- bg/surface-high — #3b3b3b (Selected)
- hover/hover-color — rgba(255,255,255,0.12)
- disabled/disabled-number — 0.32
- text-and-icons/on-surface — #f1f1f1
- text-and-icons/on-surface-variant — #d7d7d7 (описание)
- text-and-icons/on-surface-low — #a5a5a5 (hint)
- radius/m — 8px
- font/size/body1 — 16px
- font/size/small — 12px

Связанные компоненты
Dropdown — контейнер, использующий Dropdown-Item в слоте. Checkbox — используется внутри при checkbox=True.

## Variants

- `hover`: boolean
- `selected`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- INSTANCE "icon_placeholder" (component instance)
- FRAME "text_block"
  - TEXT "text"
- TEXT "hint"
