import jsonwebtoken from 'jsonwebtoken';

const getAuthTokenId = async (req, res, redisClient) => {
    const { authorization } = req.headers;
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
            console.log('token generated successfully')
            return {success: 'true', userId: id, token: token};
        })
        .catch(err => {
            console.error('Error setting token', err);
        })
}

export {
    getAuthTokenId,
    createSessions
}