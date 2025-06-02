import Team from "../models/Team.js";
import Users from "../models/Users.js";

export async function getLeader(user_id) {
  const team = await Team.findOne({ team: user_id });
  if (team) {
    return team.leader_id;
  } else {
    return false;
  }
}
