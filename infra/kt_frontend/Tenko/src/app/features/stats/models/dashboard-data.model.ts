import { CurrentState } from "./stats.model";
import { UsersActivities } from "./stats.model";

export interface DashBoardData {
    currentState: CurrentState;
    usersActivity: UsersActivities;
}