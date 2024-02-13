import {createSessions} from './token.js';

const saltRounds = 10;

const handleRegister = (db, bcrypt, req, res) => {
    return new Promise((resolve, reject) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        reject('incorrect form submission')
    }
    bcrypt.hash(password, saltRounds, (err, hash) => {
        return db.transaction(trx => {
            return trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date(),
                })
                .then(user =>{
                    resolve(user[0])})
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => reject('unable to register'))
        });
    })}

const registerAuthentication = (db, bcrypt, redisClient) => (req, res) => {
    return handleRegister(db, bcrypt, req, res)
    .then(user => {
        console.log(redisClient)
        return user.id && user.email ? createSessions(user, redisClient) : Promise.reject(user)
    })
    .then(session => res.json(session))
    .catch(err => console.log(err))
}

export default registerAuthentication;