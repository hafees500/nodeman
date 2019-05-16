const User = require('../models').User;
const jwt = require('jsonwebtoken');
module.exports = {
    signup(req, res) {
        User
        .create({
            username: req.body.username,
            password: req.body.password,
            email:req.body.email,
            role:req.body.role,
        })
        .then(user => res.status(201).send({status:true,'data':user,message:''}))
        .catch(error => res.status(400).send({'status':false,'data':error,message:''}));
    },
    login(req,res){
        	User
                .findOne({
                    where: {
                    	username: req.body.username
                    }
                })
                .then((user) => {
                    if (!user) {
                      return res.status(401).send({
						status:false,
						data:[],
                        message: 'Authentication failed. User not found.',
                      });
                    }
                   user.comparePassword(req.body.password, (err, isMatch) => {
                      	if(isMatch && !err) {
							var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
							jwt.verify(token, 'nodeauthsecret', function(err, data){
								console.log(err, data);
							})
							res.json({status: true, data:{token: 'JWT ' + token},message:""});
                      	} else {
                       		res.status(401).send({status: false,data:[], message: 'Authentication failed. Wrong password.'});
                      	}
                    })
                })
                .catch((error) => res.status(400).send(error));
    },
    user(req,res){
        return res.status(200).send({
            status:true,
			data: req.user,
			message:"",
          });
    },
};