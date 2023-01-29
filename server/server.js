let express = require('express');
const { trainModel, farFriendResponse } = require('./model');

let app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());

app.listen(port, () => {
    console.log(`Tripset is listening on port ${port}`);
});

app.get('/hello', (req,res) => {
    res.send("hello");
})

app.post('/trainmodel', async (req,res) => {
    res.json(await trainModel())
});

app.post('/predictresponse', async (req,res) => {
    res.json(await farFriendResponse(req.body.message, req.body.model, req.body.character));
});

