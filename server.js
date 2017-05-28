const express = require('express')
const morgan = require('morgan')
const app = express()

const blogPostsRouter = require('./blogRouter')

app.use(morgan('common'))

app.use("/blog-posts", blogPostsRouter);

//blog requires title, content, author name, publishDate* *optional



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});