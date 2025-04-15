const {Router} = require('express')
const {
    getLoginPage,
    loginUser,
    logout,
    getRegisterPage,
    registerUser
} = require('../controllers/auth.controller')
const router = Router() 
const {guest, protected} = require('../middlewares/auth')
const {body, check}= require('express-validator')


router.get('/login', guest,  getLoginPage)
router.post('/login', 
    [check('email')
        .isEmail()
        .withMessage('Xato email kiritdingiz!', `Parol kamida 6 ta belgi bo'lishi kerak`), 
    check('password')
        .isLength({min: 6})
    ],
    guest,  loginUser)
router.get('/logout', protected, logout)
router.get('/registration', guest,  getRegisterPage)
router.post('/registration',
    [body('email', 'Xato email kiritdingiz!').isEmail(),
    body('name', `Nomlarda raqamlar bo'lishi mumkin emas`).isAlpha(),
    body('password', 'Please enter password with minimum 6 characters and with alphabetical and numeric values').isEmail()
], guest,  registerUser)


module.exports = router                                                                  