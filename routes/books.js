var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
const {
    Book,
    Category,
    BookCategory,
    CheckOut,
    User
} = require('../models')
const {Op, literal} = require('sequelize');
const {
    JWTCheck
} = require('../libs/jwt')

// middleware
var checkIDInput = function (req, res, next) {  
    if(isNaN(req.params.id)) {
        res.status(400).json({'message':'invalid ID'});
    } else {
        next();
    }
};

var checkIDExist = function (req, res, next) {  
    Book.count({ where: { id: req.params.id, isDeleted: false } }).then(count => {
        if (count != 0) {
            next();
        } else {
            res.status(404).json({
                'message': 'Book does not exists or deleted'
            });
        }
    }); 
};

var isAvailable = function (req, res, next) {
    CheckOut.count({
        where: {
            bookID: req.params.id
        }
    }).then(count => {
        if (count != 0) {
            res.status(404).json({
                'message': 'Book still borrowed by someone'
            });
        } else {
            next();
        }
    });
}

router.get('/', [JWTCheck], function (req, res) {
    categoryID = parseInt(req.query.category_id) || 0;

    option = {
        attributes: {
            exclude: ['isDeleted', 'userID'],
            include: [
                [literal('IF(borrowed_by.userID, false, true)'), 'isAvailable']
            ],
        },
        where: {
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

    if (categoryID != NaN && categoryID > 0) {
        cond = {
            id: categoryID
        }
        option.include[0].where = []
        option.include[0].where.push(cond)
    }

    Book.findAll(option).then(books => {
        data = {
            'message': 'Success to get book list',
            'data': books
        }
        res.status(200).json(data);
    });
});

router.post('/', [JWTCheck], function (req, res) {
    upsertCategories = () => {
        const categories = req.body.category
        if (categories.length > 0) {
            categories.forEach(i => {
                Category.findOrCreate({
                    where: {
                        name: i
                    },
                    defaults: {
                        name: i
                    }
                })
            });
        }
        return categories
    }

    Promise.all([
        upsertCategories(),
    ])
    .then(cat => {
        return [
            cat,
            Category.findAll({
                where: {
                    name: {
                        [Op.in]: cat
                    }
                }
            })
        ]
    })
    .spread((catArr, catDB) => {
        return [
            Book.create({
                title: req.body.title,
                author: req.body.author,
                publisher: req.body.publisher,
                isDeleted: false,
                userID: req.userID
            }),
            catArr,
            catDB
        ]
    })
    .spread((book, catArr, catDB) => {
        data = []
        catDB.forEach(category => {
            data.push({
                'bookID': book.dataValues.id,
                'categoryID': category.dataValues.id
            })
        })
        console.log(data)
        BookCategory.bulkCreate(data);
        return book
    })
    .then(book => {
        resp = {
            'message': 'Success to submit book',
            'data' : req.body,
        }
        res.json(resp)
    })
});

router.get('/:id', [JWTCheck, checkIDInput, checkIDExist], function (req, res) {
    option = {
        attributes: {
            exclude: ['isDeleted', 'userID'],
            include: [
                [literal('IF(borrowed_by.userID, false, true)'), 'isAvailable']
            ],
        },
        where: {
            isDeleted: false,
            id: req.params.id
        },
        include: [{
            model: Category,
            as: 'categories',
            through: {
                attributes: []
            }}, {
                model: CheckOut,
                as: 'borrowed_by',
                attributes: []
            }, {
                model: User,
                as: 'user',
                attributes: ['id', 'email']
            }]
    };
    Book.findOne(option).then(book => {
        res.status(200).json({
            'message': 'Success to get book',
            'data': book
        });
    });
});

router.post('/:id/checkout', [JWTCheck, checkIDInput, checkIDExist, isAvailable], async function (req, res) {
      try {
            const book = await Book.findByPk(req.params.id)
            const c = await CheckOut.create({
                bookID: book.dataValues.id,
                userID: req.userID,
                checkOutDate: new Date().toString()
            });
            return res.json({
                'message': `success to check out book #${req.params.id}`
            })
      } catch (err) {
        console.log(err)
        return res.status(500).json({'message': error(err)});
      }
});

router.put('/:id', [JWTCheck, checkIDInput, checkIDExist], function (req, res) {

    upsertCategories = () => {
        const categories = req.body.category
        if (categories.length > 0) {
            categories.forEach(i => {
                Category.findOrCreate({
                    where: {
                        name: i
                    },
                    defaults: {
                        name: i
                    }
                })
            });
        }
        return categories
    }

    Promise.all([
        upsertCategories(),
    ])
    .then(cat => {
        return [
            Category.findAll({
                where: {
                    name: {
                        [Op.in]: cat
                    }
                }
            })
        ]
    })
    .spread((catDB) => {
        return [
            Book.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false,
                }
            })
            .then(book => {
                if (book) {
                    book.update({
                        title: req.body.title,
                        author: req.body.author,
                        publisher: req.body.publisher
                    })
                    return book
                } else {
                    return null
                }
            }),
            catDB
        ]
    })
    .spread((book, catDB) => {
        if (book) {
            BookCategory.destroy({
                where: {
                    bookID: book.dataValues.id
                }
            })
            return [book, catDB]
        } else {
            return [book, catDB]
        }
    })
    .spread((book, catDB) => {
        console.log(book, catDB)
        if (book) {
            data = []
            catDB.forEach(category => {
                data.push({
                    'bookID': book.dataValues.id,
                    'categoryID': category.dataValues.id
                })
            })
            // console.log(data)
            BookCategory.bulkCreate(data);
        }
        return book
    })
    .then(book => {
        if (book) {
            status = 200
            data = {
                'message': 'Success to edit book',
                'data': req.body,
            }

        } else {
            status = 404
            data = {
                'message': 'No book edited',
                'data': {},
            }
        }

        res.status(status).json(data)
    })
});

router.delete('/:id', [JWTCheck, checkIDInput, checkIDExist], function (req, res) {
    Book.update({
        isDeleted: true
    }, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.status(200).json(result);
    });
});

module.exports = router;