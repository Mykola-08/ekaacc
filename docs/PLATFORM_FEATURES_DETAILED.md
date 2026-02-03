# EKA Platform Feature Documentation

This document provides a comprehensive overview of the features available within the EKA ecosystem, segmented by user role. The platform is designed to serve a multi-faceted wellness community, integrating therapy, education, financial management, and administration into a seamless "Bento-style" interface.

## 1. Client / Patient Role
*Target User: Individuals seeking therapy, wellness tracking, self-improvement, and community connection.*

The Client Dashboard is the central hub for the user's personal wellness journey. It uses a modular "Pills" and "Bento Grid" design for clarity and focus.

### **Dashboard & Command Center**
*   **Smart Welcome & Context**: The dashboard greets the user personally and provides an immediate summary of their status (e.g., "On track," "2 sessions this week"). It uses time-aware logic to display relevant information.
*   **Next Session Intelligence**: A prominent card displays the next upcoming appointment with a countdown. It includes immediate actions to "Join Meeting" (if online) or "Reschedule" without navigating away.
*   **Morphing Task Manager**: A built-in "To-Do" list for wellness homework (e.g., "Meditate for 10 min", "Complete journal entry").
    *   **Interactive Feedback**: Uses "Morphing Action Buttons" that visually transform from "Idle" -> "Loading" -> "Success" state to give satisfying feedback upon task completion.
    *   **CRUD Capabilities**: Users can Create, Read, Update, and Delete tasks directly from the widget.
*   **Wellness Metrics**: Visual stats cards (e.g., "Sessions Completed", "Mood Trends") that provide positive reinforcement using up-trend indicators.

### **Core Modules**
*   **Booking System (`/booking`)**:
    *   **Service Discovery**: Browse available therapy types and practitioners.
    *   **Calendar Interface**: Real-time availability view for scheduling.
    *   **Session Management**: View past history and manage upcoming slots.
*   **Digital Wallet (`/wallet`)**:
    *   **Credit Management**: Purchase and store prepaid credits for sessions.
    *   **Transaction History**: View all top-ups and session deductions.
    *   **Payment Methods**: Manage saved cards and billing integration (Stripe context).
*   **Academy & Learning (`/academy`)**:
    *   **Course Library**: Access educational content assigned by therapists or purchased independently.
    *   **Lesson Viewer**: Interactive media player for video/text lessons.
    *   **Progress Tracking**: completion bars for courses.
*   **Personal Progress (`/progress`)**:
    *   **Outcomes Visualization**: Charts showing improvement over time (likely connected to survey/assessment data).
    *   **Milestones**: Badges or markers for reaching therapy goals.
*   **Community (`/community`)**:
    *   **Forums/Groups**: Spaces for user interaction and peer support (likely moderated).
    *   **Telegram Integration**: Seamless connection to efficient messaging channels.

---

## 2. Therapist / Practitioner Role
*Target User: Mental health professionals, coaches, and wellness providers.*

The Therapist interface focuses on efficiency, client management, and clinical documentation.

### **Practice Management**
*   **Client Directory (`/clients`, `/person`)**:
    *   **Roster View**: Searchable list of all active and inactive clients.
    *   **Patient Profiles**: Deep-dive views into a specific client's history, upcoming appointments, and filed documents.
*   **Session Notes (`/session-notes`)**:
    *   **Clinical Documentation**: Secure interfaces for writing SOAP notes or free-text session summaries.
    *   **Private/Shared Toggle**: Functionality to keep notes private or share specific summaries with the client.
*   **Templates Engine (`/templates`)**:
    *   **Efficiency Tools**: Create reusable text blocks for common note types or client communications, reducing administrative time.

### **Operations & Finance**
*   **Provider Dashboard**:
    *   **Daily Briefing**: tailored view of the day's schedule.
    *   **Alerts**: Notifications for missing notes or urgent client messages.
*   **Billing Center (`/billing`)**:
    *   **Earnings Report**: breakdown of income per session or period.
    *   **Invoice Generation**: Tools to generate receipts for clients.

---

## 3. Educator Role
*Target User: Course creators and workshop leaders.*

The Educator portal enables the creation and distribution of wellness content within the Academy.

*   **Course Builder (`/courses`)**:
    *   **Curriculum Design**: Tools to structure courses into modules and chapters.
    *   **Content Upload**: forms for video, text, and asset management.
*   **Lesson Management (`/lessons`)**:
    *   **Granular Control**: Edit individual lessons, set prerequisites, and manage visibility.

---

## 4. Admin Role
*Target User: Platform owners, operations managers, and super-admins.*

The Admin panel provides "God Mode" visibility and configuration capabilities for the entire platform.

### **Platform Control**
*   **CMS (Content Management System) (`/admin/cms`)**:
    *   **Website Editor**: Tools to update marketing pages, blog posts, and public facing content without code deployment.
*   **User Governance (`/users`)**:
    *   **Role Management**: ability to assign Client, Therapist, or Educator roles.
    *   **Access Control**: Suspend, ban, or verify user accounts.
*   **Business Intelligence**:
    *   **Global Bookings (`/bookings`)**: Master calendar view of all platform activity.
    *   **Finance (`/finance`)**: Platform-wide revenue tracking, payouts to therapists, and marketplace fee management.

### **System Configuration**
*   **Service Definition (`/services`)**:
    *   **Catalog Management**: Define what services are sold (e.g., "50min Psychotherapy", "Group Workshop"), set prices, and duration.
*   **Integrations**:
    *   **Telegram Bot**: Management of notification bots and chat flows.
    *   **Feature Flags (`/flags`)**: Toggle experimental features on/off for specific user segments.

---

## 5. Specialized Modules

### **Donation Seeker (`/donation-seeker`)**
*   **Fundraising Tools**: dedicated features for users or the platform to seek financial support, grants, or sliding-scale assistance funds.

### **VIP / Loyalty (`/vip`, `/loyalty`)**
*   **Tiered Access**: Infrastructure for premium membership tiers.
*   **Rewards**: Systems to track loyalty points or exclusive perks for long-term users.

### **Communications**
*   **Webhooks & Callbacks**: Event-driven architecture handling real-time updates from payment providers (Stripe) and messaging services.
*   **Telegram & Push**: Multi-channel notification strategy ensuring high engagement and low missed-appointment rates.
