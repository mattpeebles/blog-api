const chai = require('chai')
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server')

const should = chai.should()

chai.use(chaiHttp)


describe('Blog API', function(){
	before(function(){
		return runServer()
	});

	after(function(){
		return closeServer()
	});

	it('should list blog posts on GET', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.should.have.status(200)
				res.should.be.json;
				res.body.should.be.a('array')
			})
	})

	it('should add blog item on POST', function(){
		let now = Date.now()
		const newItem = {title: "New Day", content: "lorem ipsum", author: "Matt P"}
		return chai.request(app)
			.post('/blog-posts')
			.send(newItem)
			.then(function(res){
				res.should.have.status(201)
				res.should.be.json
				res.body.should.be.a('object')
				res.body.should.include.keys('title', 'content', 'publishDate', 'author')
				res.body.id.should.not.be.null
				res.body.should.deep.equal(Object.assign(newItem, {publishDate: res.body.publishDate}, {id: res.body.id}))
			})
	})

	it('should update blog item on PUT', function(){
		const updateBlog = {
			"author": 'Matt',
			"title": 'Test Title',
			"content": 'Lorem Ipsum'
		}
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				updateBlog.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${updateBlog.id}`)
					.send(updateBlog)
			})
			.then(function(res){
				res.should.have.status(200)
				res.should.be.json
				res.body.should.be.a('object')
				res.body.should.deep.equal(updateBlog)
			});
	});
	it('should delete blog post on DELETE', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			return chai.request(app)
				.delete(`/blog-posts/${res.body[0].id}`)
		})
		.then(function(res){
			res.should.have.status(204)
		})
	})
})