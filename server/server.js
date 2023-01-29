let express = require('express');
let cors = require('cors');
const { trainModel, farFriendResponse } = require('./model');

let app = express();
const port = 9000;

//middleware
app.use(cors());
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

