const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Este usuario ya existe.' });
        }

        const user = await User.create({
            fullname, // Coincide con el modelo
            email,
            password,
            role
        });

        if (user) {
    res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        token: generarToken(user._id),
    });
}
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscamos el usuario y pedimos explícitamente el password
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullname: user.fullname, // CAMBIO: minúscula para consistencia
                email: user.email,
                role: user.role,
                token: generarToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email o Contraseña no válida' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};