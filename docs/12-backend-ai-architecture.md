# SemesterOS: Backend, AI & Infrastructure Architecture
**Internal Technical Document | Phase 12**  
**Role:** Principal Software Architect, AI Systems Architect, Cloud Architect & Security Engineer  

---

## Part 1 — Global System Architecture

SemesterOS uses a hybrid **Local-First, Cloud-Synced architecture** designed to ensure zero-latency client interactions and offline durability:

```
┌────────────────────────────────────────────────────────┐
│               CLIENT LAYER (Vite + React)              │
│  - Zustand Local Cache   ➔   IndexedDB / LocalStorage  │
└───────────────────────────┬────────────────────────────┘
                            │ (Async background Sync)
┌───────────────────────────▼────────────────────────────┐
│                    GATEWAY & API LAYER                 │
│  - Supabase Edge Functions  ➔  REST API Gateway        │
└───────────────────────────┬────────────────────────────┘
                            ├────────────────────────────┐
┌───────────────────────────▼────────────────────┐       │
│               DATABASE & STORAGE               │       │
│  - Supabase PostgreSQL (Relational Data)       │       │
│  - Supabase Storage (PDFs & Assets)           │       │
└───────────────────────────┬────────────────────┘       │
                            │ (Vector Sync)              │ (JSON Streams)
┌───────────────────────────▼────────────────────┐       │
│                    AI SERVICES                 │◀──────┘
│  - PgVector (Semantic Search & Embeddings)      │
│  - OpenAI / Gemini API (Cloud LLM Fallback)    │
│  - Ollama / llama.cpp API (Local LLM Engine)   │
└────────────────────────────────────────────────┘
```

---

## Part 2 — Relational Database Design

All database entities are mapped in PostgreSQL, with strict relations, indexes, and row-level security (RLS) constraints:

```
┌────────────────────────────────────────────────────────┐
│                         USERS                          │
└───────────────────────────┬────────────────────────────┘
                            │ (1 : N)
┌───────────────────────────▼────────────────────────────┐
│                       SEMESTERS                        │
└───────────────────────────┬────────────────────────────┘
                            │ (1 : N)
┌───────────────────────────▼────────────────────────────┐
│                        COURSES                         │
└───────────────────────────┬────────────────────────────┘
              ┌─────────────┴─────────────┐
              │ (1 : N)                   │ (1 : N)
┌─────────────▼─────────────┐ ┌───────────▼─────────────┐
│          MODULES          │ │          TASKS          │
└─────────────┬─────────────┘ └───────────┬─────────────┘
              │ (1 : N)                   │ (Optional 1 : 1)
┌─────────────▼─────────────┐             │
│          TOPICS           │◀────────────┘
└───────────────────────────┘
```

### Primary Database Schemas:
*   **Users:** `id (uuid, PK)`, `email (text)`, `created_at (timestamp)`.
*   **Semesters:** `id (uuid, PK)`, `user_id (uuid, FK)`, `name (text)`, `start_date (date)`, `end_date (date)`. (Index on `user_id`).
*   **Courses:** `id (uuid, PK)`, `semester_id (uuid, FK)`, `name (text)`, `code (text)`, `credits (int)`, `attendance_target (int, default: 75)`. (Index on `semester_id`).
*   **Modules:** `id (uuid, PK)`, `course_id (uuid, FK)`, `title (text)`, `order (int)`.
*   **Topics:** `id (uuid, PK)`, `module_id (uuid, FK)`, `title (text)`, `status (text: 'pending', 'in_progress', 'completed')`, `deadline (date, nullable)`.
*   **Tasks (Assignments):** `id (uuid, PK)`, `course_id (uuid, FK)`, `topic_id (uuid, FK, nullable)`, `title (text)`, `due_date (timestamp)`, `priority (text)`, `status (text)`.

---

## Part 3 — Authentication & Permission Rules

SemesterOS relies on **Supabase Auth** for user identity and session management:

