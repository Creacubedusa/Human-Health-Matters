# **PRODUCT OVERVIEW**

**Name:** Human Health Matters (HHM)  
**Type:** AI-native Telehealth Mobile Application  
 **Platform:** Mobile (iOS & Android)

## **Description**

Human Health Matters (HHM) is a **multi-rolend and multi-lingual healthcare platform** designed to provide **accessible, affordable, and intelligent healthcare** by combining:

* AI-powered triage  
* Licensed physician consultations  
* Insurance-aware care  
* Pre-funded donor support

The system ensures that  **uninsured and underinsured patients receive care instantly**, by removing delays caused by cost or system inefficiencies.

## **User Roles**

### **Patient**

Access care, complete AI triage, consult doctors, and receive funding support if needed.

### **Doctor**

Provide consultations, review AI insights, prescribe treatment, and handle insurance billing externally.

### **Donor**

Fund a pooled system that is automatically allocated to patients in real-time.

# **2\.  GOALS**

## **Primary Goals**

1. **Enable instant access to care**  
    No patient should be blocked due to inability to pay  
2. **Ensure funding before care delivery**  
    Insurance \+ donor pool must cover cost before consultation  
3. **Remove operational friction for doctors**  
    Doctors focus on care, not platform complexity  
4. **Deliver real-time funding allocation**  
    Replace crowdfunding delays with a pre-funded system  
5. **Maintain safe, AI-assisted clinical decision-making**  
    AI must support, not replace, doctors

# **3\.  CORE FEATURES**

##  **Patient**

* AI Nurse triage (symptom assessment)  
* Appointment booking  
* Consultation (video/chat)  
* Insurance \+ donor funding check  
* Care plan & follow-ups  
* Prescription download

##  **Doctor**

* Onboarding (NPI, Tax ID, enrollment)  
* Consultation interface  
* AI-assisted notes & diagnosis  
* Prescription creation  
* Consultation completion / follow-up

## **Donor**

* Add funds to pooled system  
* Real-time impact tracking  
* Donation history

# **4\. SCOPE**

##  **IN SCOPE**

* AI triage system  
* Consultation flow  
* Donor fund pooling & allocation  
* Patient funding logic  
* Doctor onboarding validation  
* Admin monitoring system  
* Prescription generation

##  **OUT OF SCOPE**

* Insurance claim submission  
* Payment reconciliation  
* Pharmacy integration  
* Crowdfunding campaigns  
* Full EHR integration

# **5\. USER FLOWS**

## **Patient Flow**

1. Sign up → profile setup  
2. AI triage  
3. System checks:  
   * Insurance  
   * Donor funding

### **Decision:**

* Covered → proceed  
* Not covered → allocate donor funds  
* No funding → block consultation

4. Book consultation  
5. Consult doctor  
6. Receive prescription \+ care plan

## **Doctor Flow**

1. Sign up & onboarding  
2. Submit:  
   * NPI  
   * Tax ID  
   * Bank details  
   * Enrollment status  
3. Marked as:  
* Billable / Not Billable  
4. Accept consultation  
5. Review AI triage \+ patient data  
6. Conduct consultation  
7. Generate:  
   * Notes  
   * Prescription  
8. Complete consultation OR schedule follow-up  
9. Submit insurance claim externally

## **Donor Flow**

1. Sign up / login/Guest (anonymously)  
2. Add funds to pool  
3. Funds stored centrally  
4. System automatically:  
* Allocates funds to patients in need  
5. Donor sees:  
* Impact feed  
* Allocation breakdown

# **6\.  UI SOURCE**

* **Figma design is the single source of truth**  
* Claude must:  
  * Follow layouts exactly  
  * Not redesign or reinterpret UI  
  * Maintain spacing, hierarchy, and structure

# **7\.  TECH STACK**

* React Native (Expo)  
* TypeScript
* **Tailwind (NativeWind)** for styling  
* Storybook (Component documentation and development)
* TypeScript

# **8\.  ARCHITECTURE RULES**

## **Feature-Based Architecture**

* Structure the application by features (user roles), not by file types  
* Each role (Patient, Doctor, Donor) must be fully isolated  
* Each feature owns its screens, components, state, and logic  
* Cross-feature access is not allowed except through shared modules

## **Layer Separation (Strict)**

* UI must only handle presentation  
* Business logic must not exist inside UI components  
* API calls must not be triggered directly from UI  
* Data must flow through a clear separation of layers (UI → logic → service → API)  
* Each layer must have a single responsibility

## **Design System Enforcement**

* All styling must follow the centralized design system  
* Use Tailwind (NativeWind) consistently across the app  
* Design tokens (colors, spacing, typography) must be reused  
* Inline styling is not allowed  
* Hardcoded visual values are not allowed

## **Reusable Component System**

* All UI elements must be built as reusable components  
* Components must be modular and composable  
* Avoid duplication of components across features  
* Shared components must be used wherever applicable  
* Components should remain as stateless as possible

## **State Management**

* State must be organized per feature  
* Global state must be minimal and well-defined  
* State should be predictable and easy to trace  
* Avoid storing state inside UI components unnecessarily  
* Do not mix unrelated states together

## **Role-Based Isolation**

* Each role must have its own navigation flow  
* Each role must operate independently  
* No user should access features outside their role  
* Data must be securely separated per role

## **API Layer Separation**

* All API interactions must go through a centralized API layer  
* UI components must not directly interact with APIs  
* API responses must be processed before reaching the UI  
* Network logic must be isolated from business logic

## **Language & Text Management**

* All text must be externalized from components  
* Support for future localization must be ensured  
* Avoid hardcoded strings  
* Use clear, simple, and accessible language

##  **UI State Handling**

* Every screen must handle loading states  
* Every screen must handle error states  
* Every screen must handle empty states  
* Every screen must handle success states  
* No screen should exist without defined UI states

## **Edge Case Handling**

* The system must prevent progression when required data is missing  
* Patients must be blocked if funding is unavailable  
* Doctors must be restricted if not properly onboarded  
* Low-confidence AI outputs must be flagged

##  **Scalability Rules**

* The architecture must support adding new features or roles without restructuring  
* Shared logic must not be duplicated  
* New features must follow the existing structure  
* The system must remain maintainable as it grows

## **Anti-Patterns (Strictly Forbidden)**

* Mixing UI and business logic  
* Calling APIs directly from UI components  
* Hardcoding styles or text  
* Duplicating logic or components  
* Over-engineering unnecessary abstractions

## **Core Principle**

* The architecture must prioritize clarity, separation of concerns, and scalability  
* Each part of the system must do one thing well and nothing more


  


  

##   

–  
