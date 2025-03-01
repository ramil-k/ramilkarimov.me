---
layout: '#layout/Publication.astro'
---

# Test task Pixel Point

<details class="my-3">
<summary><b>Text of the task</b></summary>

Imagine your fellow colleague junior front-end developer has submitted a piece of work, which is an implementation of a hero section of the website of an imaginary start up company called DevOptima, for a round of internal review. You are the reviewer! Please, make yourself familiar with the design and the preview, and see if it is mergeable.

Preview: [Preview on Vercel](https://test-task-pixel-point-dev.vercel.app/)

Design Reference: [Figma Design](https://www.figma.com/file/KkDhKFu3wcVYbDJB0bmFzL/Landing-page-for-dev-test-task?type=design&node-id=124-292&mode=design&t=ooRdb4mp3XM8osua-4)

</details>

## Problems
- avoid using styles like pt-\[88px\], prefer preset values, in this case pt-22 
- .col-span-1 does not affect anything, you can remove it
- add hover and other button statuses
- remove positioning from hero-ellipse-gradient.
- move .hero-round-gradient and .hero-ellipse-gradient elements to the 'section' after the content, add inert to them
- remove absolute positioning from illustration, prefer place-self
- illustration misses one of the cursors

