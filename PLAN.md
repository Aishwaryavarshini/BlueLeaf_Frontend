# Blueleaf Backend Architecture

## 1. System Overview & Technology Stack Recommendation

To meet the requirements of scalability, role-based security, institute isolation, and mobile-first performance, the following stack is recommended:

*   **Runtime**: Node.js (TypeScript) or Python (FastAPI/Django). *Recommendation: Node.js with NestJS for strict architecture and module isolation.*
*   **Database**: PostgreSQL. Reason: Strict relational integrity is needed for the Institute-Grade-Student hierarchy, while `JSONB` columns offer flexibility for the rich, variable content structure (Micro-lessons).
*   **Caching**: Redis. For session management and caching high-read learning content.
*   **AI Processing**: Python microservice or direct integration via message queue (e.g., RabbitMQ/BullMQ) to handle heavy NLP tasks asynchronously (segmentation, generation).
*   **Storage**: S3-compatible object storage for PDFs and media assets.

---

## 2. Core Principles & Security

### 2.1 Institute Isolation Strategy
*   **Logical Isolation**: Every primary entity (Student, Staff, Subject, Grade) **MUST** have an `institute_id` foreign key.
*   **Scope Enforcement**: All database queries must include `where institute_id = current_user.institute_id` automatically (via ORM global scopes or repository patterns) to prevent data leakage.
*   **Tenant Context**: Middleware extracts `institute_id` from the authenticated user's session/token and injects it into the request context.

### 2.2 Role-Based Access Control (RBAC) & Permission Resolution (Extended)

We distinct between **Static Roles** (Principal, Staff, Student) and **Dynamic Permissions** (Context-aware).

#### The `can(user, action, resource, context)` Resolution Layer
Instead of hardcoding checks in controllers, we use a centralized Policy Service.

**Resolution Logic:**
1.  **Global Super-Check**: If `user.role == PRINCIPAL` AND `user.institute_id == resource.institute_id` -> **ALLOW**.
2.  **Resource-Specific Checks**:
    *   **Context**: `Subject` (for content editing)
        *   Check `StaffRoles` table: Does `user` have `SUBJECT_TEACHER` role for `resource.subject_id`? -> **ALLOW**.
    *   **Context**: `Student` (for approval/management)
        *   Check `StaffRoles` table: Does `user` have `CLASS_TEACHER` role for `resource.grade_id`? -> **ALLOW**.
    *   **Context**: `Self` (for students)
        *   If `user.id == resource.user_id` -> **ALLOW**.

**Implementation**:
*   **Where**: A Guard/Interceptor layer in NestJS or a Dependency Injection service in FastAPI.
*   **Injection**: The `context` (e.g., `subject_id` from URL) is resolved before the handler executes.

### 2.3 Security Matrix
| Actor | Scope | Access Level |
| :--- | :--- | :--- |
| **Principal** | Institute | Full Access (CRUD Staff, View Analytics) |
| **Class Teacher** | Assigned Grade | Manage Students (Approve/Block), View Class Analytics |
| **Subject Staff** | Assigned Subject | CRUD Content, View Subject Analytics |
| **Student** | Self | Read Content, CRUD Own Progress/Notes |

---

## 3. Data Models (ERD)

### 3.1 Identity & Institute
*   **Institutes**
    *   `id` (UUID, PK) ...
*   **Users**
    *   `id`, `institute_id`, `role`, `status` ...
*   **StaffRoles** (Contextual Permissions)
    *   `id`, `staff_user_id` (FK)
    *   `role_type` (CLASS_TEACHER, SUBJECT_STAFF)
    *   `target_grade_id` (FK, Nullable)
    *   `target_subject_id` (FK, Nullable)

### 3.2 Content Hierarchy & Versioning (Extended)

To ensure content stability for active students while allowing staff edits:

*   **MicroLessons (Head/Draft)**
    *   `id`, `section_id` (FK)
    *   `title`, `draft_content` (JSON)
    *   `live_version_id` (FK -> MicroLessonSnapshot, Nullable if new)
    *   `prerequisites` (Array of Lesson IDs)
