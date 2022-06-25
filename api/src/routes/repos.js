import { Router, Request, Response } from 'express';
import { Repo } from '../models/Repo';

const https = require('https'); // Require https to read from https resource
const fs = require('fs'); // Require file system to read local file
export const repos = Router();

const httpsOptions = { // Options for https call to get repos from github
  hostname: 'api.github.com',
  port: 443,
  path: '/users/silverorange/repos',
  method: 'GET',
  headers: {'User-Agent': 'mcurtiswilliams'},
};

function httpsrequest() { // Function to return repos from api.github.com
     return new Promise((resolve, reject) => { // Create the promise to wrap the https request
        const httpsOptions = { // Specify options for the https call
            host: 'api.github.com',
            path: '/users/silverorange/repos',
            port: 443,
            method: 'GET',
            headers: {'User-Agent': 'mcurtiswilliams'},
        };
        const req = https.request(httpsOptions, (res) => { // Make the request
            var body = '';
            res.on('data', function(chunk) { // Create the body of the data from the request
                body += chunk;
            });
            res.on('end', function() { // Once request completes, return the data
                try { // Parse the body into JSON format
                    body = JSON.parse(body);
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => { // Handle errors
          reject(e.message);
        });
       req.end();
    });
}


repos.get('/', async (_, res) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
  httpsrequest().then((data) => { // Run the https request
    let aggData = [];
    let parsedHttpsData = data; // Parse the https data into JSON format
    let rawFileData = fs.readFileSync('../api/data/repos.json', (err, data) => { // Read data from local file
      return data;
    });
    let parsedFileData = JSON.parse(rawFileData); // Parse the data from readFileSync
    parsedFileData.forEach(element => { // Add elements from parsed file data to the https data
      parsedHttpsData.push (element);
    });
    parsedHttpsData.forEach (element => { // Include only repos where fork is false
      if (!element.fork) {
        aggData.push (element);
      }
    });
    return res.json(aggData); // Return aggregated repos data
  });
});
