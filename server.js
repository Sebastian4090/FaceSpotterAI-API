import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import register from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import {handleImage, handleApiCall} from './controllers/image.js';

const PORT = process.env.PORT || 3000;


const db = knex({
    client: process.env.CLIENT,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false},
      host : process.env.HOST,
      port : process.env.DATABASE_PORT,
      user : process.env.USER,
      password : process.env.PASSWORD,
      database : process.env.DATABASE
    }
  });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { handleApiCall(req, res) })

app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`);
})