*   **MicroLessonSnapshot (Immutable)**
    *   `id` (UUID)
    *   `micro_lesson_id` (FK)
    *   `version_number` (Integer, e.g., 1, 2, 3)
    *   `content_snapshot` (JSON - The actual frozen content)
    *   `created_at`

**Versioning Strategy**:
1.  Students always read from `MicroLessonSnapshot`.
2.  Staff edits `MicroLesson.draft_content`.
3.  **Publish Action**: Creates new `MicroLessonSnapshot`, increments version, updates `MicroLesson.live_version_id`.
4.  **Student Progress Link**: `StudentProgress` links to `micro_lesson_id`. When loading the lesson viewer, use the `live_version_id` typically, OR strict versioning (store `version_id` in progress) if absolute consistency is required. *Decision for V1: Students load `live_version_id` (latest published) to ensure they get corrections.*

### 3.3 Learning & Progress (Extended)

*   **StudentProgress**
    *   `id`, `student_id` (FK), `micro_lesson_id` (FK)
    *   `status` (LOCKED, UNLOCKED, COMPLETED)
    *   `completed_at`, `score`
    *   `unlock_override` (Boolean, default false) - Allows staff to manually unlock.

### 3.4 Notifications (New)

*   **Notifications**
    *   `id`, `recipient_id` (FK)
    *   `type` (ENUM: SYSTEM, ACADEMIC, REMINDER)
    *   `title`, `body`
    *   `action_link` (Deep link URI)
    *   `is_read` (Boolean)
    *   `metadata` (JSON, e.g., `{ "student_id": "..." }`)

---

## 4. Business Logic & Rules

### 4.1 Progress Unlock Rules
**Default Rule**: Linear completion (Order Index).
**Prerequisite Algorithm**:
```typescript
function canUnlock(student, targetLesson):
  if (targetLesson.prerequisites is Empty):
    return PreviousLesson.isCompleted
  
  for (prereqId in targetLesson.prerequisites):
    if (StudentProgress(student, prereqId).status != COMPLETED):
      return False
  
  return True
```
**Staff Override**:
*   A "Unlock for Student" button in Teacher View updates `StudentProgress` -> sets `status = UNLOCKED` and `unlock_override = true`. This bypasses the algorithm.

### 4.2 Notification Triggers (Events)
*   **Event: `StudentRegistered`** -> Notify `ClassTeacher` (Grade X) -> "New student waiting approval".
*   **Event: `ContentProcessingDone`** -> Notify `Uploader` -> "AI has finished segmenting [File Name]. Review now."
*   **Event: `LessonCompleted`** -> (If Streak Logic triggers) -> Notify `Student` -> "You're on a 5-day streak!"
*   **Event: `InactivityDetected`** (Cron Job) -> Notify `Student` -> "Resume your Physics lesson."

---

## 5. API Design (Additions)

### 5.1 Permissions & Overrides
*   `GET /permissions/me` (Returns list of capabilities for UI toggles)
*   `POST /class/students/{id}/unlock-lesson` (Staff Override)
    *   Body: `{ "lesson_id": "uuid" }`

### 5.2 Notifications
*   `GET /notifications` (Paginated, filtered by `is_read`)
*   `PATCH /notifications/{id}/read`
*   `POST /notifications/push-token` (For mobile push in future)

---

## 6. Implementation Plan Updates

### 6.1 Phase 1: Core & Auth
*   Implement `InstituteIsolationMiddleware`.
*   Implement `Casl` or custom `PolicyService` for permissions.

### 6.2 Phase 2: Content Engine
*   Build `MicroLesson` + `Snapshot` mechanism.
*   Ensure `Publish` workflow is transactional.

### 6.3 Phase 3: Learning Logic
*   Implement `ProgressService.unlockNext(studentId, currentLessonId)`.
*   Build `NotificationService` (Internal Event Bus).
