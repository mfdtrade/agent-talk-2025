# Lets Build an Agent

Code and Content for Lets Build an Agent Talk Feb 2025. The purpose here is to build the smallest simplest version of an agent. Said another way, we want to get to find the tipping point from non-agentic to agentic.


# Our Plan

### Definition:

> agent = llm + memory + planning + tools + while loop [1]


### Expand terms:

> agent = llm + (read + write) + planning + tools + (condition + loop)

### Rearrange:
> agent = llm + condition + tools + read + write + planning + loop


# Steps to talk

Each step can be run with `npm run step${n}-${step}`


### 0: LLM
OpenAI hello world (https://platform.openai.com/docs/quickstart#make-your-first-api-request)


### 1: Condition

Check if the LLM call meets the requested question.


### 2: Tools:

SerpAPI for web search


### 3: Refactor

### 4: Read / Write / Planning / Loop

Planning:
- prompt for step by step plan, push each onto todo list array
- addTodoToList, checkTodoList, markTodoDone
- Ask your boss for help making a decision

Memory:

While: condition plus loop
- LLM -> Condition Check
- LLM -> Condition Check w/ loop


## Thanks

We are hiring people to help us build agents: https://manufactured.com/careers/ join us!


## Citations

- [1] swyx on X: https://x.com/swyx/status/1843299770238181825