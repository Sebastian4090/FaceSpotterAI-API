const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json('incorrect form submission')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        bcrypt.compare(password, data[0].hash)
        .then(function(result) {
            if (result) {
                db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        });
    })
    .catch(err => {
        res.status(400).json('wrong credentials')
    })
}

export default handleSignin;
