


export const validate = (fn) => {
    return (req, res, next) => {
        let { error } = fn.validate(req.body, { abortEarly: false })
        if (!error) {
            next()
        } else {
            res.status(400).json({ error: error.details.map(e => e.message) })
        }
    }
}