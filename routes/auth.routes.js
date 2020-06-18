const { Router } = require('express')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')

const router = Router()

router.post('/register', 
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), message: 'Некорректные данные при регистрации' })

            const { email, password } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) return res.status(400).json({ message: 'Такой пользователь уже существует' })
            const hasPass = await bcript.hash(password, 12)
            const user = new User({ email, password: hasPass })

            await user.save()
            res.status(201).json({ message: 'Пользователь успешно создан' })
        } catch (error) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)

router.post('/login', 
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), message: 'Некорректные данные при входе в систему' })

            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) return res.status(400).json({ message: 'Пользователь не найден' })

            const isMatch = await bcript.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })

            const token = jwt.sign(
                { userId: user.id, email }, 
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            res.json({ token, userId: user.id })
        } catch (error) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)

module.exports = router