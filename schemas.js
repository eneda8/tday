const BaseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

// Define an extension for Joi to sanitize/escape HTML 
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
                    disallowedTagsMode: "recursiveEscape"
                });
                return clean;
                
            }
        }
    }
});

// Create a new instance of Joi by extending BaseJoi with the 'escapeHTML' extension
const Joi = BaseJoi.extend(extension)

// Schema for the 'post' object
// It includes validation rules for the 'rating', 'date', 'body', and 'image' fields
module.exports.postSchema = Joi.object({
    post: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        date: Joi.string(),
        body: Joi.string().optional().allow("").escapeHTML(),
        image: Joi.string()
    }).required(),
    deleteImage: Joi.array()
})

// Schema for the 'comment' object
// It includes validation rules for the 'body' and 'image' fields
module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML(),
        image: Joi.string(),
    }).required()
})

// Schema for the 'journal' object
// It includes validation rules for the 'body' and 'title' fields
module.exports.journalSchema = Joi.object({
    journal: Joi.object({
        body: Joi.string().required().escapeHTML(),
        title: Joi.string().escapeHTML()
    }).required()
})

