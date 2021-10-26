const Joi = require("joi");

module.exports.postSchema = Joi.object({
    post: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().optional().allow(""),
        timestamp: Joi.date(),
        image: Joi.string()
    }).required(),
    deleteImage: Joi.array()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
        image: Joi.string(),
        timestamp: Joi.date()
    }).required()
})



