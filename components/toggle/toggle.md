# toggle

## Description

Описание
Toggle — переключатель для мгновенного включения/выключения одной опции (в отличие от Checkbox не требует подтверждения формы, изменение применяется сразу). Indeterminate-состояния нет.

Поведение
Клик переключает состояние Checked мгновенно. При Hover поверх трека — оверлей hover/hover-color (rgba(255,255,255,0.12)). При фокусе — focus-ring тень 0 0 0 2px border/outline-variant (#3b3b3b), фон трека не меняется. Thumb смещается вправо при Checked=True.

Состояния
- Default (Checked=False) — трек bg/surface-highest (#727272), thumb bg/surface-container (#2a2a2a)
- Hover — трек + оверлей hover/hover-color (rgba(255,255,255,0.12))
- Focus — focus-ring тень 0 0 0 2px border/outline-variant (#3b3b3b)
- Disabled — трек bg/disabled-surface (#3b3b3b)
- Checked=True — трек bg/primary (#7f56d9), thumb text-and-icons/on-primary (#f1f1f1), смещён вправо
- Checked=True + Disabled — трек bg/disabled-surface (#3b3b3b), thumb text-and-icons/on-surface (#f1f1f1) opacity disabled/disabled-number (0.32)

Анатомия элемента
- Track — пилюля 36x20px, border-radius radius/full (1000px), padding 2px
- Thumb (indicator) — круг 16px, тень shadow/sm
- State overlay — слой поверх трека для hover-эффекта

Размеры и отступы
- Размер трека: 36x20px (фиксированный, вариантов Size нет)
- Border-radius: radius/full — 1000px
- Padding: 2px
- Thumb: 16px

Когда использовать / не использовать
Использовать: мгновенное включение/выключение одной опции без подтверждения формы.
Не использовать: изменение требует подтверждения формы (использовать Checkbox); выбор одного из нескольких взаимоисключающих значений (использовать Radio).

Доступность
Клавиатурная навигация: Tab для фокуса, Space для переключения.

Токены / переменные
- bg/surface-highest — #727272 (трек, Checked=False)
- bg/primary — #7f56d9 (трек, Checked=True)
- bg/disabled-surface — #3b3b3b (трек, Disabled)
- bg/surface-container — #2a2a2a (thumb, Checked=False)
- text-and-icons/on-primary — #f1f1f1 (thumb, Checked=True)
- text-and-icons/on-surface — #f1f1f1 (thumb, Checked=True+Disabled, opacity 0.32)
- border/outline-variant — #3b3b3b (focus-ring тень)
- hover/hover-color — rgba(255,255,255,0.12) (hover-оверлей)
- disabled/disabled-number — 0.32
- radius/full — 1000px

Связанные компоненты
Toggle-Label — тот же Toggle с текстовым лейблом и опциональным описанием. Toggle-Group — вертикальная группа Toggle-Label. Checkbox — альтернатива при необходимости подтверждения формы. Radio — альтернатива для взаимоисключающего выбора.

## Variants

- `checked`: boolean
- `hover`: boolean
- `focus`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- RECTANGLE "indicator"
