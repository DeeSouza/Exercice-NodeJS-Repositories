const { isUuid } = require("uuidv4");

module.exports = () => {
    return (request, response, next) => {
        const { id } = request.params;

        if(!isUuid(id)){
            return response.status(400).json({
                error: 'Esse não é um número de ID válido.',
                params: {
                    id
                }
            })
        }

        return next();
    }
}