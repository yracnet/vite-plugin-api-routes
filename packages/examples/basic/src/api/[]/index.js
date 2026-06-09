export const GET = (req, res, next) => {
    res.json({ name: '/*', url: req.url })
}