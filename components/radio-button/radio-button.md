# radio-button

## Description

Описание
Radiobutton — переключатель для выбора одного значения из нескольких взаимоисключающих опций внутри группы. Не поддерживает Indeterminate и множественный выбор.

Поведение
Клик переключает состояние Checked (в группе выбор одной радиокнопки снимает выбор с остальных — логика группы). При Hover — оверлей hover/hover-color (rgba(255,255,255,0.12)) поверх круга. При фокусе — фон bg/surface-container (#2a2a2a) + focus-ring тень 0 0 0 2px border/outline-variant (#3b3b3b). При Checked=True внутри точка 8px text-and-icons/primary (#b299e7).

Состояния
- Default (Checked=False) — пустой круг, рамка border/outline (#d7d7d7)
- Hover — оверлей hover/hover-color (rgba(255,255,255,0.12))
- Focus — фон bg/surface-container (#2a2a2a) + focus-ring тень 0 0 0 2px border/outline-variant (#3b3b3b)
- Disabled — рамка border/disabled-outline (rgba(215,215,215,0.32))
- Checked=True — точка 8px text-and-icons/primary (#b299e7)
- Checked=True + Disabled — рамка border/disabled-outline, точка opacity disabled/disabled-number (0.32)

Анатомия элемента
- Circle — круг 20x20px, рамка 1px border/outline (#d7d7d7), border-radius radius/full (1000px)
- Dot (check) — внутренний круг 8px, text-and-icons/primary (#b299e7), виден при Checked=True
- State overlay — слой inset -1px поверх круга для hover-эффекта

Размеры и отступы
- Размер: 20x20px (фиксированный, вариантов Size нет)
- Border-radius: radius/full — 1000px
- Border width: 1px
- Dot size: 8px

Когда использовать / не использовать
Использовать: выбор одного значения из взаимоисключающих опций (в группе).
Не использовать: множественный выбор (использовать Checkbox-Group); независимое мгновенное вкл/выкл (использовать Toggle).

Доступность
role="radiogroup" на контейнере, radio на элементах. Клавиатурная навигация: Tab на группу, стрелки между опциями, Space для выбора.

Токены / переменные
- border/outline — #d7d7d7 (рамка)
- border/disabled-outline — rgba(215,215,215,0.32) (рамка, Disabled)
- bg/surface-container — #2a2a2a (фон в Focus)
- border/outline-variant — #3b3b3b (focus-ring тень)
- text-and-icons/primary — #b299e7 (точка, Checked)
- disabled/disabled-number — 0.32
- radius/full — 1000px

Связанные компоненты
Radiobutton-Label — тот же Radiobutton с текстовым лейблом и опциональным описанием. Radio-Group — вертикальная группа Radiobutton-Label. Checkbox — альтернатива для множественного выбора. Toggle — альтернатива для независимого вкл/выкл.

## Variants

- `checked`: boolean
- `hover`: boolean
- `focus`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- RECTANGLE "check" — when `checked` is `true`
