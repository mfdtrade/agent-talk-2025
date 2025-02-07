import { searchGoogle, searchGoogleToolConfig } from "./searchGoogle.js";
import { markTodoDone, markTodoDoneToolConfig,
        addTodos, addTodosToolConfig,
        checkTodos, checkTodosToolConfig
     } from "./todoList.js";
import { checkGoalDone, checkGoalDoneToolConfig } from "./llmJudge.js";

export const functions = {
    searchGoogle,
    addTodos,
    markTodoDone,
    checkTodos,
    checkGoalDone
}

export const configsArray = [
    searchGoogleToolConfig,
    addTodosToolConfig,
    markTodoDoneToolConfig,
    checkTodosToolConfig,
    checkGoalDoneToolConfig
]

export default {
    searchGoogle,
    searchGoogleToolConfig,
    functions,
    configsArray
}