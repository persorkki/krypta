import { DATABASE_URL } from '$env/static/private';
import mysql from 'mysql2/promise';

export const pool = mysql.createPool(DATABASE_URL);

