const express = require('express');
const router = express.Router();
const Joke = require('./jokesModel')

function validateJoke(req, res, next) {
    const { joke, punchline } = req.body;
    if (!joke || !punchline) {
        return res.status(400).json({ message: "Joke and punchline are required fields." });
    }
    next();
}

router.post('/', validateJoke, async (req, res) => {
    const jokeData = req.body;
    try {
        const newJoke = await Joke.createJoke(jokeData);
        res.status(201).json(newJoke);
    } catch (err) {
        res.status(500).json({ error: 'Could not create joke' });
    }
});


router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const delJoke = await Joke.deleteJoke(id)
    res.status(200).json(delJoke)
})

module.exports = router;