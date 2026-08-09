# button

## Description

# Button

## Описание
Базовый компонент кнопки Synapse Design System. Используется для запроса действия: подтверждение, отправка формы, навигация, деструктивные операции.

## Поведение
Реагирует на hover / focus / disabled / loading через варианты компонента. В состоянии Loading лейбл/иконка заменяются спиннером, клик заблокирован. В Disabled клик и hover-реакция отключены.

## Состояния
- Default — базовый вид
- Hover — курсор наведён
- Focus — клавиатурный фокус (кольцо фокуса), вариант Focused
- Active — не выделен отдельным вариантом в компоненте
- Disabled — недоступна, клик и hover-реакция заблокированы
- Loading — идёт асинхронное действие, спиннер вместо контента, клик заблокирован
- Error — не применимо, отдельного Error-варианта нет

## Виды (ColorType)
- Primary — основное действие на экране (одно на группу)
- Secondary — второстепенное действие
- Outlined — альтернативное действие, менее выделено
- Ghost — минимальный акцент, третичное действие
- Danger — деструктивные операции (удаление и т.п.)

## Вид на разных устройствах
- Mobile — отдельного варианта нет, размер выбирается через Size (обычно m/s под touch-таргет)
- Desktop — отдельного варианта нет, доступны все Size (xs–l)

## Анатомия элемента
- State layer — прозрачный оверлей на всю кнопку, меняется по hover/focus/loading
- Label — текст кнопки (опционально, скрывается при Icon=True)
- Icon — опциональная иконка, позиция задаётся Icon=Left/Right/True

## Размеры (Size) и отступы
- l — 48px высота, padding 24/12px (lr/tb), radius 8px (btn-radius-large), типографика Body1 16/24
- m — 40px высота, padding 16/12px (lr/tb), radius 8px (btn-radius-large), типографика Body2 14/16
- s — 32px высота, padding 12/8px (lr/tb), radius 8px (btn-radius-large), типографика Body2 14/16
- xs — 24px высота, padding 8/4px (lr/tb), radius 6px (btn-radius-small), типографика Small 12/16

## Мин / Макс размеры
- Min width: не задан — ширина по контенту (hug), кроме Icon=True (квадрат = высота)
- Max width: не задан
- Min height: 24px (Size=xs)
- Max height: 48px (Size=l)

## Иконка (Icon)
- False — только текст
- Left — иконка перед текстом
- Right — иконка после текста
- True — только иконка, без текста (квадратная кнопка)

## Когда использовать
✅ Основное/второстепенное действие пользователя, требующее клика
✅ Деструктивные операции — вариант Danger
❌ Не использовать для навигации между страницами (использовать Link)
❌ Не использовать Primary больше одного раза в одной группе действий

## Кастомизация
- ColorType: Primary / Secondary / Outlined / Ghost / Danger (по умолчанию Primary)
- Size: xs / s / m / l (по умолчанию m)
- Icon: False / Left / Right / True (по умолчанию False)
- Text: произвольная строка (по умолчанию "Button")

## Доступность
- ARIA-роль: button
- ARIA-атрибуты: aria-disabled на Disabled, aria-busy на Loading
- Keyboard: Tab — фокус, Enter/Space — активация
- Disabled исключает элемент из tab-порядка
- Focused-вариант обязателен для видимого focus-ring

## Интерактивность (события)
- onClick — клик/Enter/Space, если не Disabled и не Loading

## Токены / переменные (Primary, default)
- bg/primary = #7f56d9
- text-and-icons/on-primary = #f1f1f1
- radius/btn-radius-large = 8px
- radius/btn-radius-small = 6px (только Size=xs)
- font/family = Inter
- font/size/body2 = 14px
- font/line-height/body2-condensed = 16px
- Остальные ColorType используют аналогичные токены своей группы (bg/{colortype}, text-and-icons/on-{colortype})

## Связанные компоненты
- Icon — используется внутри Icon=Left/Right/True вариантов
- Link — для навигационных действий вместо кнопки

## Variants

- `colorType`: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger'
- `size`: 'm' | 's' | 'xs' | 'l'
- `icon`: boolean | 'left' | 'right'
- `hover`: boolean
- `disabled`: boolean
- `focused`: boolean
- `loading`: boolean

## Structure

- RECTANGLE "state"
- TEXT "text" — when `icon` is `false` or `left` or `right` and `loading` is `false`
- INSTANCE "icon" (component instance) — when `icon` is `left` or `right` or `true` and `loading` is `false`
- INSTANCE "spinner" (component instance) — when `loading` is `true`
