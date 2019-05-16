'use strict';
var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { 
    username:{
        type : DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type : DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type : DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate:{
            isEmail : true,
            isUnique: function (value, next) {
                var self = this;
                User.findOne({where: {email: value}})
                    .then(function (user) {
                        // reject if a different user wants to use the same email
                        if (user && self.id !== user.id) {
                            return next('Email already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            }
        },
    },
    role:{
        type : DataTypes.INTEGER,
        allowNull:false,
    },
    password_reset_token:{
        type : DataTypes.INTEGER,
        allowNull:true,
    },
    status:{
        type : DataTypes.INTEGER,
        allowNull:true,
    },
    createdAt: {
        type : DataTypes.DATE,
        allowNull:true,
    },
    updatedAt:{
        type : DataTypes.DATE,
        allowNull:true,
    } 
}, {});
User.beforeSave((user, options) => {
    if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
    user.password_reset_token='';
    user.status=10;
    user.createdAt=new Date();
    user.updatedAt=new Date();
    // 1. registered
});
User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}; 
User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};