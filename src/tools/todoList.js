import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

let todos = []
const done = []


// ####################################################################################
// CREATE - Add New Todos
export function addTodos({newTodos}) {
    newTodos.forEach(el => {
        todos.push(el)
    });
    return `Added ${newTodos.length} to todo list. Now have ${todos.length} todos.`
}

export const addTodosToolConfig = zodFunction({
    name: "addTodos",
    description: "Add an array of todos to my todo list.",
    parameters: z.object({
        newTodos: z.array(z.string()).describe("The array of new todos to add to my todo list.")
    })
})


// ####################################################################################
// Mark Todos Done
export function markTodoDone({todo}) {
    if (todos.includes(todo)) {
        todos = todos.filter(item => item !== todo)
        done.push(todo)
        return `Marked the following todo as done:\n  ${todo}`
    } else {
        return `Todo list doesn't include todo:\n  ${todo}`
    }
}
export const markTodoDoneToolConfig = zodFunction({
    name: "markTodoDone",
    description: "Mark an individual item on my todo list as done.",
    parameters: z.object({
        todo: z.string().describe("The array of new todos to add to my todo list.")
    })
})

// ####################################################################################
// Read the done list
export function checkDoneTodos({}) {
    if (done.length > 0) {
        return JSON.stringify(done)
    } else {
        return "No tasks have been marked done."
    }
}

export const checkDoneTasksToolConfig = zodFunction({
    name: "checkDoneTask",
    description: "Read every thing on the todo list that has been marked done.",
    parameters: z.object(z.tuple([])).describe("No arguments are needed for this function.")
})

// ####################################################################################
// Read the todo list
export function checkTodos({}) {
    if (todos.length > 0) {
        return JSON.stringify(list)
    } else {
        return "The todo list is empty."
    }
}

export const checkTodosToolConfig = zodFunction({
    name: "checkTodos",
    description: "Read every thing on the todo list.",
    parameters: z.object(z.tuple([])).describe("No arguments are needed for this function.")
})
