const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema; 

const userSchema = new Schema(
    {
        firstName: {
            type: String, 
            required: [true, 'First name is required. ']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required.']
        }, 
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required.'],
            match: [/.+@.+\..+/, 'Please enter a valid email address.']
        }, 
        password: {
            type: String,
            required: [true, 'Password is required.']
        }
    },
    {
        collection: 'users',
        timestamps: true
    }
);

userSchema.pre('save', async function(next) {
    const user = this;

    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists, please choose another one.'));
    } else {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('user', userSchema);