*   **Authentication Providers:** Google OAuth, GitHub OAuth, and Passwordless Magic Link.
*   **Session Management:** JSON Web Tokens (JWT) stored in secure, HttpOnly client cookies. Access tokens expire in 1 hour; refresh tokens are stored securely to re-authorize sessions.
*   **Row-Level Security (RLS) Policy:** All database tables use strict ownership rules:
    ```sql
    CREATE POLICY user_ownership_policy ON courses 
    FOR ALL USING (auth.uid() = user_id);
    ```

---

## Part 4 — Storage & Asset Management

*   **Supabase Storage Buckets:**
    *   `course-assets/`: Holds uploaded reference materials (PDFs, images, zip files). Restricted to a maximum size of 15MB per file.
    *   `exports/`: Temporary storage bucket for user database JSON backups. Configured with a 7-day auto-expiry lifecycle.
*   **Security:** Access to files in the `course-assets/` bucket requires active user authentication, preventing public exposure of copyrighted textbook materials.

---

## Part 5 — Local-First Synchronization & Conflicts Resolution

*   **Offline Cache:** Zustand state is serialized and cached to IndexedDB.
*   **Sync Logic:**
    1.  Every client modification creates a local change log containing an incrementing timestamp.
    2.  When a network connection is established, the change logs are uploaded sequentially to the database.
*   **Conflict Resolution Strategy:** Last-Write-Wins (LWW) is the default rule. If a record is edited concurrently on two devices, the version with the later timestamp is kept.

---

## Part 6 — AI Architecture & Orchestration

SemesterOS abstracts LLM API calls using a unified provider layer, allowing seamless switching between local models and cloud providers:

```
                      ┌──────────────────────────┐
                      │    AI INTERACTION LAYER  │
                      └─────────────┬────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
       [Local Mode (Offline)]               [Cloud Mode (Fallback)]
  (llama.cpp / Ollama endpoints)         (Gemini / OpenAI API endpoints)
```

### Core AI Modules:
1.  **Syllabus recommendation engine:**
    *   *Input:* Course modules, topic completion states, upcoming task deadlines.
    *   *Output:* Recommended study block object (Topic ID, duration, priority score).
    *   *Fallback:* Simple date-based priority sorting if the model is offline.
2.  **PDF Summarization Engine:**
    *   *Input:* Text extracted from uploaded PDF documents.
    *   *Output:* Markdown list of key concepts and practice questions.
    *   *Fallback:* Error alert asking the user to switch to cloud mode due to local hardware limits.

---

## Part 7 — Vector Database & Semantic Search

*   **Vector Engine:** PgVector extension enabled inside the Supabase PostgreSQL database.
*   **Embedding Model:** `text-embedding-3-small` (OpenAI) or local `bge-small-en-v1.5` embeddings.
*   **Data Chunking:**
    *   Uploaded PDFs are chunked into 500-character segments with a 50-character overlap to preserve context boundaries.
    *   Embeddings are generated and written to a dedicated `embeddings` table linked to the course.
*   **Semantic Search Flow:** Querying the command palette translates the search string into a vector, running a cosine similarity search against the table:
    ```sql
    SELECT content, similarity FROM embeddings 
    ORDER BY embedding <=> query_vector LIMIT 5;
    ```

---

## Part 8 — DevOps & CI/CD Pipeline

*   **Frontend Deployment:** Hosted on **Vercel** with automatic preview environments generated for every GitHub pull request.
*   **Database Migrations:** Managed using the Supabase CLI. Migration scripts are versioned in Git under `/supabase/migrations`.
*   **CI/CD Pipeline (GitHub Actions):**
    *   *Lint & Build:* Triggered on pull requests to the `main` branch. Runs ESLint, Prettier, and Vitest test suites.
    *   *Production Release:* Merging to `main` deploys database changes to Supabase and triggers a production deploy on Vercel.

---

## Part 9 — Scalability & Cost Optimization

To minimize hosting costs while scaling, SemesterOS uses:

*   **Client-Side Computing:** The study recommendation scoring algorithm runs entirely on the client's browser, reducing backend CPU demand.
*   **Vector Database Caching:** Semantic search results for static course materials are cached in local browser storage, avoiding repetitive database queries.
*   **Local LLM Default:** The application defaults to Ollama / local APIs for resource-heavy tasks like flashcard generation, using paid cloud APIs only when explicitly enabled by the user.
