# textarea

## Description

Описание
Textarea — многострочное текстовое поле для ввода развёрнутого текста. Используется в формах, где требуется ввод длинного текста (комментарии, описания, сообщения).

Поведение
Поле поддерживает опциональные лейбл (с меткой обязательности * и иконкой-подсказкой) и подсказку (hint) под полем. При переполнении содержимого появляется скроллбар (showScroll). При фокусе появляется мигающая каретка-курсор и рамка меняет цвет с эффектом focus-ring. В отличие от Input и Select, не имеет вариантов Stroke, leftIcon, rightIcon и кнопки сброса — всегда отображается как полное поле с рамкой.

Состояния
- Default — обычное состояние, поле пустое
- Filled — поле содержит введённый текст (Filled=True)
- Hover — курсор наведён на поле
- Focus — рамка меняет цвет на border/outline (#d7d7d7) с focus-ring тенью 0 0 0 2px border/outline-variant (#3b3b3b), отображается каретка-курсор (text-and-icons/on-surface, #f1f1f1)
- Active — поле активно
- Disabled — поле недоступно для взаимодействия
- Error — ошибка валидации, рамка border/outline-danger (#e64e41), текст подсказки text-and-icons/danger (#e64e41)

Анатомия элемента
- Label — опциональный лейбл над полем, содержит текст, метку обязательности (*) и иконку-вопрос (tooltip)
- Textarea box — многострочное поле ввода, фиксированная высота 120px, фон bg/surface-dim (#1e1e1e), border-radius radius/m (8px)
- Caret — мигающий курсор ввода, виден в состоянии Focus (text-and-icons/on-surface, #f1f1f1)
- Value / Placeholder — введённый текст (text-and-icons/on-surface, #f1f1f1) или плейсхолдер (text-and-icons/on-surface-low, #a5a5a5)
- Scrollbar (showScroll) — опциональный скроллбар при переполнении текста, thumb bg/surface-high (#3b3b3b), ширина 6px, border-radius radius/2xs (2px)
- Hint — опциональная подсказка под полем (text-and-icons/on-surface-low, при ошибке — text-and-icons/danger)

Размеры и отступы
Фиксированная высота поля, вариант Size отсутствует.
- Высота поля (textarea box): 120px
- Padding поля: 12px по горизонтали, 10px по вертикали
- Gap между Label / полем / Hint: 6px
- Border-radius (поле): radius/m — 8px
- Border-radius (Scrollbar thumb): radius/2xs — 2px
- Текст значения: font/size/body2 (14px), line-height body2 (20px)
- Текст лейбла/подсказки: font/size/body2 (14px), line-height body2-condensed (16px)

Когда использовать / не использовать
Использовать: ввод развёрнутого многострочного текста (комментарии, описания, сообщения).
Не использовать: короткий однострочный ввод (использовать Input), выбор значения из списка (использовать Select).

Доступность
Поддержка клавиатурной навигации и многострочного ввода с клавиатуры. Disabled исключает поле из фокуса. Иконка-вопрос в лейбле предполагает всплывающую подсказку (tooltip) для доп. контекста.

Токены / переменные
- bg/surface-dim — #1e1e1e (фон поля)
- bg/surface-high — #3b3b3b (thumb скроллбара)
- border/outline-variant — #3b3b3b (рамка по умолчанию, focus-ring тень)
- border/outline — #d7d7d7 (рамка в Focus)
- border/outline-danger — #e64e41 (рамка в Error)
- text-and-icons/on-surface — #f1f1f1 (текст значения, каретка)
- text-and-icons/on-surface-low — #a5a5a5 (плейсхолдер, лейбл, подсказка)
- text-and-icons/danger — #e64e41 (текст подсказки при ошибке)
- radius/m — 8px (поле)
- radius/2xs — 2px (Scrollbar thumb)
- font/size/body2 — 14px
- font/line-height/body2 — 20px (значение)
- font/line-height/body2-condensed — 16px (лейбл/подсказка)

Связанные компоненты
Input — аналог для однострочного ввода. Select — альтернатива для выбора значения из списка.

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean

## Structure

- INSTANCE "Label" (component instance)
- FRAME "textarea"
  - FRAME "text-block"
    - TEXT "text"
    - INSTANCE "_Caret" (component instance) — present in 4/12 variants
- TEXT "hint"
