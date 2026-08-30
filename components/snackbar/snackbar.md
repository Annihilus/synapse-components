# snackbar

## Description

Описание
Всплывающее уведомление Synapse Design System. Кратко сообщает о результате действия (инфо/успех/предупреждение/ошибка), появляется поверх интерфейса и исчезает автоматически или по закрытию пользователем.

Поведение
Появляется в нижнем правом углу экрана с анимацией появления (slide/fade in). При нескольких одновременных снекбарах — складываются в стопку (по вертикали) в том же углу. Закрывается по клику на кнопку закрытия (close=True) или автоматически по таймауту (логика вне компонента).

Состояния
- Default — появление, отображение сообщения
- Focus — на кнопке закрытия, клавиатурный фокус
- Active/Disabled/Loading — не применимо

Виды компонента (Type)
- default — нейтральная иконка
- success — иконка check
- warning — иконка треугольник с восклицанием
- error — иконка круг с восклицанием
Цвет текста заголовка не меняется (всегда on-surface), меняется только иконка.

Вид на разных устройствах
- Mobile — отдельного варианта нет, рекомендуется адаптировать позицию/ширину под меньший экран
- Desktop — фиксированная ширина 360px, позиция — нижний правый угол экрана

Анатомия элемента
- icon_container — контейнер иконки, padding 4px
- icon — иконка типа сообщения, 24x24px
- block — горизонтальный блок текст + кнопка закрытия
- Title — текст сообщения, text-and-icons/on-surface (#f1f1f1), Medium 16/20
- close button — опционально (close=True/False), 24x24px, иконка 16px внутри

Размеры и отступы
- Высота: 48px (фиксированная)
- Ширина: 360px (фиксированная)
- Padding: 8px
- Gap icon_container/block: 4px
- Border-radius: radius/l — 12px
- Border: 1px border/outline-variant (#3b3b3b)
- Фон: bg/surface-container (#2a2a2a)
- Тень: shadow/m
- block gap текст/кнопка: 8px
- close button: padding 4px, radius/btn-radius-small 6px

Когда использовать / не использовать
Использовать: краткое уведомление о результате действия, не прерывающее работу.
Не использовать: сообщение привязано к блоку/форме контента (использовать Helper-Text); требуется подтверждение пользователя (использовать Modal); нужны развёрнутые действия/кнопки внутри уведомления (использовать Helper-Text).

Кастомизация
- type: default / success / warning / error, по умолчанию default
- close: True / False, по умолчанию True

Доступность
- ARIA-роль: status (alert для type=error)
- ARIA-атрибуты: aria-live="polite" (assertive для error)
- Keyboard: Tab к кнопке закрытия, Enter/Space для закрытия

Интерактивность (события)
- onClose — клик по кнопке закрытия, скрывает снекбар
- auto-dismiss — автоматическое скрытие по таймауту (логика вне компонента)

Токены / переменные
- bg/surface-container — #2a2a2a
- border/outline-variant — #3b3b3b
- text-and-icons/on-surface — #f1f1f1
- radius/l — 12px
- radius/btn-radius-small — 6px
- font/size/body1 — 16px
- font/line-height/body1-condensed — 20px
- shadow/m — 0px 4px 8px rgba(0,0,0,0.08), 0px 0px 4px rgba(0,0,0,0.04)

Связанные компоненты
Icon-Button — паттерн кнопки закрытия. Helper-Text — альтернатива для контекстных сообщений, привязанных к блоку контента, с поддержкой действий.

## Variants

- `type`: 'default' | 'success' | 'warning' | 'error'

## Structure

- FRAME "icon_container"
  - INSTANCE "icon" (component instance)
- FRAME "block"
  - TEXT "title"
  - FRAME "container"
    - INSTANCE "Button" (component instance) — when `type` is `default` or `error` or `warning`
    - INSTANCE "Button11" (component instance) — when `type` is `success`
