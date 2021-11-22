const BaseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.postSchema = Joi.object({
    post: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().optional().allow("").escapeHTML(),
        timestamp: Joi.date(),
        image: Joi.string()
    }).required(),
    deleteImage: Joi.array()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML(),
        image: Joi.string(),
        timestamp: Joi.date()
    }).required()
})

module.exports.journalSchema = Joi.object({
    journal: Joi.object({
        body: Joi.string().required().escapeHTML(),
        title: Joi.string().escapeHTML()
    }).required()
})

