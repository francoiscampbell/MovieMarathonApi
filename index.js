const axios = require('axios')
const express = require('express')
const cors = require('cors')

const app = express()

const corsWhitelist = ['https://francoiscampbell.github.io', 'http://localhost:9000']
const corsOptions = {
    origin: function (origin, callback) {
        if (corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.get('/:version/movies/showings', cors(corsOptions), function(req, res) {
    console.dir(req)
    if (req.params.version === 'mock') {
        res.sendFile('/mock.json', {
            root: __dirname
        })
    } else {
        const params = Object.assign(
            {}, 
            req.query,
            { 
                api_key: process.env.API_KEY
            }
        )
        const options = {
            params: params
        }
        axios.get('https://data.tmsapi.com' + req.path, options)
            .then(function(proxyRes) {
                res.send(proxyRes.data)
            })
            .catch(function(error) {
                res.sendStatus(500)
                console.dir(error)
            })
    }
})

app.listen(process.env.PORT || 3000)
