# segmented

## Description

Описание
Segmented — сегментированный переключатель (segmented control). Контейнер из вспомогательных элементов Segmented-Item, между которыми пользователь выбирает один активный вариант. Используется как замена группе табов/радио-кнопок в компактном виде.

Поведение
Auto-layout horizontal, gap 4px, padding 4px, оборачивает несколько Segmented-Item. Variant &amp;quot;number&amp;quot; (2-7) — демонстрационный параметр количества items в контейнере, не боевое свойство.

Состояния
- Default — контейнер с items, фон bg/surface-high (#3b3b3b)

Анатомия элемента
- Segmented-Item (×N) — иконка (опционально) + текст (опционально), вспомогательный компонент

Размеры и отступы
- Gap между items: 4px
- Padding: 4px
- Border radius: radius/l (12px)
- Фон: bg/surface-high (#3b3b3b)

Когда использовать / не использовать
Использовать: нужно выбрать один вариант из небольшого фиксированного набора (2-7), все варианты должны быть видны одновременно.
Не использовать: вариантов много (&amp;gt;7) — использовать Dropdown или Tab-Panel; нужен множественный выбор — использовать Checkbox-группу.

Доступность
- ARIA-роль: radiogroup (Segmented) / radio (Segmented-Item)
- ARIA-атрибуты: aria-checked на выбранном item, aria-disabled
- Keyboard: Tab — фокус на группу, стрелки — переключение между items, focus-ring rgba(114,114,114,0.5) (= bg/surface-highest при 50% непрозрачности)

Интерактивность (события)
- onClick — клик по Segmented-Item (не disabled) — переход в Selected, снятие Selected с соседних items
- onFocus — фокус на Segmented-Item клавиатурой — появление focus-ring

Токены / переменные
- bg/surface-high — #3b3b3b
- radius/l — 12px

Связанные компоненты
Segmented-Item — вспомогательный компонент, используется внутри контейнера. Tab-Panel, Dropdown, Radio-Group — альтернативные паттерны выбора.

## Variants

- `icon`: boolean
- `text`: boolean

## Structure

- INSTANCE "Segmented-Item" (component instance)
