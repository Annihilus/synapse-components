# breadcrumbs

## Description

Описание
Breadcrumbs — навигационная цепочка, показывающая путь пользователя от корня до текущей страницы. Собирается из вспомогательного компонента Breadcrumbs-Item (иконка + текст), соединённых иконкой-стрелкой (>, 20px). Текущая (последняя) крошка всегда в состоянии Selected. Вариант number (1-7) в Figma — демонстрационный набор для показа разной длины цепочки, в реальном использовании количество items определяется данными.

Поведение
Некликабельная последняя крошка (Selected=True) визуально выделена — активный текст text-and-icons/on-surface (#f1f1f1) вместо приглушённого text-and-icons/on-surface-low (#a5a5a5). Промежуточные (кликабельные) крошки при Hover получают фон hover/hover-color (rgba(255,255,255,0.12)) и текст также становится on-surface (#f1f1f1).

Анатомия элемента
- Последовательность Breadcrumbs-Item, между каждой парой — иконка arrow (>) 20px
- Последний item в цепочке — всегда Selected=True

Размеры и отступы
- Gap между Item и arrow: 4px
- Arrow size: 20px

Когда использовать / не использовать
Использовать: иерархический путь пользователя (раздел → подраздел → страница), глубина от 2 уровней.
Не использовать: страница на первом уровне вложенности; как основная навигация (использовать меню/табы).

Доступность
Рекомендуется nav с aria-label="breadcrumb", список ol/li, aria-current="page" на текущей крошке. Tab между кликабельными крошками, Enter для перехода.

Токены / переменные
- text-and-icons/on-surface-low — #a5a5a5 (текст некликнутой промежуточной крошки)
- text-and-icons/on-surface — #f1f1f1 (текст текущей/hover крошки)
- hover/hover-color — rgba(255,255,255,0.12) (фон при Hover)
- radius/xs — 4px
- font/size/body1 — 16px
- font/line-height/body1-condensed — 20px

Связанные компоненты
Breadcrumbs-Item — базовая единица цепочки, используется только внутри Breadcrumbs.

## Structure

- INSTANCE "Breadcrumbs-Item" (component instance) — present in 26/27 variants
- INSTANCE "item" (component instance) — present in 2/8 variants
- INSTANCE "arrow" (component instance) — present in 21/22 variants
