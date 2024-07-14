import Joi from 'joi';

const addCategoryVal = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    user:Joi.string().hex().length(24).required(),
    status:Joi.string()
})

const updateCategoryVal = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    user:Joi.string().hex().length(24).optional(),
})

export {
    addCategoryVal,
    updateCategoryVal
}