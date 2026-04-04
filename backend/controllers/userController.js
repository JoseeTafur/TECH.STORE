const User = require('../models/User');

// @desc    Obtener todos los usuarios (Solo Admin)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        if (users) {
            res.json(users);
        } else {
            res.status(404).json({ message: 'No se encontraron usuarios' });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Error en el servidor al obtener usuarios',
            error: error.message 
        });
    }
};

// @desc    Obtener el perfil del usuario actual
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        // Usamos req.user._id que viene del token
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.fullname = req.body.fullname || user.fullname;
        
        // Manejo de imagen robusto
        if (req.file) {
    // Guardamos solo la ruta relativa, sin el http://localhost:3000
    user.profilePic = `/uploads/profiles/${req.file.filename}`;
}

        // Solo actualizar password si el usuario envió algo
        if (req.body.password && req.body.password.trim() !== "") {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePic: updatedUser.profilePic
        });

    } catch (error) {
        console.error("❌ Error en updateUserProfile:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
// @desc    Actualizar rol de usuario (Solo Admin)
exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};