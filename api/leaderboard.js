const OWNER = process.env.GITHUB_OWNER || "blackaporia";
const REPO = process.env.GITHUB_REPO || "starknet-gaming";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const FILE_PATH = process.env.LEADERBOARD_FILE || "data/rocket-jump-leaderboard.json";
const LIMIT = 10;

function send(res, status, body){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  if(status === 204) return res.status(status).end();
  res.status(status).json(body);
}

function cleanName(value){
  return String(value || "Pilot").trim().replace(/\s+/g, " ").replace(/[<>]/g, "").slice(0, 16) || "Pilot";
}

function normalizeScores(scores){
  return (Array.isArray(scores) ? scores : [])
    .map(item => ({
      id:String(item.id || `${item.name || "Pilot"}-${item.score || 0}-${item.date || 0}`),
      name:cleanName(item.name || item.player),
      score:Math.max(0, Math.floor(Number(item.score) || 0)),
      level:Math.max(1, Math.floor(Number(item.level) || 1)),
      orbs:Math.max(0, Math.floor(Number(item.orbs) || 0)),
      combo:Math.max(1, Math.floor(Number(item.combo) || 1)),
      date:Number(item.date) || Date.now()
    }))
    .filter(item => item.score > 0 && item.score < 250000)
    .sort((a, b) => b.score - a.score || b.combo - a.combo || b.orbs - a.orbs || a.date - b.date)
    .slice(0, LIMIT);
}

function mergeScores(scores, entry){
  const byId = new Map();
  normalizeScores([...scores, entry]).forEach(item => byId.set(item.id, item));
  return normalizeScores([...byId.values()]);
}

async function github(path, options = {}){
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28",
    ...(options.headers || {})
  };
  if(token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {...options, headers});
  if(response.status === 404) return null;
  if(!response.ok) throw new Error(`GitHub ${response.status}`);
  return response.json();
}

function decodeContent(file){
  if(!file?.content) return {scores:[]};
  return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
}

async function readBoard(){
  const file = await github(FILE_PATH, {method:"GET"});
  return {file, scores:normalizeScores(decodeContent(file).scores)};
}

async function writeBoard(scores, sha){
  if(!process.env.GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN");
  const content = Buffer.from(JSON.stringify({scores:normalizeScores(scores)}, null, 2)).toString("base64");
  await github(FILE_PATH, {
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      message:"Update Rocket Jump leaderboard",
      content,
      branch:BRANCH,
      ...(sha ? {sha} : {})
    })
  });
}

module.exports = async function leaderboard(req, res){
  if(req.method === "OPTIONS") return send(res, 204, {});
  try{
    if(req.method === "GET"){
      const {scores} = await readBoard();
      return send(res, 200, {scores});
    }
    if(req.method !== "POST") return send(res, 405, {error:"Method not allowed"});

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const entry = normalizeScores([body])[0];
    if(!entry) return send(res, 400, {error:"Invalid score"});

    for(let attempt = 0; attempt < 2; attempt++){
      const {file, scores} = await readBoard();
      const merged = mergeScores(scores, entry);
      try{
        await writeBoard(merged, file?.sha);
        return send(res, 200, {scores:merged});
      }catch(error){
        if(!String(error.message).includes("409") || attempt === 1) throw error;
      }
    }
  }catch(error){
    return send(res, 500, {error:"Leaderboard unavailable"});
  }
};
