# modal-footer

## Description

Описание
Modal-Footer — нижний блок модального окна Modal-Window. Содержит опциональный счётчик выбранных элементов и ряд кнопок действий.

Поведение
Статичный блок-контейнер — не имеет собственных hover/focus состояний, кроме состояний вложенных кнопок (см. Button). Видимость счётчика управляется counter.

Состояния
- Default — единственное состояние контейнера, различия только в наборе видимых элементов (counter) и количестве кнопок

Виды компонента
- counter=True/False — показ счётчика "Selected: N" слева от кнопок

Вид на разных устройствах
- Mobile: без отдельного варианта, ширина по родителю (Modal-Window)
- Desktop: ширина по родителю, кнопки выровнены по правому краю

Анатомия элемента
- counter — "Selected:" (on-surface) + значение (on-surface-low #a5a5a5), опционально
- actions — ряд кнопок (Button), обычно Cancel (ghost) + 1-2 второстепенные (outlined) + 1 primary, выровнены по правому краю

Размеры и отступы
- Padding: 24px по горизонтали, 20px по вертикали
- Gap: 12px между counter и кнопками, 12px между кнопками
- Кнопки: высота 40px (Button Size=m)

Мин / Макс размеры
- Min/Max width: не заданы — по родителю (Modal-Window)
- Min/Max height: не задана — по контенту (высота кнопок + padding)

Когда использовать / не использовать
- Использовать: нужны явные действия (подтверждение/отмена) в модальном окне
- Не использовать: для окон без действий — установить showFooter=False на Modal-Window

Кастомизация
- counter: True / False, по умолчанию True
- набор и количество кнопок — определяется содержимым конкретного инстанса

Доступность
- ARIA-роль: часть dialog, кнопки — role button (см. Button)
- ARIA-атрибуты: aria-live="polite" на counter при динамическом изменении значения
- Keyboard: Tab перемещается по кнопкам действий, Enter/Space активирует

Интерактивность (события)
- onCancel — клик по кнопке Cancel
- onConfirm — клик по primary-кнопке
- onClick (промежуточные кнопки) — см. Button

Связанные компоненты
- Modal-Window — родительский контейнер
- Button — используется для всех действий в actions

Токены / переменные
- text-and-icons/on-surface: #f1f1f1 (label counter)
- text-and-icons/on-surface-low: #a5a5a5 (значение counter)
- font/size/body1: 16px
- font/line-height/body1: 24px

## Structure

- FRAME "counter"
  - TEXT "text"
  - TEXT "number"
- INSTANCE "Button" (component instance)
