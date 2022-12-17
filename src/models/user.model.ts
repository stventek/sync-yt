import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import sequelize from '../databases/database'
import bcrypt from 'bcrypt'

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});


const genPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const validatePassword = (password : string, instancePassword: string) => {
  return bcrypt.compareSync(password, instancePassword);
};

User.beforeUpdate((instance: any) => {
  instance.password = genPassword(instance.password)
})

User.beforeCreate((instance : any) => {
  instance.password = genPassword(instance.password)
})

export default User;
