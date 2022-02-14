const router = require('express').Router();
const fs = require('fs');
const buf = require('buffer');
const axios = require('axios');
var parseString = require('xml2js').parseString ;
// require csvtojson
var csv = require("csvtojson");
const req = require('express/lib/request');

router.get("/searchtalent", (req, res, next) => {
    //load the file 
    const filePath = `${__dirname}/utils/graph_data.csv`;
    console.log('filepath ', filePath);
    const fileStream = fs.createReadStream(filePath);
 res.set({
    'Content-Type': 'application/json',
    // 'Transfer-Encoding': 'chunked'
       })
    let lines = [];
    csv().fromStream(fileStream).subscribe(function (jsonObj) {
        //process each for hireable applicant  and get data out
        const line = {};
        line.hireable = jsonObj.hireable;
        line.company = jsonObj.company;
        line.Country = jsonObj.country;
        line.id = jsonObj.id;
        line.location = jsonObj.location;
        line.email = jsonObj.email;
        line.City = jsonObj.city;
        line.git_id = jsonObj.git_id;
        line.education = jsonObj.education;
        line.languages = jsonObj.languages;
        line.name = jsonObj.name;
        line.Stack = jsonObj.Stack;
         if (line.hireable == 'True') {  
            console.log(line);  
           lines.push(line);    
            //res.json(line) ;
            }
    });
    fileStream.on('error', (err) => {
        next();
    });
    fileStream.on('end', (data) => {
        console.log('all out ');
        res.send(lines);
        res.end();
    });
});
//load and parse rss news into json and call the endpoint on the front end
const RSSNeWS  =`https://www.pulse.com.gh/news/rss` ;
router.get("/rssnews", (req, res, next) => {
 axios.get(RSSNeWS,{
    responseType: 'text', // default
    responseEncoding: 'utf8', // default
 }).then(function (response) {
    // handle success
   // console.log(response.data);
    const responseText  =  response.data ;
    const outputJson  = [] ; 
    parseString(responseText,(error,result)=>{
        const items = result['rss']['channel'][0].item ;
        const itemlist = result['rss']['channel'][0] ;
        const lastBuildDate  = itemlist.lastBuildDate;
        const title  = itemlist.title;
        //since they nedd title and images 
        const description  = itemlist['description'];
       // console.log(title,description,lastBuildDate) ;
        console.log(itemlist) ;
        var inpuJson  = {} ;
        items.forEach((element)=>{
             //process each object in the news item
             inpuJson.title =  element.title[0] ;
             inpuJson.pubDate  = element.pubDate[0] ;
             const media  = element['media:content'] ;
            // console.log(media)
               media.forEach(md=>{
            // console.log(md['$'])
        if(md['$']['width'] !== undefined && md['$']['height'] !== undefined ){
             console.log(md['$']['url'],md['$']['width'],md['$']['height']) ;
                   inpuJson.url=md['$']['url'] ;
                   inpuJson.width = md['$']['width'];
                   inpuJson.height = md['$']['height'];
                   outputJson.push(inpuJson);
                    //resetting json element
                    inpuJson={} ;
                    }
            if(md['$']['type'] === undefined){
        // console.log('youtube ',md['$']['url'],md['$']['width'],md['$']['height']) ;
                    inpuJson.url=md['$']['url'] ;  
                    outputJson.push(inpuJson); 
                     //resetting json element
                   inpuJson={} ;  
                    }
                  });
          const content  = element['content:encoded'];
              const dccreator  = element['dc:creator'] ;
              if(dccreator!== undefined){
               inpuJson.dccreator  = dccreator[0].trim() ;
                   } 
            content.forEach(ctn=>{
                 console.log('content ',ctn) ;
                inpuJson.content  = ctn.trim() ;
                  }) ;           
          }); 
        //parse json to display title and images, together with youttubes videos
        //also added a custom attributes called id to be use in react frontend
        outputJson.forEach((outputJson, index) => outputJson.id = index + 1);
         // console.log(outputJson) 
         return res.json(outputJson) ;
      })
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
   
});
module.exports = router;





































