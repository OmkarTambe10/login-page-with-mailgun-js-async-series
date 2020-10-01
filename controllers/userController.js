const model = require("../models/userModel.js");
const signInDataModel = require("../models/signInDataModel.js");
const async = require("async");

const mailgun = require("mailgun-js");
const DOMAIN = "sandboxf276552b8e814072a3325200877d107a.mailgun.org";
const mg = mailgun({apiKey: "88c50ca6235e8ddfa59f17d5af5627fd-aff2d1b9-84ce9e7d", domain: DOMAIN});
module.exports = {
    addData : function(req, res){
        try{
            var formData = req.body;
            formData.createdon = new Date();
            var data = new model(formData);
            data.save(function(error,result){
                if(error){
                    return res.status(500).json({
                        success : false,
                        message : "Internal server error",
                        err : error,
                        data : []
                    })
                }else{
                    return res.status(200).json({
                        success : true,
                        message : "Data successfully saved",
                        err : [],
                        data : result
                    })
                }
            });
        }catch(e){
            return res.status(500).json({
                err: e,
                success : false
            })
        }
    },
    signInUser : function(req, res){
        try{
            var formData = req.body;
            console.log("formData",formData);
            async.series({
                checkIfUserExist : function(cb){
                    model.findOne({
                        "email" : formData.email,
                        "password" : formData.password
                    }).lean().exec(function(error1, result1){
                        console.log("checkIfUserExist");
                        if(error1){
                            cb(error1)
                        }else{
                            console.log(result1);
                            if(result1.email){
                                cb(null, "user Exists.")
                            }else{
                                cb("user Doesnt exists!.")
                            }
                        }
                    });
                },
                signUp : function(cb){
                    signInDataModel.update({
                        "email" : formData.email
                    },
                    {
                        $set : {
                            "email" : formData.email,
                            "signInFlag" : "Y",
                            "createdon" : new Date()
                        }
                    },{
                        "upsert" : true
                    }).lean().exec(function(error2, result2){
                        console.log("signup")
                        if(error2){
                            cb(error2)
                        }else{
                            cb(null,result2)
                        }
                    });
                },
                sendMail : function(cb){
                    const data = {
                        from: "Mailgun Sandbox <omkar18cool@gmail.com>",
                        to: formData.email,
                        subject: "Hello",
                        text: "Sign-in completed!"
                    };
                    mg.messages().send(data, function (error3, body) {
                        console.log("error3",error3);
                        console.log("sendmail",body);
                        if(error3){
                            cb(error3)
                            signInDataModel.deleteOne({
                                "email" : formData.email
                            }).lean().exec(function(error4, result4){
                                if(error4){
                                    cb(error4)
                                }else{
                                    cb(null,"Error while sending email.")
                                }
                            });
                        }else{

                            // cb(null, body);
                            if(body.message == "Queued. Thank you."){
                                signInDataModel.update({
                                    "email" : formData.email
                                },
                                {
                                    $set : {
                                        "emailFlag" : "Y",
                                    }
                                }).lean().exec(function(error5, result5){
                                    console.log("signup")
                                    if(error5){
                                        cb(error5)
                                    }else{
                                        cb(null,"email sent successfully.")
                                    }
                                });        
                            }
                        }
                    });
                }
            }, function(error, result){
                console.log("after async series",result);
                if(error){
                    return res.status(500).json({
                        success : false,
                        message : "Internal server error",
                        err : error,
                        data : []
                    })                   
                }else{
                    var testCase = "";
                    if(result.checkIfUserExist){
                        testCase += "user exist"
                    }else{
                        testCase += "not a valid email ID/ user data"
                    }
                    if(result.signUp){
                        testCase += "/  signup done"
                    }else{
                        testCase += "/ error while signup"
                    }
                    if(result.sendMail){
                        testCase += "/ email sent successfully."
                    }else{
                        testCase += "/ but email not sent."
                    }
                    return res.status(200).json({
                        success : true,
                        message : testCase,
                        err : [],
                        data : result
                    })
                }
            })

        }catch(e){
            return res.status(500).json({
                err: e,
                success : false
            })
        }
    }

}