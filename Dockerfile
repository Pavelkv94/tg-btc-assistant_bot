#базовый Image
FROM node

#рабочая директория указываем контекст где лежат файлы и папки
WORKDIR /app

#копируем package.json
COPY package.json /app/

#устанавливаем npm пакеты
RUN npm install

#копирует файлы/папки из проекта в докер-image
COPY . .

#переменная
ENV PORT 3010

#указывает на порт в докере
EXPOSE $PORT

#наше хранилище
VOLUME [ "/app/data" ]

# команда запуска приложения
CMD ["npm","start"]