var express = require('express');
var fs = require('node:fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const data = fs.readFileSync('questions.json', 'utf8');
  res.send(data);
});

function getAllItems(){
  const data = fs.readFileSync("questions.json", "utf8");
  const questions = JSON.parse(data.replace(/(\r\n|\n|\r|\t)/gm, ""));
  const items = [];
  questions.map((q) => {
    q.Questions.map((qq) => {
      qq.Keywords.map((keyword) => {
        items.push(keyword);
      });
    });
  });
  return items;
}

function updateKeyword(Keyword){
  const data = fs.readFileSync("questions.json", "utf8");
  const questions = JSON.parse(data.replace(/(\r\n|\n|\r|\t)/gm, ""));
  let founded = false;
  const q2 = questions.map((q) => {
    q.Questions = q.Questions.map((qq) => {
      qq.Keywords = qq.Keywords.map((keyword) => {
        if(keyword.Id === Keyword.Id){
          founded = true;
          return Keyword;
        } else {
          return keyword;
        }
      });
      return qq;
    });
    return q;
  });
  fs.writeFileSync("questions.json",JSON.stringify(q2));
  return founded;
}

router.get("/count", function (req, res, next) {
  const items = getAllItems();
  res.json({count: items.length});
});

router.get("/:number", function (req, res, next) {
  const { number } = req.params;
  const items = getAllItems();
  res.json(items[number - 1]);
});

router.post("/", function (req, res, next) {
  const Keyword = req.body;
  if(Keyword?.Id){
    updateKeyword(Keyword);
  }
  res.json({success:true});
});

module.exports = router;
