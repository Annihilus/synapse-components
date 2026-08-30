# modal-window

## Description

Описание
Модальное окно — блокирующий диалог поверх интерфейса для действий, требующих обязательного решения пользователя. Состоит из Modal-Header (опционален), Modal-Content (слот с произвольным контентом) и Modal-Footer (опционален).

Поведение
Появляется поверх интерфейса с затемнением фона (overlay), блокирует взаимодействие со страницей до закрытия. Закрывается по клику на close (крестик), по Cancel в футере, по клику на overlay или по Escape. Header/Footer — опциональные блоки (showHeader/showFooter), контент — обязательный слот (children).

Состояния
- Default — единственное состояние контейнера, различия задаются Size и наличием Header/Footer/Close

Виды компонента
- Size=s — малое окно, ширина 480px
- Size=m — среднее окно, ширина 640px
- Size=l — большое окно, ширина 920px
- showHeader / showFooter / showClose — булевы переключатели видимости блоков

Вид на разных устройствах
- Mobile: рекомендуется full-width/full-screen адаптация
- Desktop: фиксированная ширина по Size, по центру экрана

Анатомия элемента
- Modal-Window — контейнер: border 1px bg/surface-high, radius/xl (16px), overflow clip, фон bg/surface-container
- Modal-Header — верхний блок (см. отдельное описание компонента Modal-Header)
- Modal-Content — тело окна, слот children, padding 24px по горизонтали
- Modal-Footer — нижний блок (см. отдельное описание компонента Modal-Footer)
- close button — крестик, 32x32px, top/right offset 15px, опционален

Размеры и отступы
- Ширина: s=480px, m=640px, l=920px
- Border radius: radius/xl — 16px
- Border: 1px bg/surface-high (#3b3b3b)
- Фон: bg/surface-container (#2a2a2a)
- Modal-Content padding: 24px по горизонтали
- close button: 32x32px, padding 8px, radius/btn-radius-large (8px), icon 16x16px

Мин / Макс размеры
- Min width: 480px (Size=s)
- Max width: 920px (Size=l)
- Min/Max height: не заданы — по контенту (Header+Content+Footer), рекомендуется скролл контента при переполнении

Когда использовать / не использовать
- Использовать: обязательное решение пользователя блокирующим образом; контент+действия в футере
- Не использовать: ненавязчивое уведомление — Snackbar; короткая подсказка — Tooltip/Popover; сообщение при блоке контента — Helper-Text

Кастомизация
- size: s / m / l, по умолчанию s
- showHeader / showFooter / showClose: True / False, по умолчанию True
- children (content): произвольный контент (слот)

Доступность
- ARIA-роль: dialog (alertdialog для критичных подтверждений)
- ARIA-атрибуты: aria-modal="true", aria-labelledby на Title, aria-describedby на Content, focus trap внутри окна
- Keyboard: Escape закрывает, Tab циклически внутри окна (focus trap), фокус на первый интерактивный элемент при открытии, возврат на триггер при закрытии

Интерактивность (события)
- onClose — клик по close, клик по overlay, Escape
- onCancel — клик по Cancel в футере
- onConfirm — клик по primary-кнопке в футере

Связанные компоненты
- Modal-Header, Modal-Footer — составные части
- Button — используется в Modal-Footer
- Input — используется в Modal-Header при search=True
- Icon-Button — паттерн кнопки закрытия
- Snackbar, Popover, Tooltip, Helper-Text — альтернативы для неблокирующих случаев

Токены / переменные
- bg/surface-container: #2a2a2a
- bg/surface-high: #3b3b3b (border окна)
- text-and-icons/on-surface: #f1f1f1
- radius/xl: 16px
- radius/btn-radius-large: 8px (close button)

## Variants

- `size`: 's' | 'm' | 'l'

## Structure

- INSTANCE "Modal-Header" (component instance)
- INSTANCE "Modal-Content" (component instance)
- INSTANCE "Modal-Footer" (component instance)
- INSTANCE "close" (component instance)
