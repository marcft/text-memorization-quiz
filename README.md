# Text Memorization Quiz

An interactive application to help users memorize and study text content through quiz-based learning.

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
