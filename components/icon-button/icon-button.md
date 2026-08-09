# icon-button

## Description

Описание
Icon-Button — компактная кнопка с одной иконкой без текста. Используется для второстепенных действий в тулбарах, шапках, списках (например: закрыть, редактировать, ещё-меню).

Поведение
Переключается по props type (Primary/Secondary), hover, active, disabled. При hover появляется полупрозрачный слой поверх (hover/hover-color). При active — заливка фона bg/surface-high. Disabled снижает opacity контента.

Состояния
- Default — иконка без фона, прозрачный контейнер
- Hover — полупрозрачный слой hover/hover-color (rgba(255,255,255,0.12)) поверх
- Active — фон bg/surface-high (#3b3b3b), иконка активного цвета
- Disabled — контент opacity снижен (disabled/disabled-number), без hover/active

Виды компонента
- Primary — акцентная версия (иконка/цвет primary при active)
- Secondary — нейтральная версия (по умолчанию)

Анатомия элемента
- state — слой hover/active, absolute inset-0
- icon — 16x16px, по центру

Размеры и отступы
- Размер: 20x20px
- Padding: 2px
- Border radius: radius/xs (4px)
- icon: 16x16px

Когда использовать / не использовать
Использовать: нужно компактное действие без подписи (закрыть, редактировать, меню), место ограничено.
Не использовать: действие требует явного текстового пояснения — использовать Button; действие критично и должно быть заметным — использовать Button (Primary).

Кастомизация
- type: Primary/Secondary, по умолчанию Secondary
- hover: True/False, по умолчанию False
- active: True/False, по умолчанию False
- disabled: True/False, по умолчанию False
- icon: любая иконка

Доступность
- ARIA-роль: button
- ARIA-атрибуты: aria-label обязателен (нет видимого текста), aria-disabled
- Keyboard: Tab — фокус, Enter/Space — активация

Интерактивность (события)
- onClick — клик по кнопке (не disabled)
- onFocus — фокус клавиатурой

Токены / переменные
- bg/surface-high — #3b3b3b
- hover/hover-color — rgba(255,255,255,0.12)
- disabled/disabled-number — opacity значение disabled состояния
- radius/xs — 4px

Связанные компоненты
Button — полноразмерная кнопка с текстом, используется когда нужна подпись. Tab — использует похожий паттерн action-иконки внутри себя.

## Variants

- `hover`: boolean
- `disabled`: boolean
- `active`: boolean
- `type`: 'secondary' | 'primary'

## Structure

- RECTANGLE "state"
- INSTANCE "icon" (component instance)
