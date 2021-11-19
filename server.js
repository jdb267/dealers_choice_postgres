const pg = require('pg');
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const { client, syncAndSeed } = require('./db');

app.get('/', async (req, res, next) => {
  try {
    const response = await client.query('SELECT * FROM album;');
    const albums = response.rows;
    res.send(`<html>
    <head></head>
    <body>
        <h1>Kendrick Lamar Albums</h1>
        <ul>
        ${albums
          .map(
            (album) => `
                <li><a href="/albums/${album.id}">${album.name}</a></li>
            `
          )
          .join('')}
        </ul>
    </body>
    </html>`);
  } catch (err) {
    next(err);
  }
});

app.get('/albums/:id', async (req, res, next) => {
  try {
    const response = await client.query('SELECT * FROM album WHERE id=$1;', [
      req.params.id,
    ]);
    if (!response.rows.length) {
      res.send(`<html>
        <head></head>
        <body>
            <h1>This album does not exist</h1>
            <a href="/">All Albums</a>
            
            
        </body>
        </html>`);
    }
    const album = response.rows[0];

    res.send(`<html>
      <head></head>
      <body>
          <h1>${album.name}</h1>
          <div>Artist: ${album.artist}</div>
          <div>Date Released: ${album.date}</div>
          <div>Record Label: ${album.label}</div>
          <div>Certification: ${album.certification}</div>
          <div><a href="${album.wiki}" target=_>Learn More</a></div>
          <a href="/">All Albums</a>
          
      </body>
      </html>`);
  } catch (err) {
    next(err);
  }
});

const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log('connected to database');
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

setUp();
