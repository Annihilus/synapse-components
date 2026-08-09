# tab

## Description

Описание
Tab — одна вкладка внутри Tab-Panel. Не самостоятельный компонент.

Поведение
При Hover — фон-оверлей hover/hover-color (rgba(255,255,255,0.12)). Selected=True — постоянный фон bg/surface-high (#3b3b3b) и активный текст text-and-icons/on-surface (#f1f1f1) вместо приглушённого text-and-icons/on-surface-variant (#d7d7d7). Disabled — прозрачность disabled/disabled-number (0.32), клик недоступен.

Состояния
- Default (не selected, не hover, не disabled) — без фона, текст on-surface-variant (#d7d7d7)
- Hover — фон-оверлей hover-color (rgba(255,255,255,0.12))
- Disabled — прозрачность 0.32, клик недоступен
- Selected=True — фон bg/surface-high (#3b3b3b), текст on-surface (#f1f1f1)
- Selected=True + Hover — фон bg/surface-high + hover-оверлей поверх

Анатомия элемента
- Icon — опциональная иконка 16px слева (icon=True/False)
- Text — текст вкладки, font/size/body2 (14px), font/line-height/body2 (20px)
- Actions — опциональная кнопка справа 20px (button=True/False, напр. закрытие вкладки)

Размеры и отступы
- Padding: 12px по горизонтали, 6px по вертикали
- Gap между иконкой/текстом/actions: 4px
- Border-radius: radius/s (6px)

Кастомизация
- icon: True/False, по умолчанию True
- button: True/False, по умолчанию True
- selected: True/False, по умолчанию False
- disabled: True/False, по умолчанию False

Токены / переменные
- bg/surface-high — #3b3b3b (Selected)
- hover/hover-color — rgba(255,255,255,0.12)
- disabled/disabled-number — 0.32
- text-and-icons/on-surface — #f1f1f1 (Selected)
- text-and-icons/on-surface-variant — #d7d7d7 (Default)
- radius/s — 6px
- font/size/body2 — 14px

Связанные компоненты
Tab-Panel — контейнер, собирающий Tab в ряд.

## Variants

- `hover`: boolean
- `selected`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- INSTANCE "icon_placeholder" (component instance)
- TEXT "text"
- INSTANCE "actions" (component instance)
