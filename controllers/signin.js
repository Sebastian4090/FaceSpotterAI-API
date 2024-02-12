import {getAuthTokenId, createSessions} from './token.js'

const handleSignin = (db, bcrypt, req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }
    return db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compare(password, data[0].hash)
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                return user[0]})
            .catch(err => Promise.reject('unable to get user'))
            } else {
                Promise.reject('wrong credentials')
            }
        })
    .catch(err => Promise.reject('wrong credentials'))
}

const signinAuthentication = (db, bcrypt, redisClient) => (req, res) => {
     const { authorization } = req.headers;
     return authorization ? getAuthTokenId(req, res, redisClient) : 
     handleSignin(db, bcrypt, req, res)
     .then(data => {
        return data.id && data.email ? createSessions(data, redisClient) : Promise.reject(data)
    })
     .then(session => res.json(session))
     .catch(err => res.status(400).json('unable to signin'))
}

export default signinAuthentication;

