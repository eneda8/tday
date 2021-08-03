const Joi = require("joi");

module.exports.postSchema = Joi.object({
    post: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
        timestamp: Joi.date()
        // image: Joi.string()
    }).required(),
    deleteImage: Joi.array()
})

// module.exports.userSchema = Joi.object({
//     user: Joi.object({
//         email: Joi.string().email().required(),
//         username: Joi.string().required(),
//         birthday: Joi.date().min("1-1-1900").max("12-31-2015").required(),
//         sex: Joi.string().required,
//         country: Joi.string().required,
//     }).required()
// })

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
        image: Joi.string(),
        timestamp: Joi.date()
    }).required()
})



