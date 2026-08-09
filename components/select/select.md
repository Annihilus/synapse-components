# select

## Description

Описание
Select — выпадающий список для выбора одного значения из набора опций. Используется в формах для сбора структурированных данных.

Поведение
При клике по полю открывается список опций. Поле поддерживает опциональные лейбл и подсказку (hint), а также иконку слева (leftIcon). При заполненном значении может отображаться кнопка сброса (showReset). Есть компактный вариант без рамки (Stroke=False) для инлайн-использования и полный вариант с рамкой, лейблом и подсказкой (Stroke=True).

Состояния
- Default — обычное состояние, поле не заполнено
- Filled — поле содержит выбранное значение (Filled=True)
- Hover — курсор наведён на поле
- Focus — поле в фокусе, рамка меняет цвет на border/outline (#d7d7d7) с focus-ring тенью 0 0 0 2px border/outline-variant (#3b3b3b)
- Active — поле активно (открыт список)
- Disabled — поле недоступно для взаимодействия
- Error — ошибка валидации, рамка border/outline-danger (#e64e41), текст подсказки text-and-icons/danger (#e64e41)

Виды компонента (variant Stroke)
- Stroke=True — полный вариант: рамка, фон bg/surface-dim (#1e1e1e), поддерживает лейбл и подсказку, border-radius radius/m (8px)
- Stroke=False — компактный вариант без рамки, для инлайн-использования внутри других компонентов, border-radius radius/s (6px)

Анатомия элемента
- Label — опциональный лейбл над полем
- Field — само поле выбора с фоном и рамкой (только при Stroke=True)
- Left icon — опциональная иконка слева (leftIcon)
- Value / Placeholder — выбранное значение (text-and-icons/on-surface, #f1f1f1) или плейсхолдер (text-and-icons/on-surface-low, #a5a5a5)
- Reset button — кнопка сброса значения (showReset), border-radius radius/xs (4px), видна только при Filled=True
- Chevron icon — иконка справа, указывает на раскрытие списка
- Hint — опциональная подсказка под полем (text-and-icons/on-surface-low, при ошибке — text-and-icons/danger)

Размеры и отступы
Фиксированный размер, вариант Size отсутствует.
- Border-radius (Stroke=True): radius/m — 8px
- Border-radius (Stroke=False): radius/s — 6px
- Border-radius (Reset button): radius/xs — 4px
- Высота текста значения: font/size/body2 (14px), line-height body2 (20px)
- Высота текста лейбла/подсказки: font/size/body2 (14px), line-height body2-condensed (16px)

Когда использовать / не использовать
Использовать: выбор одного значения из закрытого списка опций в форме.
Не использовать: множественный выбор (использовать Multiselect), свободный ввод текста (использовать Input).

Доступность
Поддержка клавиатурной навигации (открытие списка, перемещение по опциям, выбор). Состояние Disabled исключает поле из фокуса.

Токены / переменные
- bg/surface-dim — #1e1e1e (фон поля)
- border/outline-variant — #3b3b3b (рамка по умолчанию, focus-ring тень)
- border/outline — #d7d7d7 (рамка в Focus)
- border/outline-danger — #e64e41 (рамка в Error)
- text-and-icons/on-surface — #f1f1f1 (текст значения)
- text-and-icons/on-surface-low — #a5a5a5 (плейсхолдер, подсказка)
- text-and-icons/danger — #e64e41 (текст подсказки при ошибке)
- radius/m — 8px (Stroke=True)
- radius/s — 6px (Stroke=False)
- radius/xs — 4px (Reset button)
- font/size/body2 — 14px
- font/line-height/body2 — 20px (значение)
- font/line-height/body2-condensed — 16px (лейбл/подсказка)

Связанные компоненты
Button — используется совместно в формах. Input — альтернатива для свободного ввода.

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean
- `inline`: boolean

## Structure

- INSTANCE "label" (component instance) — when `inline` is `false`
- FRAME "select"
  - INSTANCE "icon" (component instance)
  - FRAME "text-block"
    - TEXT "text"
  - INSTANCE "open-btn" (component instance) — present in 20/24 variants
  - INSTANCE "reset" (component instance) — when `filled` is `true` and `inline` is `false`
  - INSTANCE "chevron_up" (component instance) — present in 4/24 variants
- TEXT "hint" — when `inline` is `false`
