# tag

## Description

Описание
Tag — небольшая цветная метка (chip) с иконкой, текстом и кнопкой закрытия. Используется для маркировки/категоризации элементов, отображения статусов, фильтров. Единый компонент с 14 цветовыми вариантами.

Поведение
Статичный компактный контейнер (auto-layout horizontal), не имеет hover/focus состояний по умолчанию. Кнопка close — интерактивный элемент внутри, клик по ней удаляет/убирает тег.

Состояния
- Default — иконка + текст + close, фон в цвете варианта

Виды компонента
- Gray — bg gray/50 (#fdfdfd), текст on-inverse-surface (#2a2a2a)
- Red — bg red/100 (#fbd0ca), текст red/700 (#852119)
- Yellow — bg yellow/100 (#ffecce), текст yellow/800 (#8f6007)
- Green — bg green/50 (#d1ffeb), текст green/800 (#015b34)
- Blue — bg blue/50 (#ebf3ff), текст blue/800 (#0d346e)
- Indigo — bg indigo/50 (#e9e9ff), текст indigo/800 (#181c8a)
- Purple — bg purple/50 (#e8e3ff), текст purple/800 (#34128c)
- Pink — bg pink/50 (#fdebf5), текст pink/800 (#631543)
- Orange — bg orange/50 (#ffe7dd), текст orange/800 (#632409)
- Teal — bg teal/50 (#d6faf7), текст teal/800 (#114f4c)
- Cyan — bg cyan/50 (#e0f9fb), текст cyan/800 (#135259)
- Lime — bg lime/50 (#f9fac6), текст lime/800 (#4b4b0f)
- Brown — bg brown/50 (#fceeec), текст brown/800 (#4d322d)
- BlueGray — bg blue-gray/50 (#dbdffa), текст blue-gray/800 (#373d6e)

Анатомия элемента
- icon — 16x16px, слева
- Text — текст метки
- close — 16x16px иконка закрытия, справа

Размеры и отступы
- Gap: 4px
- Padding: 6px (x) / 2px (y)
- Border radius: radius/m (8px)
- Текст: font/size/body2 (14px) / font/line-height/body2-condensed (16px), weight Medium

Когда использовать / не использовать
Использовать: нужна маркировка/категоризация элемента (тег, статус, фильтр), нужен компактный удаляемый элемент.
Не использовать: нужен интерактивный переключаемый статус — использовать Toggle/Checkbox; нужен крупный акцентный статус — использовать Badge.

Кастомизация
- color: Gray/Red/Yellow/Green/Blue/Indigo/Purple/Pink/Orange/Teal/Cyan/Lime/Brown/BlueGray, по умолчанию Gray
- icon: любая иконка
- text: произвольный текст

Доступность
- ARIA-роль: status / group (в зависимости от контекста использования)
- ARIA-атрибуты: aria-label на кнопке close ("Удалить тег")
- Keyboard: Tab на close-кнопку, Enter/Space — удаление

Интерактивность (события)
- onClose — клик по иконке close — удаление/скрытие тега

Токены / переменные
- gray/50 — #fdfdfd
- red/100 — #fbd0ca, red/700 — #852119
- yellow/100 — #ffecce, yellow/800 — #8f6007
- green/50 — #d1ffeb, green/800 — #015b34
- blue/50 — #ebf3ff, blue/800 — #0d346e
- indigo/50 — #e9e9ff, indigo/800 — #181c8a
- purple/50 — #e8e3ff, purple/800 — #34128c
- pink/50 — #fdebf5, pink/800 — #631543
- orange/50 — #ffe7dd, orange/800 — #632409
- teal/50 — #d6faf7, teal/800 — #114f4c
- cyan/50 — #e0f9fb, cyan/800 — #135259
- lime/50 — #f9fac6, lime/800 — #4b4b0f
- brown/50 — #fceeec, brown/800 — #4d322d
- blue-gray/50 — #dbdffa, blue-gray/800 — #373d6e
- radius/m — 8px

Связанные компоненты
Badge — родительская группа/фрейм в Figma, где размещён Tag. Dropdown-Item — часто используется совместно с Tag (мультиселект с тегами).

## Variants

- `color`: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'teal' | 'cyan' | 'lime' | 'brown' | 'blueGray'

## Structure

- INSTANCE "container" (component instance)
