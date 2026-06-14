---
title: how LLMs work with NO MATH REQUIRED
description: a brief, incomplete, factually incorrect mental model for predicting LLM performance
pubDate: 14 Jun 2026
author: ronm.lol
tags:
  - ai
  - llm
  - tech
---
i am, unfortunately, not very smart. not that i really know what it means to "be smart." because of this congenital problem, i have to work very hard to really understand the fundamentals behind how anything works. luckily, i subconsciously learned long ago that there's a cheat code to get around learning how things work. instead, we need only to build a mental model that correctly predicts the outcome of a system based on a set of constraints. now it might sound like i'm splitting hairs here--what's the difference between understanding something, and having an accurate predictive model? well, depending on the things you actually care about, your mental model can simplify a lot of complexity while still holding predictive power. 

maybe everyone already knows this (as i said, i'm not very smart), but this has only really become clear to me after trying to understand how LLMs work. despite reading (highly recommended sources) [The Hundred-Page Machine Learning Book](https://themlbook.com/), the [Hugging Face LLM course](https://huggingface.co/learn/llm-course/chapter1/1), about a trillion blog posts and random white papers, I struggled to really understand what was happening with transformer architecture. a big part of this is my remedial math level, but certainly it wasn't the only blocker on this knowledge. i will pretend vectors don't exist for this reason, crucify me if you want.

my focus is understanding how to efficiently use ai coding assistants and frameworks. back to my earlier point, this means there's a lot of details that i can simplify away in my mental model. i've spent about two weeks digging into transformer architecture and trying to build up my intuition and mental model on how LLMs work in relation to how I use them in coding agents. here we go:

i'm going to start with a couple definitions that are not precisely accurate but serve the mental model:
- token: subword fragments, the functional units on which LLMs operate. characters (words, code, random letters or symbols) are all converted into tokens based on the model used. a _very_ loose estimation is that 1M words would convert to about 1.3M tokens depending on the model
- context: the short term "memory" (i hate anthropomorphizing LLMs) of an LLM. it contains a list of tokens that include the system prompt, instructions from the user, tooling information, all prompts and responses
- layer: a process that takes input tokens and outputs new tokens (maybe the biggest lie in this document BUT IT'S GOOD ENOUGH FOR THE MODEL OK)
- pre-fill: loading the LLM's cache with information about tokens. this happens after you send a prompt, but before any response tokens have been generated
- decoding: generating output tokens. uses the cache that was populated during pre-fill.

a gross oversimplification of what happens:
- you ask big dog "how do i fizz buzz"
- for every token, and for each _layer_ in the LLM we do "attention" and "feed-forward". during pre-fill, we process every token of the context in parallel, which includes the prompt.
- attention:
	- we populate a cache (if you want to learn more, look into KV cache in LLM layers) with information about tokens and how they relate to tokens that precede them in the context.
	- it is essential to note that we compute this information for how tokens relate to preceding tokens, not for future tokens. this is called "causal masking" if you want to learn more. 
	- given context tokens `C_0` up to `C_n`, consider the following representation of context
		- `[C_0][C_1][C_2]...[C_n-1][C_n]`
		- token `C_1` only attends to token `C_0` and itself during attention
		- token `C_2` only attends to tokens `C_0` and `C_1` and itself
		- token `C_n` attends to all tokens during this phase
		- we can think of this as `[some existing context][how do i fizz buzz]` and see that `how` will (get tokenized and then) attend to prior words, as will other words like `fizz` and `buzz`.
	- the important detail here is that for every highly relevant token considered during the attention phase, the quality of the output token improves. this is why "context management" is important, ie. curating a highly relevant context for each prompt.
	- for each token, we care about other tokens that are scored during attention as highly related
	- we combine this "context enriched information" with the original token and then go on to feed-forward (blah blah embedding vector softmax weighted sum blah blah. look these terms up if you want to reveal the lies)
- feed-forward happens next, where the token is compared against "learned knowledge." if you want to learn more, search for LLM vector expansion and GELU/SwiGLU/SiLU. the upshot is that this is believed to be the step in which factual information is applied against tokens.
- the output from feed-forward is used as the input to the next layer in the LLM
- after this has been completed for the context including the prompt, decoding (response generation) starts
- decoding can be thought of as the same process except that it runs sequentially. while pre-fill can process every token at every layer in parallel, decoding uses the output of each processed token as the input for the next token to be generated. we have the whole input prompt during pre-fill, but during decoding we build up the response one token at a time in sequence.
- big dog the LLM then spits out an algorithm that it has encoded within the weights of its model (it's cringe but you can think of this as its "knowledge"). i'm not going to describe how output generation involves predictive tokens or how softmax + sampling determines what tokens get output. you can search any of these words if you want more info, but again i'm dumb and want the simplest possible mental model to correctly predict ai coding assistant behaviour

OK, that's how they work (kinda sorta not really but good enough). but what's the upshot? the important detail here is the following: LLM generation depends on the relevance of the _context_. tokens are "context-enriched" and highly relevant context ensures that the tokens are enriched with highly relevant material, which in turn increases the accuracy of the generated tokens. in a few words: good context makes it more likely that you get good output. this is probably the most important detail to understand in order to get good (accurate and efficient) performance from ai coding agents.

now, you might wonder, ok so i can just spam tons of potentially useful information, during attention the LLM will find all of it, and that'll increase the quality of the response, right? the problem is that attention is a _quadratic complexity_ process, which means for every doubling in tokens, 4x the work must be done. additionally, models have a fixed context window that _cannot_ be exceeded. for this reason, agents will manage an effective context which must be summarized/compacted when it gets too large. good compaction preserves the same information in fewer tokens through efficient summaries, but can also result in lost context with dropped tokens. while there are a variety of algorithms related to context summarization, the most common ones favour tokens at the start and end of the context. the idea here is that tokens near the start likely are highly relevant to the specific request and constraints, and near the end are more relevant to the ongoing turns of your "conversation." the risk here is always that summarizing may remove critical tokens, and for this reason it's essential to use context management techniques to increase the likelihood of retaining highly relevant tokens. besides just the computational requirements, keeping context relevant is also important because unrelated tokens may decrease the quality of the response. so it's both extra work to process more tokens than you need, and the density of related tokens matters for response quality.

more to come on context management later.