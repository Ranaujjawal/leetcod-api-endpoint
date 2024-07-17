const axios = require("axios");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const query=`
query getUserProfile($username: String!) {
 allQuestionsCount {
      difficulty
      count
    }
  matchedUser(username: $username) {
    username
     contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
  }
}
`
const formatData = (data) => {
    let sendData =  {
        usename:data.matchedUser.username,
        totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
        easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
        totalEasy: data.allQuestionsCount[1].count,
        mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
        totalMedium: data.allQuestionsCount[2].count,
        hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
        totalHard: data.allQuestionsCount[3].count,
        ranking: data.matchedUser.profile.ranking,
        contributionPoint: data.matchedUser.contributions.points,
        reputation: data.matchedUser.profile.reputation,
    }
    return sendData;
}

 exports.info=(req,res)=>{
    let user = req.params.id;
    fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com'
        }, 
        body: JSON.stringify({query: query, variables: {username: user}}),
    
    })
    .then(result => result.json())
    .then(data => {
      if(data.errors){
        res.send(data);
      }else {
        res.send(formatData(data.data));
      }
    })
    .catch(err=>{
        console.error('Error', err);
        res.send(err);
    });
}

exports.chefinfo= async(req,res)=>{
  try{
  let data = await axios.get(`https://www.codechef.com/users/${req.params.id}`);
  let dom = new JSDOM(data.data);
  let document = dom.window.document;
        res.status(200).send({
            success: true,
            profile: document.querySelector('.user-details-container').children[0].children[0].src,
            name: document.querySelector('.user-details-container').children[0].children[1].textContent,
            currentRating: parseInt(document.querySelector(".rating-number").textContent),
            highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
            countryName: document.querySelector('.user-country-name').textContent,
            globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
            countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
            stars: document.querySelector('.rating').textContent || "unrated",
        });
  }
  catch(err){
    res.send({ success: false, error: err });
  }
}
