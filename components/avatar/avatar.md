# avatar

## Description

Описание
Avatar — круглый элемент представления пользователя: фото, инициалы, дефолтная иконка или зона загрузки фото. Опционально сопровождается вспомогательным компонентом online-indicator, размещённым в правом нижнем углу.

Поведение
Переключается между вариантами через props image, initials, upload. Hover-состояние доступно для варианта upload (появление затемняющего слоя hover/hover-color). Индикатор онлайна — отдельный компонент, накладывается поверх аватара через showIndicator.

Состояния
- Default — показывает фото / инициалы / дефолтную иконку
- Hover — только для upload-варианта, затемняющий слой поверх
- Upload (пусто) — пунктирная рамка border/outline dashed, иконка camera/photo_add по центру

Виды компонента
- Image — фото пользователя, object-cover, круглая обрезка
- Initials — инициалы (текст) на фоне bg/surface-highest
- Default (user icon) — дефолтная иконка человека на фоне bg/surface-highest
- Upload — пунктирная рамка + иконка camera/photo_add, для незаполненного/редактируемого аватара

Анатомия элемента
- Изображение / инициалы / иконка (взаимоисключающе)
- online-indicator (опционально) — маленький кружок в правом нижнем углу, поверх аватара

Размеры и отступы
- Размер (внешний): 28px, контент до 32x32px
- Padding: 6px (для upload/default вариантов)
- Border radius: radius/full (1000px)
- Border (upload): 1px dashed border/outline

Когда использовать / не использовать
Использовать: нужно показать пользователя (фото/инициалы) в списках, шапках, профилях; нужен статус онлайн/офлайн; нужна зона загрузки фото профиля.
Не использовать: нужен крупный портрет/баннер — использовать полноразмерное изображение.

Кастомизация
- image: True/False, по умолчанию False
- initials: True/False, по умолчанию False
- upload: True/False, по умолчанию True
- hover: True/False, по умолчанию False
- showIndicator: True/False, по умолчанию True

Доступность
- ARIA-роль: img (для image/initials варианта)
- ARIA-атрибуты: alt-текст с именем пользователя; aria-label="online"/"offline" для индикатора
- Keyboard: не интерактивен, кроме upload-варианта (кнопка загрузки — фокусируема)

Интерактивность (события)
- onClick — клик по upload-варианту — открытие диалога выбора файла
- onHover — наведение на upload-вариант — затемняющий слой

Токены / переменные
- bg/surface-highest — #727272
- border/outline — #d7d7d7 (dashed, upload)
- hover/hover-color — rgba(255,255,255,0.12)
- text-and-icons/on-surface — #f1f1f1
- radius/full — 1000px

Связанные компоненты
online-indicator — вспомогательный компонент, статус онлайн/офлайн поверх Avatar. Dropdown — часто используется совместно (профильное меню пользователя).

## Variants

- `hover`: boolean
- `image`: boolean
- `initials`: boolean
- `upload`: boolean

## Structure

- TEXT "text" — when `initials` is `true`
- INSTANCE "online-indicator" (component instance) — when `upload` is `false`
- INSTANCE "user" (component instance) — present in 1/5 variants
- RECTANGLE "state" — when `hover` is `true`
- INSTANCE "photo_add" (component instance) — when `upload` is `true`
