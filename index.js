const express = require("express");
const path = require("path")
const urlRoute = require("./routes/url")
const URL = require("./models/url")
const staticRoute = require("./routes/staticRouter")
const { connectToMongoDb } = require("./connect")
const app = express();

const port = 9000;

connectToMongoDb("mongodb://127.0.0.1:27017/short_url").then(() => console.log("mongodb connected"))

app.set("view engine","ejs")
app.set("views",path.resolve('./views'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/url", urlRoute);
app.use("/",staticRoute)


app.get('/test', async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls: allUrls,
    })
})
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId },
        {
            $push: {
                visitHistory: {
                    timestamp : Date.now(),
                },
            }
        })
    res.redirect(entry?.redirectURL)
})
app.listen(port, () => console.log(`server is running at port ${port}`))