import express from 'express'
import db from '../db/conn.mjs'
import { ObjectId } from 'mongodb'

const router = express.Router()

router.get('/', async (req, res) => {
    const collection = await db.collection('posts')
    const result = await collection.find({})
        .limit(50)
        .toArray()
    
    res.status(200).json(successResponse(result))
})

router.get('/latest', async (req, res) => {
    const collection = await db.collection('posts')
    const results = await collection.aggregate([
        {'$project': {author: 1, title: 1, tags: 1, date: 1}},
        {'$sort': {date: -1}},
        {'$limit': 3}
    ]).toArray()

    res.status(200).json(successResponse(results))
})

router.get('/:id', async (req, res) => {
    const collection = await db.collection('posts')
    const query = {id: ObjectId(req.params.id)}
    const result = await collection.findOne(query)
    
    if (!result) res.status(200).json({message: 'blog not found'})
    else res.status(200).json(successResponse(result))
})

router.post('/', async(req, res) => {
    const collection = await db.collection('posts')
    let newDocument = req.body
    newDocument.date = new Date()
    const result = await collection.insertOne(newDocument)
    
    res.status(201).json(successResponse(result))
})

router.patch('/comment/:id', async (req, res) => {
    const query = { _id: ObjectId(req.params.id)}
    const updates = {
        $push: { comments: req.body }
    }

    const collection = db.collection('posts')
    const result = await collection.updateOne(query, updates)

    res.status(200).json(successResponse(result))
})

router.delete('/:id', async (req, res) => {
    const query = { _id: ObjectId(req.params.id)}

    const collection = await db.collection('posts')
    const result = await collection.deleteOne(query)

    res.status(204).json(successResponse(result))
})

const successResponse = (result) => {
    return {
        message: 'success',
        data: result
    }
}

export default router