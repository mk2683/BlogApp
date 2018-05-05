var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    request = require("request");

var app = express();

mongoose.connect("mongodb://localhost/blogApp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());     //after bodyParser always

var blogSchema = new mongoose.Schema({
	title: {
				  type: String,
				  default: 'Mohit'
			  },
	image: String,
	body: String,
	created: {type: Date, default: Date.now} 
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 		title: "A Blog Post",
// 		image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?h=350&auto=compress&cs=tinysrgb",
// 		body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
// 	}, function(err, blogs){
// 		if (err) {
// 			console.log(err);
// 		} else{
// 			console.log("Blog Post inserted!");
// 			console.log(blogs);
// 		};
// });

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req, res){
	Blog.find({}, function(err, blogs){
		if (err) {
			console.log(err);
		} else{
			res.render("index", {blogs: blogs});
		};
	})
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if (err) {
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, found){
		if (err) {
			res.redirect("/blogs");
		} else{
			res.render("show", {blog: found});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, found){
		if (err) {
			res.redirect("/blogs");
		} else{
			res.render("edit", {blog: found});
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, found){
		if (err) {
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
});

app.listen(8080, function(req, res) {
	console.log("Server has started on port 8080");
});