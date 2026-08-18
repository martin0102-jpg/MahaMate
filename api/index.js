module.exports = (req, res) => {
    // Testing endpoint
    if (req.url === '/api/test') {
        return res.status(200).json({ message: 'Test berhasil!' });
    }
    res.status(200).json({ message: 'API is working!' });
};