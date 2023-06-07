import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

// Importación de los módulos necesarios.

const app = express();
const serverHttp = app.listen(8080, () => console.log("Listening"));

const io = new Server(serverHttp);

// Creación de la aplicación Express y el servidor HTTP.

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Configuración del motor de plantillas Handlebars.

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del middleware para el manejo de JSON y URL-encoded.

app.use('/', viewsRouter);

// base de datos de mensajes
const messages = [];


// Configuración del enrutador para las vistas.

io.on('connection', (socket) => {
    console.log('Cliente conectado en el back');

    // Evento que se dispara cuando un cliente se conecta al servidor.

    socket.on('message', (data) => {
        console.log(data);
        messages.push(data);
        io.emit('messageLogs', messages);
    });

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })
});
