# input

## Description

Описание
Input — текстовое поле для ввода данных пользователем. Используется в формах для сбора произвольного текста.

Поведение
Поле поддерживает опциональные лейбл (с меткой обязательности * и иконкой-подсказкой), левую и правую иконки, и кнопку сброса значения (IconButton). При фокусе появляется мигающий каретка-курсор и рамка меняет цвет с эффектом focus-ring. Есть компактный вариант без рамки, лейбла и подсказки (Stroke=False) для инлайн-использования и полный вариант с рамкой, лейблом и подсказкой (Stroke=True).

Состояния
- Default — обычное состояние, поле пустое
- Filled — поле содержит введённый текст (Filled=True)
- Hover — курсор наведён на поле
- Focus — рамка меняет цвет на border/outline (#d7d7d7) с focus-ring тенью 0 0 0 2px border/outline-variant (#3b3b3b), в поле отображается каретка-курсор (text-and-icons/on-surface, #f1f1f1)
- Active — поле активно
- Disabled — поле недоступно для взаимодействия
- Error — ошибка валидации, рамка border/outline-danger (#e64e41), текст подсказки text-and-icons/danger (#e64e41)

Виды компонента (variant Stroke)
- Stroke=True — полный вариант: рамка, фон bg/surface-dim (#1e1e1e), поддерживает лейбл и подсказку, border-radius radius/m (8px), высота поля 40px
- Stroke=False — компактный вариант без рамки, лейбла и подсказки, для инлайн-использования, border-radius radius/s (6px), padding 4px, gap 8px

Анатомия элемента
- Label — опциональный лейбл над полем, содержит текст, метку обязательности (*) и иконку-вопрос (tooltip), только при Stroke=True
- Left icon — опциональная иконка слева (leftIcon)
- Caret — мигающий курсор ввода, виден в состоянии Focus (text-and-icons/on-surface, #f1f1f1)
- Value / Placeholder — введённый текст (text-and-icons/on-surface, #f1f1f1) или плейсхолдер (text-and-icons/on-surface-low, #a5a5a5)
- Right icon — опциональная иконка справа (rightIcon)
- Button (IconButton) — кнопка сброса значения, 20px, border-radius radius/xs (4px), содержит иконку 16px
- Hint — опциональная подсказка под полем (text-and-icons/on-surface-low, при ошибке — text-and-icons/danger), только при Stroke=True

Размеры и отступы
Фиксированный размер, вариант Size отсутствует.
- Высота поля (Stroke=True): 40px
- Padding поля (Stroke=True): 12px по горизонтали, 8px по вертикали
- Gap между элементами внутри поля: 8px
- Gap между Label / полем / Hint: 6px
- Padding (Stroke=False): 4px, gap 8px
- Border-radius (Stroke=True): radius/m — 8px
- Border-radius (Stroke=False): radius/s — 6px
- Border-radius (Button): radius/xs — 4px
- Текст значения: font/size/body2 (14px), line-height body2 (20px)
- Текст лейбла/подсказки: font/size/body2 (14px), line-height body2-condensed (16px)

Когда использовать / не использовать
Использовать: свободный ввод текста, чисел или других произвольных данных в форме.
Не использовать: выбор значения из закрытого списка опций (использовать Select).

Доступность
Поддержка клавиатурной навигации и ввода с клавиатуры. Состояние Disabled исключает поле из фокуса. Иконка-вопрос в лейбле предполагает всплывающую подсказку (tooltip) для дополнительного контекста.

Токены / переменные
- bg/surface-dim — #1e1e1e (фон поля)
- border/outline-variant — #3b3b3b (рамка по умолчанию, focus-ring тень)
- border/outline — #d7d7d7 (рамка в Focus)
- border/outline-danger — #e64e41 (рамка в Error)
- text-and-icons/on-surface — #f1f1f1 (текст значения, каретка)
- text-and-icons/on-surface-low — #a5a5a5 (плейсхолдер, лейбл, подсказка)
- text-and-icons/danger — #e64e41 (текст подсказки при ошибке)
- radius/m — 8px (Stroke=True)
- radius/s — 6px (Stroke=False)
- radius/xs — 4px (Button/IconButton)
- font/size/body2 — 14px
- font/line-height/body2 — 20px (значение)
- font/line-height/body2-condensed — 16px (лейбл/подсказка)

Связанные компоненты
Select — альтернатива для выбора значения из списка. Button — используется совместно в формах.

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean
- `inline`: boolean

## Structure

- INSTANCE "Label" (component instance) — when `inline` is `false`
- FRAME "input"
  - INSTANCE "icon" (component instance)
  - FRAME "text-block"
    - TEXT "text"
    - INSTANCE "_Caret" (component instance) — present in 8/24 variants
  - INSTANCE "Icon-Button" (component instance)
- TEXT "hint" — when `inline` is `false`
