# modal-header

## Description

Описание
Modal-Header — верхний блок модального окна Modal-Window. Содержит иконку, заголовок с опциональным подзаголовком и опциональную строку поиска.

Поведение
Статичный информационный блок — не имеет собственных hover/focus состояний. Видимость всего блока управляется showHead, элементы внутри — icon/caption/search.

Состояния
- Default — единственное состояние, различия только в наборе видимых элементов (icon/caption/search)

Виды компонента
- icon=True/False — иконка или instance-swap слева от заголовка
- caption=True/False — подзаголовок под Title
- search=True/False — строка поиска под заголовком
- showHead=True/False — видимость всего блока head_block (Title+icon+caption)

Вид на разных устройствах
- Mobile: без отдельного варианта, ширина по родителю (Modal-Window)
- Desktop: ширина по родителю

Анатомия элемента
- icon — иконка/instance 24x24px слева от заголовка, опционально
- titleblock — колонка: Title (Bold, body1 16/24, on-surface) и Caption (Regular, body1-condensed 20, on-surface-variant #d7d7d7, опционально)
- search_block — Input с иконкой поиска и placeholder "Search", опционально

Размеры и отступы
- Padding: pl 24px, pr 16px, pt 16px
- Gap (icon/titleblock): 8px
- titleblock gap (Title/Caption): 4px
- titleblock padding-bottom: 12px
- search_block padding-bottom: 12px, padding-right: 8px

Мин / Макс размеры
- Min/Max width: не заданы — по родителю (Modal-Window)
- Min/Max height: не заданы — по контенту

Когда использовать / не использовать
- Использовать: нужен заголовок модального окна с иконкой/подзаголовком/поиском
- Не использовать: для окон без заголовка — установить showHeader=False на Modal-Window

Кастомизация
- icon: True / False, по умолчанию True
- caption: True / False, по умолчанию True
- search: True / False, по умолчанию False
- showHead: True / False, по умолчанию True
- instance: instance-swap для кастомной иконки

Доступность
- ARIA-роль: часть dialog-заголовка, Title связан через aria-labelledby с контейнером Modal-Window
- ARIA-атрибуты: aria-labelledby на Modal-Window указывает на id Title
- Keyboard: search_block (если есть) — Tab для фокуса, ввод текста как обычный Input

Интерактивность (события)
- onSearchChange — ввод текста в search_block (если search=True)

Связанные компоненты
- Modal-Window — родительский контейнер
- Input — используется в search_block
- Icon — используется в слоте icon

Токены / переменные
- text-and-icons/on-surface: #f1f1f1 (Title)
- text-and-icons/on-surface-variant: #d7d7d7 (Caption)
- text-and-icons/on-surface-low: #a5a5a5 (placeholder search)
- font/size/body1: 16px
- font/line-height/body1: 24px (Title)
- font/line-height/body1-condensed: 20px (Caption)

## Structure

- FRAME "head_block"
  - INSTANCE "icon" (component instance)
  - FRAME "titleblock"
    - TEXT "text"
    - TEXT "caption"
