import User from "../src/models/user.model";

if(process.env.ENV === 'local')
    User.create({username: 'user', password: '12345', name: 'test', email: 'user@gmail.com'})