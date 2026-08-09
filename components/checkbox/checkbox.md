# checkbox

## Description

Описание
Checkbox — базовый флажок для бинарного выбора (включено/выключено) или части группы (см. Checkbox-Group). Поддерживает промежуточное состояние Indeterminate для частичного выбора в группах.

Поведение
Клик переключает состояние Checked. Indeterminate=True отображается вместе с Checked=True как отдельная иконка (тире), используется когда часть дочерних элементов группы выбрана, а часть — нет. При фокусе появляется фон bg/surface-container (#2a2a2a) и focus-ring тень 0 0 0 2px border/outline-variant (#3b3b3b).

Состояния
- Default (Checked=False) — пустой квадрат, рамка border/outline (#d7d7d7)
- Checked=True — внутри иконка check (16px)
- Indeterminate=True (совместно с Checked=True) — внутри иконка remove/тире (16px), означает частичный выбор
- Hover — курсор наведён на чекбокс (визуальные детали не проверялись отдельно)
- Focus — фон bg/surface-container (#2a2a2a), focus-ring тень 0 0 0 2px border/outline-variant (#3b3b3b)
- Disabled — чекбокс недоступен для взаимодействия (визуальные детали не проверялись отдельно)

Анатомия элемента
- Box — квадрат 20x20px, рамка 1px border/outline (#d7d7d7), border-radius radius/s (6px)
- Check icon — иконка галочки 16px, видна при Checked=True
- Remove icon — иконка тире 16px, видна при Indeterminate=True

Размеры и отступы
- Размер: 20x20px (фиксированный, вариантов Size нет)
- Border-radius: radius/s — 6px
- Border width: 1px

Когда использовать / не использовать
Использовать: бинарный выбор одного значения (согласие, включение опции), множественный выбор в группе (Checkbox-Group).
Не использовать: выбор одного значения из взаимоисключающих опций (использовать Radio).

Доступность
Поддержка клавиатурной навигации (Tab, Space для переключения). Indeterminate передаёт промежуточное состояние программно (не через клик пользователя).

Токены / переменные
- border/outline — #d7d7d7 (рамка)
- bg/surface-container — #2a2a2a (фон в Focus)
- border/outline-variant — #3b3b3b (focus-ring тень)
- radius/s — 6px

Связанные компоненты
Checkbox-Label — тот же Checkbox с текстовым лейблом и опциональным описанием. Checkbox-Group — вертикальная группа Checkbox-Label с фиксированным отступом. Radio — альтернатива для взаимоисключающего выбора.

## Variants

- `checked`: boolean
- `indeterminate`: boolean
- `hover`: boolean
- `focus`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- INSTANCE "check" (component instance) — when `checked` is `true` and `indeterminate` is `false`
- INSTANCE "remove" (component instance) — when `indeterminate` is `true`
