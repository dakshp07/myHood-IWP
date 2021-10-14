const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession =async function(req, res){
    try {
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422,{
                message: 'invslid'
            });
        } 

        return res.json(200, {
            message: 'success',
            data: {
                token: jwt.sign(user.toJSON(), 'irfan', {expiresIn: '1000'})
            }
        })
    } catch (error) {
        return res.json(500,{
            message: 'error'
        });
    }
}