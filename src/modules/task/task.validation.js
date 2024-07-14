import Joi from 'joi';

const addTaskVal = Joi.object({
    type: Joi.string().valid('text', 'list').optional(),
    status: Joi.string().valid('private', 'public').optional(),
    category: Joi.string().hex().length(24).required(),
    textBody:Joi.any(),
    listItems:Joi.any()
})

const updateTaskVal = Joi.object({
    type: Joi.string().valid('text', 'list').optional(),
    status: Joi.string().valid('private', 'public').optional(),
    category: Joi.string().hex().length(24).optional(),
    textBody:Joi.any(),
    listItems:Joi.any()
})

export {
    addTaskVal,
    updateTaskVal
}