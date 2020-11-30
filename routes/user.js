const db = require("../data/db");

const router = require("express").Router();

// create a new post 
router.post("/posts", async (req, res) => {
  try {
    const { title, contents } = req.body;

    if (!title || !contents) {
      return res
        .status(400)
        .send({
          errorMessage: "Please provide title and contents for the post",
        });
    }

    const newPost = { title, contents };

    await db.insert(newPost);
    res.status(201).send(newPost);
  } catch (e) {
    res
      .status(500)
      .send({
        error: "There was an error while saving the post to the database",
      });
  }
});


// create a new comment on a specific post
router.post("/posts/:id/comments", async (req, res) => {
  try {
    const [post] = await db.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .send({ message: "The post with the specified ID does not exist" });
    }

    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .send({ errorMessage: "Please provide text for the comment" });
    }

    const newComment = { text, post_id: req.params.id };

    await db.insertComment(newComment);

    return res.send(newComment);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get all current posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await db.find({});
    return res.status(200).send(posts);
  } catch (e) {
    res
      .status(500)
      .send({ error: "The post informatin could not be retrieved" });
  }
});



// get a specific post 
router.get("/posts/:id", async (req, res) => {
  try {
    const [post] = await db.findById(req.params.id);

    if (!post)
      return res
        .status(404)
        .send({ message: "The post with the specified ID does not exist" });

    return res.status(200).send(post);
  } catch (e) {
    res
      .status(500)
      .send({ error: "The post information could not be retrieved" });
  }
});

// create a new comment on a specific post 
router.get("/posts/:id/comments", async (req, res) => {
  try {
    const [post] = await db.findById(req.params.id);

    if (!post)
      return res
        .status(404)
        .send({ message: "The post with the specified ID does not exist" });

    const comments = await db.findPostComments(req.params.id);

    return res.status(200).send(comments);
  } catch (e) {
    res
      .status(500)
      .send({ error: "The comments information could bot be retrieved" });
  }
});

// delete a post 
router.delete("/posts/:id", async (req, res) => {

    try {
        const [post] = await db.findById(req.params.id); 

        if (!post)
        return res
          .status(404)
          .send({ message: "The post with the specified ID does not exist" });

        await db.remove(req.params.id); 
        return res.status(200).send(post); 
    }
    catch(e){
        res.status(500).send({ error: "The post could not be removed"})
    }
})


// update/edit a post 
router.put("/posts/:id", async (req, res) => {

    try {
        const [post] = await db.findById(req.params.id); 

        if (!post)
        return res
          .status(404)
          .send({ message: "The post with the specified ID does not exist" });

        const { title, contents } = req.body; 

        if(!title || !contents) return res.status(400).send({errorMessage: "Please provide title and contents for the post"})

        const updatedPost = { title, contents }; 

        await db.update(req.params.id, updatedPost); 
        return res.status(200).send(updatedPost); 

    }
    catch(e){
        res.status(500).send({error: "The post informatin could not be modified"})
    }
})
module.exports = router;
