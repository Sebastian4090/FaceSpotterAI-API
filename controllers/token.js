import jsonwebtoken from 'jsonwebtoken';

const getAuthTokenId = async (req, res, redisClient) => {
    const { authorization } = req.headers;
    console.log(authorization)
    await redisClient.get(authorization)
    .then(reply => {
        // Check if token exists in database!
        if (!reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({id: reply})
    })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jsonwebtoken.sign(jwtPayload, 'process.env.JWTSECRET', { expiresIn: '2 days' });
}

const setToken = (key, value, redisClient) => {
    return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user, redisClient) => {
    // JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id, redisClient)
        .then(() => { 
            return {success: 'true', userId: id, token: token} })
        .catch(console.log)
}

export {
    getAuthTokenId,
    createSessions
}