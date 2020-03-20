var express = require('express');
const {
    User,
    Book,
    Category,
    CheckOut,
} = require('../models');
var router = express.Router();
var {Sequelize, literal} = require('sequelize');
var bcrypt = require('bcryptjs');
const {
    JWTSign,
    JWTCheck,
} = require('../libs/jwt')
const {
    checkSchema
} = require('express-validator');

const registerSchema = {
    email: {
        isEmail: true,
        errorMessage: 'Must be a valid email format'
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            options: {
                min: 5
            }
        }
    }
}
router.post('/register', [checkSchema(registerSchema)], function (req, res) {
    User.create({
        email: req.body.email,
        password: req.body.password,
    }).then(user => {
        data = {
            'id': user.id,
            'email': user.email
        }
        res.status(201).json({'message': 'success to register user', 'data': data});
    }).catch(Sequelize.ValidationError, err => {
        res.status(400).json({
            'message': err.message
        });
    }).catch(err => {
        console.log(err.errors);
        res.status(500).json({
            'message': 'internal server error'
        });
    }).error(err => {
        res.status(405).json({
            'message': 'error has occured'
        });
    });
});

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email || '';
        const password = req.body.password || '';
    
        let user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            valid = await bcrypt.compare(password, user.dataValues.password);
            if (valid) {
                payload = {
                    'id' : user.dataValues.id,
                    'email': user.dataValues.email
                }
                token = JWTSign(payload)
                return res.status(200).json({
                    'message': 'Success login',
                    'token': token
                })
            }
        }
        return res.status(401).json({
            'message': 'Email or password does not match'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({'message': 'Internal server error'})
    }
});

router.get('/me', [JWTCheck], async (req, res) => {
    try {
        user = await User.findByPk(req.userID)
        data = {
            'id': user.dataValues.id,
            'email': user.dataValues.email,
        }
        res.status(200).json({
            'message': 'Success to get user information',
            'data': data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            'message': 'Internal server error'
        })
    }
})

router.get('/contributions', [JWTCheck], async (req, res) => {
    try {
        option = {
            attributes: {
                exclude: ['isDeleted', 'userID'],
                include: [
                    [literal('IF(borrowed_by.userID, true, false)'), 'isAvailable']
                ],
            },
            where: {
                userID: req.userID,
                isDeleted: false
            },
            include: [{
                model: Category,
                as: 'categories',
                through: {
                    attributes: []
                },
            }, {
                model: CheckOut,
                as: 'borrowed_by',
                attributes: []
            }, {
                model: User,
                as: 'user',
                attributes: ['id', 'email']
            }]
        };

        books = await Book.findAll(option)
        data = {
            'message': 'Success to get contributed book list',
            'data': books
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            'message': 'Internal server error'
        })
    }
})

module.exports = router;