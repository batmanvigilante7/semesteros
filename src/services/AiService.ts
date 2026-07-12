export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'text' | 'flashcard' | 'quiz' | 'plan' | 'code'
  metadata?: any
}

export interface Conversation {
  id: string
  title: string
  subjectId?: string
  model: string
  temperature: number
  systemPrompt?: string
  messages: AiMessage[]
  updatedAt: string
}

export const SUPPORTED_MODELS = [
  { id: 'ollama-llama3', name: 'Ollama: Llama 3 (Local)', provider: 'Ollama' },
  { id: 'lmstudio-mistral', name: 'LM Studio: Mistral 7B (Local)', provider: 'LM Studio' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Cloud)', provider: 'Google' },
  { id: 'openai-gpt4o', name: 'OpenAI: GPT-4o (Cloud)', provider: 'OpenAI' },
  { id: 'groq-llama3-70b', name: 'Groq: Llama 3 70B (Cloud)', provider: 'Groq' },
]

// Mock response database based on keywords
export function getSimulatedResponse(prompt: string): Omit<AiMessage, 'id' | 'timestamp'> {
  const query = prompt.toLowerCase()

  if (query.includes('flashcard') || query.includes('cards')) {
    return {
      role: 'assistant',
      content: 'Here are 3 customized interactive study flashcards for your syllabus revision:',
      type: 'flashcard',
      metadata: {
        flashcards: [
          { q: 'What is Polymorphism in Object Oriented Programming?', a: 'The ability of a message or function to be displayed in more than one form (e.g. method overloading or overriding).', difficulty: 'medium' },
          { q: 'What is the main difference between an Array and a Linked List?', a: 'Arrays store elements in contiguous memory blocks with O(1) random access; Linked Lists use node references with dynamic sizing and O(N) access.', difficulty: 'easy' },
          { q: 'What is cache pipelining hazard?', a: 'A hazard is a situation that prevents the next instruction in the instruction stream from executing in its designated clock cycle.', difficulty: 'hard' },
        ],
      },
    }
  }

  if (query.includes('quiz') || query.includes('question')) {
    return {
      role: 'assistant',
      content: 'I have generated a quick syllabus quiz. Test your understanding below:',
      type: 'quiz',
      metadata: {
        quiz: {
          question: 'Which of the following data structures operates on a Last In First Out (LIFO) basis?',
          options: ['Queue', 'Stack', 'Heap', 'Graph'],
          answer: 'Stack',
          explanation: 'Stacks push and pop elements from the same end, making the last added item the first to be retrieved (LIFO).',
        },
      },
    }
  }

  if (query.includes('plan') || query.includes('schedule') || query.includes('study plan')) {
    return {
      role: 'assistant',
      content: 'Here is your personalized high-impact 3-day revision study plan:',
      type: 'plan',
      metadata: {
        plan: [
          { day: 'Day 1', focus: 'Revise OOP Polymorphism & Inheritance', hours: 2, tasks: ['Read lecture slides', 'Implement code overload overrides'] },
          { day: 'Day 2', focus: 'Master Binary Trees & BST operations', hours: 3, tasks: ['Draw Tree rotations', 'Implement BST insert delete'] },
          { day: 'Day 3', focus: 'Cache configurations & Hazards', hours: 2.5, tasks: ['Solve structural hazards problems', 'Take mock quiz'] },
        ],
      },
    }
  }

  if (query.includes('code') || query.includes('program') || query.includes('function')) {
    return {
      role: 'assistant',
      content: `Here is a clean implementation of a Binary Search Tree (BST) Node insertion algorithm in TypeScript:

\`\`\`typescript
class BSTNode {
  value: number;
  left: BSTNode | null = null;
  right: BSTNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

function insertNode(root: BSTNode | null, value: number): BSTNode {
  if (!root) return new BSTNode(value);
  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else {
    root.right = insertNode(root.right, value);
  }
  return root;
}
\`\`\`

### Complexity
- **Time Complexity**: $O(\\log N)$ average, $O(N)$ worst-case.
- **Space Complexity**: $O(H)$ recursion stack depth.`,
      type: 'code',
    }
  }

  return {
    role: 'assistant',
    content: `I can help you study more effectively for your semester. 

Here are some helpful starting actions:
1. Try asking: **"Generate flashcards for OOP"** to create quiz cards.
2. Try asking: **"Create a study plan for Data Structures"** to build schedules.
3. Try asking: **"Explain binary search tree code"** to view code blocks.
4. Try uploading a slide deck or notes file in the Context panel.`,
    type: 'text',
  }
}
