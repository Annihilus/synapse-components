# helper-text

## Description

Описание
Информационный блок-баннер Synapse Design System. Показывает контекстное сообщение пользователю: инфо, успех, предупреждение или ошибку. Содержит иконку, заголовок, описание и опциональные действия (кнопки) и кнопку закрытия.

Поведение
Компонент статичен (не имеет собственных hover/focus/active состояний как элемент управления) — визуальные отличия задаются только вариантом Type. Кнопка закрытия (crossIcon) — интерактивный элемент, скрывает баннер по клику. Кнопки в actions — обычные Button.

Состояния
- Default — единственное визуальное состояние контейнера, различия только между вариантами Type

Виды компонента (Type)
- Info — фон bg/info rgba(16,91,198,0.3), заголовок text-and-icons/info #3d89f5
- Success — фон bg/success rgba(2,139,78,0.3), заголовок text-and-icons/success #03d879
- Warning — фон bg/warning rgba(236,155,5,0.3), заголовок text-and-icons/warning #febe4d
- Error — фон bg/danger rgba(174,40,29,0.3), заголовок text-and-icons/danger #e64e41

Анатомия элемента
- icon — иконка типа сообщения, 20x20px, опциональна (icon=True/False)
- content — колонка: text_block (Title + Description) и actions
- Title — заголовок, жирный, цвет зависит от Type
- Description — описание, text-and-icons/on-surface (#f1f1f1), опционально (description=True/False)
- actions — ряд кнопок (Button, outline, h-32px)
- close button (crossIcon) — Icon-Button 20x20px, опционально (closeButton=True/False), иконка 16px внутри

Размеры и отступы
- Padding контейнера: 12px
- Gap icon/content/close: 8px
- Border-radius контейнера: radius/m — 8px
- Ширина: демо 862px в Figma, реально w-full
- text_block gap (Title/Description): 4px
- content gap (text_block/actions): 12px
- actions gap между кнопками: 8px
- Button в actions: высота 32px, padding lr12/tb8, radius/btn-radius-large 8px
- close button: 20x20px, padding 2px, radius/xs 4px, иконка 16px

Когда использовать / не использовать
Использовать: контекстное сообщение о состоянии (успех, предупреждение, ошибка, инфо) в блоке контента/форме.
Не использовать: системное уведомление вне контекста страницы (Toast/Notification); ошибка валидации конкретного поля формы (использовать Error-состояние Input/Select/Textarea).

Кастомизация
- type: Info / Success / Warning / Error, по умолчанию Info
- icon: True / False, по умолчанию True
- description: True / False, по умолчанию True
- closeButton: True / False, по умолчанию True

Доступность
- ARIA-роль: status / alert (alert — для Error/Warning, status — для Info/Success)
- ARIA-атрибуты: aria-live="polite" (или "assertive" для Error)
- Keyboard: Tab к кнопкам действий и кнопке закрытия, Enter/Space для активации

Интерактивность (события)
- onClose — клик по кнопке закрытия (crossIcon) — скрывает баннер
- onClick (actions) — клик по одной из кнопок в блоке actions — см. Button

Токены / переменные
- bg/info — rgba(16,91,198,0.3)
- bg/success — rgba(2,139,78,0.3)
- bg/warning — rgba(236,155,5,0.3)
- bg/danger — rgba(174,40,29,0.3)
- text-and-icons/info — #3d89f5
- text-and-icons/success — #03d879
- text-and-icons/warning — #febe4d
- text-and-icons/danger — #e64e41
- text-and-icons/on-surface — #f1f1f1
- border/outline — #d7d7d7
- radius/m — 8px
- radius/xs — 4px
- radius/btn-radius-large — 8px
- font/size/body1 — 16px
- font/line-height/body1-condensed — 20px (Title)
- font/line-height/body1 — 24px (Description)

Связанные компоненты
Icon-Button — кнопка закрытия. Button — кнопки в actions. Input / Select / Textarea — для ошибок полей использовать их встроенное Error-состояние.

## Variants

- `type`: 'info' | 'success' | 'warning' | 'error'

## Structure

- INSTANCE "icon" (component instance)
- FRAME "content"
  - FRAME "text_block"
    - TEXT "title"
    - TEXT "text"
  - FRAME "actions"
    - INSTANCE "Button" (component instance)
- INSTANCE "Icon-Button" (component instance)
