var express = require('express');
var Category = require('../models').Category;
var router = express.Router();
const {
    JWTCheck
} = require('../libs/jwt')

router.get('/', [JWTCheck], function (req, res) {
    Category.findAll().then(cat => {
        res.status(200).json({
            'message': 'Success to get categories',
            'data': cat
        });
    });
});

module.exports = router;