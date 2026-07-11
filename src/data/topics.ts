import type { Topic } from '@/models'

// 1. Object Oriented Programming (24CSEN1011)
export const oopTopics: Topic[] = [
  { id: 'oop-t1', title: 'Java Primitive Types', duration: 1.5, deadline: '2026-07-06', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 1.5, completedAt: '2026-07-06' },
  { id: 'oop-t2', title: 'Operators', duration: 1.5, deadline: '2026-07-08', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 1.5, completedAt: '2026-07-08' },
  { id: 'oop-t3', title: 'Variables', duration: 1.5, deadline: '2026-07-10', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 1.5, completedAt: '2026-07-10' },
  { id: 'oop-t4', title: 'Control Structures', duration: 1.5, deadline: '2026-07-11', status: 'In Progress', difficulty: 'medium', estimatedStudyTime: 1.5 },
  { id: 'oop-t5', title: 'Encapsulation', duration: 2.0, deadline: '2026-07-13', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'oop-t6', title: 'Inheritance', duration: 2.0, deadline: '2026-07-15', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 2.0 },
  { id: 'oop-t7', title: 'Polymorphism', duration: 2.0, deadline: '2026-07-17', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 2.0 },
  { id: 'oop-t8', title: 'Abstraction', duration: 2.0, deadline: '2026-07-20', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'oop-t9', title: 'Try-catch-finally Block', duration: 2.0, deadline: '2026-07-24', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'oop-t10', title: 'Custom Exceptions', duration: 2.0, deadline: '2026-07-27', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'oop-t11', title: 'Thread Lifecycle & Creation', duration: 2.0, deadline: '2026-07-30', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 2.0 },
  { id: 'oop-t12', title: 'Thread Synchronization', duration: 2.0, deadline: '2026-08-03', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 2.0 },
]

// 2. Object Oriented Programming Lab (24CSEN1011P)
export const oopLabTopics: Topic[] = [
  { id: 'oop-lab-t1', title: 'Basic Syntax & Input/Output', duration: 2.0, deadline: '2026-07-07', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 2.0, completedAt: '2026-07-07' },
  { id: 'oop-lab-t2', title: 'Class & Object Creation', duration: 2.0, deadline: '2026-07-09', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 2.0, completedAt: '2026-07-09' },
  { id: 'oop-lab-t3', title: 'Method Overriding Programs', duration: 3.0, deadline: '2026-07-14', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 3.0 },
  { id: 'oop-lab-t4', title: 'Abstract Classes & Interfaces', duration: 3.0, deadline: '2026-07-16', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 3.0 },
]

