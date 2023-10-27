const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;
const dataFilePath = 'tasks.json';

//#region Проверяем наличие файла данных и создаем его, если он не существует
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ issues: [] }));
}
//#endregion

// Читаем данные из файла
let data = JSON.parse(fs.readFileSync(dataFilePath));

//#region Функция для чтения файла tasks.json и обновления переменной data
function updateData() {
    fs.stat(dataFilePath, (err, stats) => {
        if (err) throw err;

        if (stats.mtimeMs > lastModified) {
            fs.readFile(dataFilePath, (err, fileData) => {
                if (err) throw err;

                data = JSON.parse(fileData);
                lastModified = stats.mtimeMs;
            });
        }
    });
}
//#endregion

app.use(cors());

//#region Регистрируем middleware для парсинга тела запроса в формате JSON
app.use(bodyParser.json());
//#endregion

//#region Регистрируем обработчик маршрута POST /issues для принятия данных
app.post('/issues', async (req, res) => {
    const newIssue = req.body;

    // Убедитесь, что issues является массивом
    if (!Array.isArray(data.issues)) {
        data.issues = [];
    }

    // Добавляем новую задачу в массив issues
    data.issues.push(newIssue);

    try {
        // Записываем обновленные данные в файл tasks.json
        await fs.promises.writeFile(dataFilePath, JSON.stringify(data));
        console.log('Данные успешно записаны в файл tasks.json');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка записи данных в файл');
        return;
    }

    // Ищем задачу в tasks.json по ID
    const task = data.issues.find(issue => issue.id === newIssue.id);

    if (!task) {
        console.error(`Задача с ID ${newIssue.id} не найдена`);
        res.status(404).send(`Задача с ID ${newIssue.id} не найдена`);
        return;
    }

    // Создаем объект с требуемым форматом для Redmine
    const redmineIssue = {
        issue: {
            project_id: 1,
            tracker_id: 8,
            status_id: 1,
            priority_id: 2,
            author_id: 1,
            subject: task.subject,
            start_date: task.start_date,
            description: null,
            estimated_hours: null,
            custom_fields: task.custom_fields
        }
    };

    const baseUrl = 'http://127.0.0.1/redmine';
    const apiKey = '11ee1450540d99677820bd5332bb85401030d560';

    try {
        // Отправляем данные в Redmine
        const response = await fetch(`${baseUrl}/issues.json?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(redmineIssue)
        });

        if (response.ok) {
            console.log('Задача успешно создана в Redmine');
            res.send('Данные успешно добавлены');
        } else {
            console.error('Ошибка при создании задачи в Redmine');
            res.status(500).send('Ошибка при создании задачи в Redmine');
        }
    } catch (error) {
        console.error('Ошибка при отправке данных в Redmine', error);
        res.status(500).send('Ошибка при отправке данных в Redmine');
    }
});
//#endregion

//#region Регистрируем обработчик маршрута PUT /issues/:id для обновления задачи по ID
app.put('/issues/:id', (req, res) => {
    const issueId = req.params.id;
    const updatedIssue = req.body;

    // Находим задачу в массиве issues по ID
    const issueIndex = data.issues.findIndex(issue => issue.id === issueId);

    if (issueIndex === -1) {
        console.error(`Задача с ID ${issueId} не найдена`);
        res.status(404).send(`Задача с ID ${issueId} не найдена`);
        return;
    }

    // Обновляем задачу в массиве issues
    data.issues[issueIndex] = updatedIssue;

    // Записываем обновленные данные в файл tasks.json
    fs.writeFile(dataFilePath, JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка записи данных в файл');
        } else {
            console.log(`Данные успешно обновлены для задачи с ID ${issueId}`);
            //res.send('Данные успешно обновлены');
        }
    });

    // Создаем объект с требуемым форматом для обновления задачи в Redmine
    const redmineUpdatedIssue = {
        issue: {
            subject: updatedIssue.subject,
            description: updatedIssue.description,
            custom_fields: updatedIssue.custom_fields
        }
    };

    const baseUrl = 'http://127.0.0.1/redmine';
    const apiKey = '11ee1450540d99677820bd5332bb85401030d560';
    // Отправляем обновленные данные в Redmine
    fetch(`${baseUrl}/issues/${issueId}.json?key=${apiKey}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(redmineUpdatedIssue)
    })
        .then(response => {
            if (response.ok) {
                console.log(`Задача с ID ${issueId} успешно обновлена в Redmine`);
                res.send('Данные успешно обновлены');
            } else {
                console.error(`Ошибка при обновлении задачи с ID ${issueId} в Redmine`);
                res.status(500).send(`Ошибка при обновлении задачи в Redmine`);
            }
        })
        .catch(error => {
            console.error(`Ошибка при отправке данных для обновления задачи с ID ${issueId} в Redmine`, error);
            res.status(500).send(`Ошибка при отправке данных для обновления задачи в Redmine`);
        });
});
//#endregion

//#region Регистрируем обработчик маршрута GET /issues для отправки данных
app.get('/issues', (req, res) => {
    // Получаем список задач из файла tasks.json
    const issues = data.issues;

    // Создаем новый массив, содержащий только необходимые поля для каждой задачи
    const users = issues.map(issue => ({
        id: issue.id,
        contractNo: getFieldValueByName(issue, 'Договор'),
        firstName: getSubject(issue),
        secondName: getSubjectParent(issue),
        email: getFieldValueByName(issue, 'Email клиента'),
        login: getFieldValueByName(issue, 'Логин'),
        passwordText: getFieldValueByName(issue, 'Пароль'),
        country: getFieldValueByName(issue, 'Страна'),
        department: getFieldValueByName(issue, 'Отдел'),
        course: getFieldValueByName(issue, 'Курс'),
        passed: getFieldValueByName(issue, 'Пройден')  === '1' ? 'Да' : 'Нет',
        homework: getFieldValueByName(issue, 'Без ДЗ') === '1' ? 'Да' : 'Нет',
        company: getFieldValueByName(issue, 'Компания'),
        startDate: issue.start_date,
        endDate: new Date(getFieldValueByName(issue, 'Дата завершения'))
    }));

    // Отправляем только массив задач в ответ на запрос
    res.send(users);
});

// Вспомогательная функция для получения значения кастомного поля
function getFieldValueByName(issue, fieldName) {
    const field = issue.custom_fields.find(field => field.name === fieldName);
    return field ? field.value : '';
}

// Вспомогательная функция для получения имени. Да, их пришлось распарсить
function getSubject(issue) {
    const subject = issue.subject || '';
    const nameParts = subject.split(' ');
    return nameParts.length > 1 ? nameParts[1] : '';
}

// Вспомогательная функция для получения фамилии и отчества. Да, их пришлось распарсить
function getSubjectParent(issue) {
    const subject = issue.subject || '';
    const nameParts = subject.split(' ');
    if (nameParts.length > 2) {
        nameParts.splice(1, 1);
    }
    return nameParts.join(' ');
}
//#endregion

let lastModified = fs.statSync(dataFilePath).mtimeMs;

// Запускаем функцию updateData() каждые 5 секунд
setInterval(updateData, 5000);

// Запускаем сервер
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});