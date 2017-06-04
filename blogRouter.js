const express = require('express')

const bodyParser = require('body-parser')
const router = express.Router()
const {BlogPosts} = require("./models")
const {Blog} = require('./monmodels')


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

router.get('/:id', (req, res) =>{
	Blog
	.findById(req.params.id)
	.exec()
	.then(blogpost => res.json(blogpost.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `Internal server error`})
	})
})



router.post('/', (req, res) => {
	const requiredFields = ["title", "content", "author"]

	requiredFields.forEach(function(field){
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message)
			return res.status(400).send(message);
		}
	})

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
	const requiredFields = ["id", "title", "content", "author"];
	requiredFields.forEach(function(field){
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message)
			return res.status(400).send(message);
		}
	})
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id `
			`(${req.body.id}) must match`);
		console.error(message);
		res.status(400).send(message)
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	const updatePost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.json(updatePost)
})

router.delete("/:id", (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``);
	res.status(204).end()
})

module.exports = router;