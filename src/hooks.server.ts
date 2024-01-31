/*
import {  pool } from './lib/database/db';

export async function handle({event, resolve}){
    if (event.url.pathname === "/" || event.url.pathname === "/dashboard/upload") {
        //event.locals.db = dbConn;
        event.locals.pool = pool;
    }

    return resolve(event);
}
*/