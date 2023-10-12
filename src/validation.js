
const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string()
        .min(5)
        .required(),
})

export { schema }
