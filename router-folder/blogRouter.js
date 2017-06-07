const express = require('express')
const app = express();

const router = express.Router()
const {Blog} = require('./models')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

//blog requires title, content, author name, publishDate* *optional


router.get('/', (req, res) => {
  Blog
  	.find()
  	.exec()
  	.then(blogposts => {
  		res.json({
  			blogposts: blogposts.map(
  				(blogpost)=>blogpost.apiRepr())
  		});
  	})
  	.catch(
  		err => {
  			console.error(err)
  			res.status(500).json({message: 'Internal server error'})
  		})
});

router.get('/:id', (req, res) => {
	Blog
	.findById(req.params.id)
	.exec()
	.then(blogpost => res.json(blogpost.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `Internal server error`})
	})
})



router.post('/', jsonParser, (req, res) => {
	
	const requiredFields = ["title", "content", "author"];
	console.log(req.body.author)
	requiredFields.forEach(field => {
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message)
			return res.status(400).send(message);
		}
	});

	Blog
	 .create({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
		})
	.then(
		blogpost => res.status(201).json(blogpost.apiRepr()))
	.catch(err => {
		console.error(err)
		res.status(500).json({message: `Internal server error`})
		})
})


router.put("/:id", jsonParser, (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = (
		  `Request path id (${req.params.id}) and request body id ` +
		  `(${req.body.id}) must match`);
		console.error(message);
		res.status(400).json({message: message});
	}
	const toUpdate = {};
	const updateableFields = ['title', 'content', 'author']

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field]
		}
	})

	Blog
		.findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
		.exec()
		.then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
		.catch(err => res.status(500).json({message: 'Internal server error'}))
})

router.delete("/:id", (req, res) => {
	Blog
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(()=> {
			console.log(`Deleted blog post with id ${req.params.id}`)
			res.status(204).end()
		})
})

module.exports = router;