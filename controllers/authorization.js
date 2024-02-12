const requireAuth = (redisClient) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json('Unauthorized');
        }
        await redisClient.get(authorization)
            .then(reply => {
                if (!reply) {
                    return res.status(400).json('Unauthorized');
                }
                return next();
            })
    }
}

export default requireAuth;