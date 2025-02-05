# agent-talk-2025
Code and Content for Lets Build an Agent Talk Feb 2025


Agent Definition:
    | agent = llm + memory + planning + tools + while loop [1]

Expand terms:
    | agent = llm + (remember + recall) + planning + tools + (condition + loop)

Rearrange:
    | agent = llm + condition + tools + recall + remember + loop + planning


## 0: LLM
OpenAI hello world (https://platform.openai.com/docs/quickstart#make-your-first-api-request)


## 1: Condition

Check if the LLM call meets the requested question.


## 2: Tools:

SerpAPI for web search


## 3: Recall

## 4: Remember

## 5: Loop

## 6: Planning


Planning:
- prompt for step by step plan, push each onto todo list array
- addTodoToList, checkTodoList, markTodoDone
- Ask your boss for help making a decision


Memory:

While: condition plus loop
- LLM -> Condition Check
- LLM -> Condition Check w/ loop

- [1] swyx on X: https://x.com/swyx/status/1843299770238181825