const PORT = 8000
const express = require('express')
const app = express()

const axios = require('axios')
const cheerio = require('cheerio')




const articles = []

/* 
Creating a newspaper Array by which we can scrap data 
from different-different websites
*/

const newspapers = [
    {
        name: 'Investing.com',
        address: 'https://www.investing.com/',
        base: 'https://www.investing.com/'

    },
    {
        name: 'Money Control',
        address: 'https://www.moneycontrol.com/',
        base: 'https://www.moneycontrol.com/'
    },
    {
        name: 'BSE India',
        address: 'https://www.bseindia.com/',
        base: 'https://www.bseindia.com/'
    },
    {
        name: 'NSE India',
        address: 'https://www.nseindia.com/',
        base: 'https://www.nseindia.com/'
    },
    {
        name: 'mint',
        address: 'https://www.livemint.com/',
        base: 'https://www.livemint.com/'
    },
    {
        name: 'Economics Times Market',
        address: 'https://economictimes.indiatimes.com/markets',
        base: 'https://economictimes.indiatimes.com/'
    },
    {
        name: 'Market Watch',
        address: 'https://www.marketwatch.com/',
        base: 'https://www.marketwatch.com/'
    },
    {
        name: 'NDTV Profit',
        address: 'https://www.ndtv.com/business',
        base: 'https://www.ndtv.com/business'
    },
    {
        name: 'The Hindu',
        address: 'https://www.thehindubusinessline.com/',
        base: 'https://www.thehindubusinessline.com/'
    },
    {
        name: 'Bloomberg Quint',
        address: 'https://www.bqprime.com/',
        base: 'https://www.bqprime.com/'
    },
    {
        name: 'Business Standard',
        address: 'https://www.business-standard.com/',
        base: 'https://www.business-standard.com/'
    },
    {
        name: 'Financial Express',
        address: 'https://www.financialexpress.com/',
        base: 'https://www.financialexpress.com/'
    },
    {
        name: 'Capital Market',
        address: 'https://www.capitalmarket.com/',
        base: 'https://www.capitalmarket.com/'
    },
    {
        name: 'Equity Master',
        address: 'https://www.equitymaster.com/',
        base: 'https://www.equitymaster.com/'
    },
    {
        name: 'Business Today',
        address: 'https://www.businesstoday.in/',
        base: 'https://www.businesstoday.in/'
    },
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data

            //  Using Cheerio
            const $ = cheerio.load(html)
            $('a:contains("share"),a:contains("dollar"),a:contains("market"),a:contains("stock"),a:contains("holdings"), a:contains("IPO"), a:contains("Investor"), a:contains("Trading"), a:contains("Investing"),a:contains("Dividends"), a:contains("Promoters"), a:contains("Bull market"),a:contains("Bear market"), a:contains("Market capitalization"),a:contains("Broker"), a:contains("Securities"), a:contains("Finance"),a:contains("Volatility"), a:contains("Financial ratios"), a:contains("Revenue"),a:contains("Venture capital"), a:contains("Mutual fund"), a:contains("Fundamental analysis")'
                , html).each(function () {

                    let Title = $(this).text()
                    Title = Title.replace(/\s+/g, ' ').trim();


                    let URL = $(this).attr('href')
                    if (URL != null) {
                        if (URL.substring(0, 7) != 'https:/')
                            URL = newspaper.base + URL
                    }
                    articles.push({
                        Title,
                        URL,
                        Source: newspaper.name
                    })
                })
        })
        .catch((err) => {
            console.log(err)
        })
})



app.get('/', (req, res) => {
    res.json('Welcome to my Share market news API ')
})

app.get('/marketNews', (req, res) => {
    res.json(articles)
})

app.get('/marketNews/:newspaperId', (req, res) => {

    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address

    const specificArticles = []
    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("share"),a:contains("dollar"),a:contains("market"),a:contains("stock"),a:contains("holdings"), a:contains("IPO"), a:contains("Investor"), a:contains("Trading"), a:contains("Investing"),a:contains("Dividends"), a:contains("Promoters"), a:contains("Bull market"),a:contains("Bear market"), a:contains("Market capitalization"),a:contains("Broker"), a:contains("Securities"), a:contains("Finance"),a:contains("Volatility"), a:contains("Financial ratios"), a:contains("Revenue"),a:contains("Venture capital"), a:contains("Mutual fund"), a:contains("Fundamental analysis")'
                , html).each(function () {

                    let Title = $(this).text()
                    Title = Title.replace(/\s+/g, ' ').trim();


                    let URL = $(this).attr('href')
                    if (URL != null) {
                        if (URL.substring(0, 7) != 'https:/')
                            URL = newspaperId + URL
                    }
                    specificArticles.push({
                        Title,
                        URL,
                        Source: newspaperId
                    })
                })
            res.json(specificArticles)
        })
        .catch((err) => {
            // console.log("HI")
            console.log(err)
        })
})

app.listen(PORT, () => {
    console.log(`Server is Running on PORT - http://localhost:${PORT}`)
})
