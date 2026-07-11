import type { Module } from '@/models'
import {
  oopTopics,
  oopLabTopics,
  dsTopics,
  dsLabTopics,
  coaTopics,
  envsTopics,
  gcgcTopics,
  mathTopics,
  mechTopics,
} from './topics'

// 1. Object Oriented Programming (24CSEN1011) Modules
export const oopModules: Module[] = [
  {
    id: 'oop-m1',
    title: 'Module 1: Introduction and Program Control',
    hours: 6,
    progress: 0,
    status: 'Not Started',
    topics: oopTopics.slice(0, 4),
  },
  {
    id: 'oop-m2',
    title: 'Module 2: Core OOP Principles',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: oopTopics.slice(4, 8),
  },
  {
    id: 'oop-m3',
    title: 'Module 3: Exception Handling & Multithreading',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: oopTopics.slice(8, 12),
  },
]

// 2. Object Oriented Programming Lab (24CSEN1011P) Modules
export const oopLabModules: Module[] = [
  {
    id: 'oop-lab-m1',
    title: 'Module 1: Java Basics Lab',
    hours: 4,
    progress: 0,
    status: 'Not Started',
    topics: oopLabTopics.slice(0, 2),
  },
  {
    id: 'oop-lab-m2',
    title: 'Module 2: Inheritance & Interfaces Lab',
    hours: 6,
    progress: 0,
    status: 'Not Started',
    topics: oopLabTopics.slice(2, 4),
  },
]

// 3. Data Structures (24CSEN2001) Modules
export const dsModules: Module[] = [
  {
    id: 'ds-m1',
    title: 'Module 1: Linear Data Structures',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: dsTopics.slice(0, 4),
  },
  {
    id: 'ds-m2',
    title: 'Module 2: Trees and Graphs',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: dsTopics.slice(4, 7),
  },
]

// 4. Data Structures Lab (24CSEN2001P) Modules
export const dsLabModules: Module[] = [
  {
    id: 'ds-lab-m1',
    title: 'Module 1: Linked List Implementations',
    hours: 4,
    progress: 0,
    status: 'Not Started',
    topics: dsLabTopics.slice(0, 2),
  },
  {
    id: 'ds-lab-m2',
    title: 'Module 2: Stack & Queue Lab',
    hours: 4,
    progress: 0,
    status: 'Not Started',
    topics: dsLabTopics.slice(2, 4),
  },
]

// 5. Computer Organization and Architecture (24CSEN2021) Modules
export const coaModules: Module[] = [
  {
    id: 'coa-m1',
    title: 'Module 1: Instruction Sets',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: coaTopics.slice(0, 3),
  },
  {
    id: 'coa-m2',
    title: 'Module 2: Cache & Memory',
    hours: 6,
    progress: 0,
    status: 'Not Started',
    topics: coaTopics.slice(3, 5),
  },
]

// 6. Environmental Studies (ENVS1003) Modules
export const envsModules: Module[] = [
  {
    id: 'envs-m1',
    title: 'Module 1: Ecosystems & Biodiversity',
    hours: 4,
    progress: 0,
    status: 'Not Started',
    topics: envsTopics.slice(0, 2),
  },
  {
    id: 'envs-m2',
    title: 'Module 2: Pollution & Conservation',
    hours: 4,
    progress: 0,
    status: 'Not Started',
    topics: envsTopics.slice(2, 4),
  },
]

// 7. Aptitude and Self-Management Skills (GCGC1001) Modules
export const gcgcModules: Module[] = [
  {
    id: 'gcgc-m1',
    title: 'Module 1: Quantitative Aptitude',
    hours: 5,
    progress: 0,
    status: 'Not Started',
    topics: gcgcTopics.slice(0, 2),
  },
  {
    id: 'gcgc-m2',
    title: 'Module 2: Logical Reasoning & Soft Skills',
    hours: 5,
    progress: 0,
    status: 'Not Started',
    topics: gcgcTopics.slice(2, 4),
  },
]

// 8. Probability and Statistics For Engineering (MATH2561) Modules
export const mathModules: Module[] = [
  {
    id: 'math-m1',
    title: 'Module 1: Probability Basics',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: mathTopics.slice(0, 3),
  },
  {
    id: 'math-m2',
    title: 'Module 2: Statistical Hypothesis',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: mathTopics.slice(3, 5),
  },
]

// 9. Additive Manufacturing (MECH3091) Modules
export const mechModules: Module[] = [
  {
    id: 'mech-m1',
    title: 'Module 1: Intro to 3D Printing',
    hours: 6,
    progress: 0,
    status: 'Not Started',
    topics: mechTopics.slice(0, 2),
  },
  {
    id: 'mech-m2',
    title: 'Module 2: Liquid & Powder AM Systems',
    hours: 8,
    progress: 0,
    status: 'Not Started',
    topics: mechTopics.slice(2, 4),
  },
]
