const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
	title: {type: String, required: true} ,
	content: {type: String},
	author: {
				firstName: String,
				lastName: String},
	created: {type: Date, default: Date.now}
})

blogSchema.virtual('fullName').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

blogSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.fullName,
		created: this.created
	}
}

const Blog = mongoose.model('blogposts', blogSchema)

module.exports = {Blog}