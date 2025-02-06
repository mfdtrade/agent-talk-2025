import { searchGoogle, searchGoogleToolConfig } from "./searchGoogle.js";
import { markTodoDone, markTodoDoneToolConfig,
        addTodos, addTodosToolConfig,
        checkTodos, checkTodosToolConfig
     } from "./todoList.js";

export const functions = {
    searchGoogle,
    addTodos,
    markTodoDone,
    checkTodos
}

export const configsArray = [
    searchGoogleToolConfig,
    addTodosToolConfig,
    markTodoDoneToolConfig,
    checkTodosToolConfig
]

export default {
    searchGoogle,
    searchGoogleToolConfig,
    functions,
    configsArray
}