// 3. Data Structures (24CSEN2001)
export const dsTopics: Topic[] = [
  { id: 'ds-t1', title: 'Single Linked Lists', duration: 2.0, deadline: '2026-07-05', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 2.0, completedAt: '2026-07-05' },
  { id: 'ds-t2', title: 'Circular Linked Lists', duration: 2.0, deadline: '2026-07-08', status: 'Completed', difficulty: 'hard', estimatedStudyTime: 2.0, completedAt: '2026-07-08' },
  { id: 'ds-t3', title: 'Doubly Linked Lists', duration: 2.0, deadline: '2026-07-10', status: 'In Progress', difficulty: 'hard', estimatedStudyTime: 2.0 },
  { id: 'ds-t4', title: 'Stack & Queue Arrays', duration: 2.0, deadline: '2026-07-12', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'ds-t5', title: 'Binary Search Trees', duration: 3.0, deadline: '2026-07-15', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 3.0 },
  { id: 'ds-t6', title: 'AVL Trees & Rotations', duration: 3.0, deadline: '2026-07-18', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 3.0 },
  { id: 'ds-t7', title: 'DFS & BFS Graph Traversals', duration: 2.0, deadline: '2026-07-22', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
]

// 4. Data Structures Lab (24CSEN2001P)
export const dsLabTopics: Topic[] = [
  { id: 'ds-lab-t1', title: 'Singly Linked List Lab', duration: 2.0, deadline: '2026-07-06', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 2.0, completedAt: '2026-07-06' },
  { id: 'ds-lab-t2', title: 'Doubly Linked List Lab', duration: 2.0, deadline: '2026-07-13', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'ds-lab-t3', title: 'Stack using Arrays & Lists', duration: 2.0, deadline: '2026-07-16', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 2.0 },
  { id: 'ds-lab-t4', title: 'Queue using Array', duration: 2.0, deadline: '2026-07-20', status: 'Not Started', difficulty: 'easy', estimatedStudyTime: 2.0 },
]

// 5. Computer Organization and Architecture (24CSEN2021)
export const coaTopics: Topic[] = [
  { id: 'coa-t1', title: 'Machine Instructions', duration: 2.5, deadline: '2026-07-07', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 2.5, completedAt: '2026-07-07' },
  { id: 'coa-t2', title: 'Addressing Modes', duration: 2.5, deadline: '2026-07-09', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 2.5, completedAt: '2026-07-09' },
  { id: 'coa-t3', title: 'Instruction Cycle', duration: 3.0, deadline: '2026-07-11', status: 'In Progress', difficulty: 'hard', estimatedStudyTime: 3.0 },
  { id: 'coa-t4', title: 'Cache Memory Mapping', duration: 3.0, deadline: '2026-07-16', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 3.0 },
  { id: 'coa-t5', title: 'Virtual Memory Systems', duration: 3.0, deadline: '2026-07-19', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 3.0 },
]

// 6. Environmental Studies (ENVS1003)
export const envsTopics: Topic[] = [
  { id: 'envs-t1', title: 'Food Chains & Web', duration: 2.0, deadline: '2026-07-08', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 2.0, completedAt: '2026-07-08' },
  { id: 'envs-t2', title: 'Biodiversity Hotspots', duration: 2.0, deadline: '2026-07-10', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 2.0, completedAt: '2026-07-10' },
  { id: 'envs-t3', title: 'Air & Water Pollution', duration: 2.0, deadline: '2026-07-15', status: 'Not Started', difficulty: 'easy', estimatedStudyTime: 2.0 },
  { id: 'envs-t4', title: 'Waste Management', duration: 2.0, deadline: '2026-07-18', status: 'Not Started', difficulty: 'easy', estimatedStudyTime: 2.0 },
]

// 7. Aptitude and Self-Management Skills (GCGC1001)
export const gcgcTopics: Topic[] = [
  { id: 'gcgc-t1', title: 'Number Systems', duration: 2.5, deadline: '2026-07-05', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 2.5, completedAt: '2026-07-05' },
  { id: 'gcgc-t2', title: 'Ratio and Proportion', duration: 2.5, deadline: '2026-07-09', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 2.5, completedAt: '2026-07-09' },
  { id: 'gcgc-t3', title: 'Blood Relations', duration: 2.5, deadline: '2026-07-12', status: 'Not Started', difficulty: 'easy', estimatedStudyTime: 2.5 },
  { id: 'gcgc-t4', title: 'Coding and Decoding', duration: 2.5, deadline: '2026-07-14', status: 'Not Started', difficulty: 'easy', estimatedStudyTime: 2.5 },
]

// 8. Probability and Statistics For Engineering (MATH2561)
export const mathTopics: Topic[] = [
  { id: 'math-t1', title: 'Bayes Theorem', duration: 2.5, deadline: '2026-07-06', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 2.5, completedAt: '2026-07-06' },
  { id: 'math-t2', title: 'Random Variables', duration: 2.5, deadline: '2026-07-08', status: 'Completed', difficulty: 'hard', estimatedStudyTime: 2.5, completedAt: '2026-07-08' },
  { id: 'math-t3', title: 'Probability Distributions', duration: 3.0, deadline: '2026-07-11', status: 'In Progress', difficulty: 'hard', estimatedStudyTime: 3.0 },
  { id: 'math-t4', title: 'Large Sample Tests', duration: 4.0, deadline: '2026-07-15', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 4.0 },
  { id: 'math-t5', title: 'Small Sample Tests (t, F, Chi-square)', duration: 4.0, deadline: '2026-07-20', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 4.0 },
]

// 9. Additive Manufacturing (MECH3091)
export const mechTopics: Topic[] = [
  { id: 'mech-t1', title: 'AM Process Chain', duration: 3.0, deadline: '2026-07-07', status: 'Completed', difficulty: 'easy', estimatedStudyTime: 3.0, completedAt: '2026-07-07' },
  { id: 'mech-t2', title: 'STL File Generation', duration: 3.0, deadline: '2026-07-09', status: 'Completed', difficulty: 'medium', estimatedStudyTime: 3.0, completedAt: '2026-07-09' },
  { id: 'mech-t3', title: 'SLA & FDM Printing', duration: 4.0, deadline: '2026-07-14', status: 'Not Started', difficulty: 'medium', estimatedStudyTime: 4.0 },
  { id: 'mech-t4', title: 'SLS & Laser LENS', duration: 4.0, deadline: '2026-07-17', status: 'Not Started', difficulty: 'hard', estimatedStudyTime: 4.0 },
]
