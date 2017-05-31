const express = require('express')

const bodyParser = require('body-parser')
const router = express.Router()
const {BlogPosts} = require("./models")

const jsonParser = bodyParser.json();



//blog requires title, content, author name, publishDate* *optional


BlogPosts.create("test", "lorem ipsum ergo sum", "Matt Peebles")
BlogPosts.create("fizz", "lorem ipsum ergo sum", "Matt Peebles", "May 5th, 2017")

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ["title", "content", "author"]
	requiredFields.forEach(function(field){
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message)
			return res.status(400).send(message);
		}
	})
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
	res.status(201).json(item)
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