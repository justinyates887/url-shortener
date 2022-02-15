var validUrl = require('valid-url');
var shortId = require('shortid');
const URL = require('../db/schemas')


async function shortenURL(req, res) {
    const { url } = req.body

    console.log(url)

    const urlCode = shortId.generate()

    if (!validUrl.isWebUri(url)) {
        res.status(401).json({
        error: 'invalid URL'
        })
    } else {
        try {
        let find = await URL.findOne({
            original_url: url
        })
        if (find) {
            res.json({
            original_url: find.original_url,
            short_url: find.short_url
            })
        } else {
            find = new URL({
                original_url: url,
                short_url: urlCode
            })
            await find.save()
            res.json({
            original_url: find.original_url,
            short_url: find.short_url
            })
        }
        } catch (err) {
            console.error(err)
            res.status(500).json('Server error...')
        }
    }
  };
async function findURL(req, res){
    try {
        const urlParams = await URL.findOne({
          short_url: req.params.short_url
        })
        if (urlParams) {
          return res.redirect(urlParams.original_url)
        } else {
          return res.status(404).json('No URL found')
        }
      } catch (err) {
        console.log(err)
        res.status(500).json('Server error')
      }
  }

  module.exports = {shortenURL, findURL}