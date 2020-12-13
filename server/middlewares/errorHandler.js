const unknownEndpoint = (request, response) => {
    response.status(404).json({ message: 'Unknown Endpoint' })
}

module.exports = unknownEndpoint;