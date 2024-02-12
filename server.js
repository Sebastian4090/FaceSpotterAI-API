import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import redis from 'redis';
import helmet from 'helmet';
import morgan from 'morgan';

if (process.env.NODE_ENV === 'development') {
  let dotenv = await import ('dotenv');
  dotenv.config();
}


import handleRegister from './controllers/register.js';
import signinAuthentication from './controllers/signin.js';
import {handleProfileGet, handleProfileUpdate} from './controllers/profile.js';
import {handleImage, handleApiCall} from './controllers/image.js';
import requireAuth from './controllers/authorization.js';

const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL database
const db = knex({
    client: 'pg',
    // connection: process.env.POSTGRES_URI
    connection: {
      // connectionString: pass,
      ssl: { rejectUnauthorized: false},
      host : process.env.POSTGRES_HOST,
      port : process.env.POSTGRES_PORT,
      user : process.env.POSTGRES_USER,
      password : process.env.POSTGRES_PASSWORD,
      database : process.env.POSTGRES_DB
    }
  });

// Test psql connection
  db.raw("SELECT 1").then(() => {
    console.log("PostgreSQL connected");
})
.catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
});

// Connect redis database
const redisClient = redis.createClient({
    url: process.env.REDIS_URI,
    enable_offline_queue: false
});

async function redisConnect() {
   return await redisClient.connect();
}

redisClient.on("error", console.error);

redisConnect();

// Test redis connection
await redisClient.set('key', 'redisConnected');
const value = await redisClient.get('key');
console.log(value);

const app = express();
app.use(morgan('combined'));
app.use(helmet());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', signinAuthentication(db, bcrypt, redisClient))
app.post('/register', handleRegister(db, bcrypt))
app.get('/profile/:id', requireAuth(redisClient), (req, res) => { handleProfileGet(req, res, db) })
app.post('/profile/:id', requireAuth(redisClient), (req, res) => { handleProfileUpdate(req, res, db)})
app.put('/image', requireAuth(redisClient), (req, res) => { handleImage(req, res, db ) })
app.post('/imageurl', requireAuth(redisClient), (req, res) => { handleApiCall(req, res) })

app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`);
})
