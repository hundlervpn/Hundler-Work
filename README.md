# WorkHub

Биржа заказов по типу hh.ru — площадка для **заказчиков** и **исполнителей**.
Мобильный интерфейс: поиск заданий, категории, карточки заказов, отклики.

## Стек

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

Дизайн собран с применением принципов [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better): концентрические радиусы, тени вместо бордеров, stagger-анимации, tabular-nums, оптическое выравнивание, `scale(0.96)` на нажатие.

Фирменная палитра: **чёрный · белый · красный · фиолетовый**.

## Локальный запуск

```bash
git clone https://github.com/hundlervpn/Hundler-Work.git
cd Hundler-Work
npm install
npm run dev
```

Открой http://localhost:3000

## Сборка

```bash
npm run build
npm run start
```