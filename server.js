const pg = require('pg');
const express = require('express');
const app = express();
const port = process.env.port || 3000;

app.get('/', async (req, res, next) => {
  try {
    const response = await client.query('SELECT * FROM name;');
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

const client = new pg.Client('postgres://localhost/lamar_db');

const syncAndSeed = async () => {
  const SQL = `
  DROP TABLE IF EXISTS album;
    CREATE TABLE album(
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        artist VARCHAR(100) NOT NULL,
        date VARCHAR NOT NULL,
        label VARCHAR(100) NOT NULL,
        certification VARCHAR(100) NOT NULL,
        wiki VARCHAR NOT NULL
        
    );
    INSERT INTO album(id, name, artist, date, label, certification, wiki) VALUES(1, 'Section.80', 'Kendrick Lamar', 'July 2, 2011', 'Top Dawg', 'RIAA: Gold', 'https://en.wikipedia.org/wiki/Section.80');
    INSERT INTO album(id, name, artist, date, label, certification, wiki) VALUES(2, 'Good Kid, M.A.A.D City', 'Kendrick Lamar', 'October 22, 2012', 'Top Dawg', 'RIAA: 3x Platinum', 'https://en.wikipedia.org/wiki/Good_Kid,_M.A.A.D_City');
    INSERT INTO album(id, name, artist, date, label, certification, wiki) VALUES(3, 'To Pimp a Butterfly', 'Kendrick Lamar', 'March 16, 2015', 'Top Dawg', 'RIAA: Platinum', 'https://en.wikipedia.org/wiki/To_Pimp_a_Butterfly');
    INSERT INTO album(id, name, artist, date, label, certification, wiki) VALUES(4, 'DAMN', 'Kendrick Lamar', 'April 14, 2017', 'Top Dawg', 'RIAA: 3x Platinum', 'https://en.wikipedia.org/wiki/Damn_(Kendrick_Lamar_album)');
    
    `;
  await client.query(SQL);
};

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
