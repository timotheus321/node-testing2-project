const request = require('supertest')
const db = require('../data/db-config')
const server = require('../server')
const Joke = require('./jokesModel')

const joke1 = {joke: "why did the chicken cross the road?", punchline: "Because it was free range"}
const joke2 = {joke: "why did the chicken cross the road?", punchline: "to avoid this lame and outdated joke"}

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('jokes').truncate()
})

afterAll(async () => {
    await db.destroy()
})

it('correct env var', () => {
    expect(process.env.DB_ENV).toBe('testing')
})

describe('Jokes model functions', () => {
    describe('create joke', () => {
        it('adds joke to the db', async () => {
            let jokes
            await Joke.createJoke(joke1)
            jokes = await db('jokes')
            expect(jokes).toHaveLength(1)

            await Joke.createJoke(joke2)
            jokes = await db('jokes')
            expect(jokes).toHaveLength(2)
        })
        it('inserted joke and punchline', async () => {
            const joke = await Joke.createJoke(joke1)
            expect(joke).toMatchObject({joke_id:1, ...joke})
        })
    })
    
    describe('[Delete] / - deletle joke', () => {
        it('removes joke from db', async () => {
           const [joke_id] = await db('jokes').insert(joke1)
           let joke = await db('jokes').where({joke_id}).first()
           expect(joke).toBeTruthy()
           await request(server).delete('/jokes/'+ joke_id)
           joke = await db('jokes').where({joke_id}).first()
           expect(joke).toBeFalsy()
        })
        it('respond with the deleted joke', async () => {
            await db('jokes').insert(joke1)
            let joke = await request(server).delete('/jokes/1')
            expect(joke.body).toMatchObject(joke1)
        })
    })
    describe('POST / - Create joke', () => {

        it('should return 201 when joke is created', async () => {
            const newJoke = { joke: 'Why did the chicken cross the road?', punchline: 'To get to the other side!' };
            const res = await request(server).post('/jokes').send(newJoke);
            expect(res.status).toBe(201);
            expect(res.body.joke).toBe(newJoke.joke);
            expect(res.body.punchline).toBe(newJoke.punchline);
        });

        it('should return 400 when joke or punchline is missing', async () => {
            const newJoke = { joke: 'Why did the chicken cross the road?' };
            const res = await request(server).post('/jokes').send(newJoke);
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Joke and punchline are required fields.");
        });

    });
})