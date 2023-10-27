//#region Эта хуита правильно работает, не трогать
const WebSocket = require('ws');
const axios = require('axios');
const express = require('express');
const cron = require('node-cron');
const fs = require('fs');

//#region Данные для авторизации, константы
const app = express();
const port = 3000;

const url = 'http://127.0.0.1/redmine';
const apiKey = '11ee1450540d99677820bd5332bb85401030d560';
//#endregion

// Объект для хранения задач
let issues = { issues: [] };

//#region Подключаемся к WebSocket
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    console.log('Соединение установлено');
});

ws.on('message', function incoming(data) {
    console.log(`Получено сообщение: ${data}`);
});
//#endregion

//#region Функция для проверки новых задач и изменений в существующих задачах
async function checkForUpdates() {
    try {
        const response = await axios.get(`${url}/issues.json`, {
            headers: { 'X-Redmine-API-Key': apiKey },
        });

        const newTasks = response.data.issues;

        // Проверяем, есть ли новые задачи
        if (newTasks.length !== issues.issues.length) {
            // Получаем только новые задачи
            const diffTasks = newTasks.filter((task) => !issues.issues.find((t) => t.id === task.id));

            // Обновляем объект задач
            issues.issues = newTasks;

            // Сохраняем задачи в файле tasks.json
            fs.writeFileSync('tasks.json', JSON.stringify(issues));

            // Отправляем сообщение на сервер Redmine о новых задачах
            diffTasks.forEach((task) => {
                ws.send(`Новая задача: ${task.subject}`);
            });
        }

        // Проверяем, были ли изменения в существующих задачах
        for (const task of issues.issues) {
            const existingTask = newTasks.find((t) => t.id === task.id);

            if (existingTask && JSON.stringify(existingTask) !== JSON.stringify(task)) {
                // Обновляем задачу в объекте
                issues.issues[issues.issues.indexOf(task)] = existingTask;

                // Сохраняем задачи в файле tasks.json
                fs.writeFileSync('tasks.json', JSON.stringify(issues));

                // Отправляем сообщение на сервер Redmine об изменении задачи
                ws.send(`Задача отредактирована: ${existingTask.subject}`);
            }
        }

        // Проверяем, были ли удалены задачи
        for (const task of issues.issues) {
            const existingTask = newTasks.find((t) => t.id === task.id);

            if (!existingTask) {
                // Удаляем задачу из объекта
                issues.issues.splice(issues.issues.indexOf(task), 1);

                // Сохраняем задачи в файле tasks.json
                fs.writeFileSync('tasks.json', JSON.stringify(issues));

                // Отправляем сообщение на сервер Redmine об удалении задачи
                ws.send(`Задача удалена: ${task.subject}`);
            }
        }

        // Выводим список задач в консоль
        console.log('Список задач:');
        issues.issues.forEach((task) => {
            console.log(`- ${task.subject}`);
        });
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error.message);
    }
}
//#endregion

//#region Загружаем сохраненные задачи из файла tasks.json (если есть)
if (fs.existsSync('tasks.json')) {
    const tasksData = fs.readFileSync('tasks.json', 'utf8');
    issues = JSON.parse(tasksData);
}
//#endregion

//#region Регистрируем обработчик маршрута /redmine-webhook
app.post('/redmine-webhook', (req, res) => {
    // Вызываем функцию checkForUpdates при получении запроса от Redmine
    checkForUpdates();

    // Отправляем успешный ответ
    res.sendStatus(200);

    // Сохраняем задачи в файле tasks.json
    fs.writeFileSync('tasks.json', JSON.stringify(issues));
});
//#endregion

// Запускаем сервер
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

// Запускаем функцию checkForUpdates каждые 20 секунд
cron.schedule('*/10 * * * * *', () => {
    checkForUpdates();
});

//#endregion