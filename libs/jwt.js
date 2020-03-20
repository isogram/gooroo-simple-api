const jwt = require('jsonwebtoken');
const secretKey = 'gooroo123'

const JWTSign = (payload) => {
    options = {
        expiresIn: 86400 // expires in 24 hours
    }
    return jwt.sign(payload, secretKey, options);
}

const JWTVerify = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return false;
    }
}

const JWTDecode = (token) => {
    return jwt.decode(token, {
        complete: true
    });
}

// middleware
const JWTCheck = (req, res, next) => {
    const bearer = req.headers['authorization'] || '';
    const token = bearer.split(" ")[1]

    if (!token) {
        return res.status(403).send({
            'message': 'No token provided'
        });
    }

    verify = JWTVerify(token)
    if (verify) {
        decoded = JWTDecode(token)
        // if everything good, save to request for use in other routes
        // refresh token after request
        // sign new payload
        pl = decoded.payload
        req.userID = pl.id;
        payload = {
            'id': pl.id,
            'email': pl.email
        }
        newToken = JWTSign(payload)
        res.header("X-Next-Token", newToken);

        next();
    } else {
        return res.status(500).send({
            'message': 'Failed to authenticate token'
        });
    }
}

module.exports = {
    JWTSign,
    JWTVerify,
    JWTDecode,
    JWTCheck,
}