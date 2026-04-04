const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ESQUEMAS MONGODB

const userSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required:[true, 'Por favor, añade un nombre...']
    },

    email : {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, añade un correo electrónico válido...']
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },

    profilePic: { 
        type: String, 
        default: '' 
    },

    cart: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, 
            default: 1 
        }
    }],

    role : {
        type: String,
        enum: ['ADMIN', 'VENDEDOR', 'CLIENTE'],
        default: 'CLIENTE' 
    },

    createAt : {
        type: Date,
        default: Date.now
    },

    orderHistory: [{
    orderId: { type: String },
    date: { type: Date, default: Date.now },
    total: { type: Number },
    items: Array
  }]
}, { timestamps: true });

//MIDDLEWARE

userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);