# popover

## Description

Описание
Всплывающий контейнер со свободным контентом (слот children). В отличие от Tooltip — может содержать любой контент (не только текст): списки, формы, кнопки, произвольную разметку. Открывается по hover ИЛИ по клику.

Поведение
Появляется рядом с элементом-триггером. Направление и точка привязки стрелки задаются вариантами Side и Position. Открывается по hover/focus (как Tooltip) либо по клику — при клик-триггере обычно требует закрытия по клику вне поповера или повторному клику на триггер. Вариант Side=No/Position=No — без стрелки, для произвольного позиционирования.

Состояния
- Default — единственное состояние контейнера, различия только в направлении (Side/Position)

Виды компонента
- Side=Top / Bottom / Left / Right — направление показа, стрелка указывает на триггер
- Side=No, Position=No — без стрелки, произвольное позиционирование
- Position=Start / Middle / End — смещение стрелки вдоль стороны

Вид на разных устройствах
- Mobile: hover-триггер недоступен, рекомендуется click/tap-триггер
- Desktop: поддерживает hover/focus и click

Анатомия элемента
- Popover-Base — базовый блок с тенью
- content — контейнер слота, фон bg/surface-high (#3b3b3b), padding 12/8px, gap 4px, radius/m (8px)
- children (слот) — произвольный контент, по умолчанию текстовый пример (small 12/16, on-surface)
- arrow — треугольник-указатель 16x6px (Top/Bottom) или 6x16px (Left/Right), отсутствует у Side=No/Position=No

Размеры и отступы
- Padding content: 12px по горизонтали, 8px по вертикали
- Gap content: 4px
- Border radius: radius/m — 8px
- Тень: shadow/lg 0px 12px 16px rgba(10,13,18,0.08), 0px 4px 6px rgba(10,13,18,0.03)
- arrow offset (Start/End): 8px от края; (Middle): по центру 50%
- отступ стрелки от блока: 6px

Мин / Макс размеры
- Min/Max width: не заданы — по контенту слота
- Min/Max height: не заданы — по контенту

Когда использовать / не использовать
- Использовать: нужен контейнер с произвольным контентом (форма, список, действия); нужно открытие и по hover, и по клику
- Не использовать: простая текстовая подсказка — Tooltip; модальное блокирующее окно — Modal; обязательная информация — вынести в постоянный текст интерфейса

Кастомизация
- side: Top / Bottom / Left / Right / No, по умолчанию Bottom
- position: Start / Middle / End / No, по умолчанию Middle
- children: произвольный контент (слот)

Доступность
- ARIA-роль: dialog (click-триггер с интерактивным контентом) / tooltip (hover-триггер с текстовым контентом)
- ARIA-атрибуты: aria-describedby или aria-controls на триггере; aria-expanded при click-триггере
- Keyboard: появляется по фокусу/клику триггера (Tab/Enter), исчезает по потере фокуса или Escape; Tab перемещается по интерактивному контенту внутри

Интерактивность (события)
- onShow — hover/focus на триггере (hover-режим) или клик по триггеру (click-режим)
- onHide — уход курсора/потеря фокуса (hover-режим), клик вне поповера или повторный клик на триггер (click-режим), Escape

Связанные компоненты
- Tooltip — упрощённый вариант с текстовым контентом только по hover/focus
- Helper-Text — контекстные сообщения с действиями, привязанные к блоку контента
- Modal — блокирующие диалоги с обязательным взаимодействием

Токены / переменные
- bg/surface-high: #3b3b3b
- text-and-icons/on-surface: #f1f1f1
- radius/m: 8px
- font/size/small: 12px
- font/line-height/small: 16px
- shadow/lg: 0px 12px 16px rgba(10,13,18,0.08), 0px 4px 6px rgba(10,13,18,0.03)

## Variants

- `position`: 'middle' | 'no' | 'start' | 'end'
- `side`: 'bottom' | 'no' | 'top' | 'left' | 'right'

## Structure

- INSTANCE "wrap" (component instance)
- FRAME "arrow" — when `position` is `end` or `middle` or `start`
  - VECTOR "bottom-center"
