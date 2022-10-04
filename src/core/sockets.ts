
import { createClient } from 'redis';
import { createServer } from "http";
import { Server } from "socket.io";
import { tokenIsValidSocket } from "../middlewares/auth.middleware";
import User from "../models/user/user";


export const socketServer = async(app) => {
    
    const server = createServer(app);
    const io = new Server(server, { /* options */ });
    const redisClient = createClient({
        url: 'redis://default:cOdlLDjp5YKs7fyDPLUdEZIALL57XFAD@redis-15442.c11.us-east-1-2.ec2.cloud.redislabs.com:15442'
    });
    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    io.on('connection', async (socket) => {
        console.log('a user connected');
        socket.emit('message', 'Hello World!');

        socket.on('msg', (data) => {
            console.log(data);
            socket.emit('msg', data);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        })



        socket.on('join_to_restaurant_table', async (data) => {
            await redisClient.connect();
            let parsedData = JSON.parse(data);
            let userId = await tokenIsValidSocket(parsedData.token);
            if (!userId) {
                let timestamp = Date.now().toString();
                socket.join(timestamp);
                io.to(timestamp).emit('error', { reason: 'no userId' });
                return;
            }

            let user = await User.findById(userId)
            JSON.stringify(user.toJSON())
            let currentTable = await redisClient.get(`table${parsedData.table_id}`)
            let currentTableParsed: any = {}
            if (!currentTable) {
                currentTableParsed.usersConnected = [userId]
            } else {
                currentTableParsed = JSON.parse(currentTable)
                currentTableParsed.usersConnected = [...currentTableParsed.usersConnected, userId]
            }
            console.log(currentTableParsed);
            redisClient.set(`table${parsedData.table_id}`, JSON.stringify(currentTableParsed))
            console.log(userId);
            socket.join(parsedData.table_id);
            console.log(parsedData.table_id);
            io.to(parsedData.table_id).emit('new_user_joined', { ...parsedData, 'connected': true, userName: `${user.firstName} ${user.lastName}` });
        })
    });

    server.listen(process.env.PORT, () => console.log('Listening at port', process.env.PORT));

    
}