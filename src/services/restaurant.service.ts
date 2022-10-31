import { checkUser } from "../core/util/sockets.utils";
import {io, socket} from '../core/sockets';
import * as RestaurantController from '../service_controllers/restaurant.controller';
export const join =  async(data) => {
    
    let userId = await checkUser(data.token);
    if(!userId) return;
    
    socket.join(data.restaurantId);
    io.to(data.restaurantId).emit('say_hi',{hola:"hola"});
};

export const getTableList = async(data)=>{
    let{token, ...restaurantData} = data;
    let userId = await checkUser(token);
    if(!userId) return;
    const tables = await RestaurantController.getTableListController(restaurantData);
    console.log(tables);
    io.to(data.restaurantId).emit('restaurant:tables',{tables:tables});
}