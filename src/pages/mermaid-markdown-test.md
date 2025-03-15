---
layout: ../layout/Publication.astro
title: Testing Mermaid in Markdown
---

# Testing Mermaid Diagrams in Markdown

This page demonstrates how Mermaid diagrams can be included in Markdown content.

## Flowchart Example

```mermaid
flowchart LR
    A[Start] --> B["Decision"]
    B -->|Yes| C[Do Something]
    B -->|No| D[Do Nothing]
    C --> E[End]
    D --> E
```

## Sequence Diagram Example

```mermaid
sequenceDiagram
    participant User
    participant System
    User->>System: Request data
    System->>Database: Query data
    Database-->>System: Return data
    System-->>User: Display data
```

## Class Diagram Example

```mermaid
classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound(): void
    }
    class Dog {
        +breed: string
        +makeSound(): void
    }
    class Cat {
        +furColor: string
        +makeSound(): void
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

## Gantt Chart Example

```mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Research           :a1, 2024-03-01, 30d
    Design             :a2, after a1, 14d
    section Development
    Implementation     :a3, after a2, 60d
    Testing            :a4, after a3, 30d
    section Deployment
    Release            :a5, after a4, 1d
```