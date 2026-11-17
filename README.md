# Ninja — учебный проект

Веб-приложение на **Node.js + Express + MongoDB + Mongoose + EJS**. Тема: история синоби, персонажи, техники и закрытый тренировочный раздел.

## Возможности
- Главная страница с тематическим дизайном.
- Историческая справка о синоби.
- Архив персонажей и техник с фильтрацией по категориям.
- Динамические страницы материалов из MongoDB.
- Навигационное меню формируется из данных базы через middleware.
- Регистрация и вход: если пользователя нет, он создаётся; пароль хранится как scrypt-хеш с солью.
- Сессии сохраняются в MongoDB, ведётся счётчик посещений.
- Закрытые страницы тренировок и профиля.
- Docker Compose для запуска приложения и MongoDB.

## Запуск на macOS
1. Установить Node.js LTS и MongoDB (или Docker Desktop).
2. В терминале перейти в папку проекта.
3. Установить зависимости:
   ```bash
   npm install
   ```
4. Создать файл окружения:
   ```bash
   cp .env.example .env
   ```
5. Запустить MongoDB локально или через Docker:
   ```bash
   docker compose up -d mongo
   ```
6. Заполнить базу начальными данными:
   ```bash
   npm run seed
   ```
7. Запустить сайт:
   ```bash
   npm start
   ```
8. Открыть http://localhost:3000

## Запуск всего проекта через Docker
```bash
docker compose up --build
```
Открыть http://localhost:3000. Для реального развёртывания замените `SESSION_SECRET` на длинное случайное значение.

## Структура
```text
ninja-world/
├── bin/www
├── docs/
├── middlewares/
├── models/
├── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── routes/
├── views/
│   └── layouts/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── app.js
├── checkUser.js
├── createDB.js
├── data.js
├── package.json
├── testMongoose.js
└── topicStyles.js
```

## Маршруты
| URL | Назначение | Доступ |
|---|---|---|
| `/` | Главная | Всем |
| `/history` | История синоби | Всем |
| `/library` | Архив материалов | Всем |
| `/ninja/:nick` | Карточка материала | Всем |
| `/logreg` | Вход и регистрация | Всем |
| `/profile` | Личный профиль | После входа |
| `/training` | Тренировочный зал | После входа |

## Проверка
- `npm run seed` — создать коллекцию материалов и индекс уникального `nick`.
- `node testMongoose.js` — проверить количество документов и индексы.
- `npm test` — выполнить базовую проверку структуры исходных данных.
- `npm start` — запустить сервер.
