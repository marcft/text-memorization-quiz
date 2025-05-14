# Text Memorization Quiz

An interactive application to help users memorize and study text content through quiz-based learning.

> **Disclaimer:** This was a quick project created entirely with AI to help my girlfriend with a specific learning need.

## Vibe Coding Observations

The code quality in this project is objectively poor. This could be because I don't make prompts good enough when working with AI coding tools. However, in order to make those perfect prompts (according to my observation), you must definitely have to already know how to code well.

AI-generated code often lacks proper organization, creates unnecessary complexity, and misses important edge cases. The person reviewing and integrating AI-generated code needs to understand the code to effectively evaluate and improve what the AI produces.

Even with their quirks, AI coding assistants are super useful for developers. They’re great at cranking out boilerplate code, offering ideas for common problems, and helping you quickly explore different ways to build something. If you treat them like a teammate instead of a replacement for your own brain, they can seriously boost your productivity—and they’re actually a great way to learn and level up your coding skills too.

## Features

- **Two Study Modes**:
  - **Easy Mode**: Tests memory by hiding words in paragraphs
  - **Hard Mode**: Tests complete recall by hiding entire paragraphs
  - **Practice Mode**: Practice memorising the text.
- **Immediate Feedback**: Get instant feedback on your answers
- **Customizable**: Configure the number of hidden words in Easy Mode
- **Sequential or Random**: Choose between sequential or random paragraph selection

## Technologies

- React 19
- Vite
- CSS3

## Adding Your Own Study Content

Place your text content in `/public/text/study.txt` using the format:

```txt
---
title: Section Title
---
Paragraph content goes here.

---
title: Another Section
---
Another paragraph content here.
```
