const fs = require('fs')

let raw = fs.readFileSync("slack-users.json");
let content = JSON.parse(raw);

function toLower(str) {
    if (!str)
        return "";
    return str.toLowerCase();
}

let members = content.members.map(x => ({
    id: x.id,
    name: toLower(x.real_name),
    first_name: toLower(x.profile.first_name),
    last_name: toLower(x.profile.last_name),
    email: toLower(x.profile.email)
}));

let team = {
    id: 'planck',
    members: members
}

fs.writeFileSync("users.json", JSON.stringify(team, null, 2));

console.log(users)