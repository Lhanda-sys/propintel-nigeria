# PropIntel Nigeria 🇳🇬

### AI-Powered Real Estate Intelligence Platform

PropIntel Nigeria is a modern real estate technology platform designed to make property discovery, comparison, verification, and decision-making easier for buyers, sellers, and real estate professionals across Nigeria.

The platform combines property listings, location intelligence, professional profiles, property comparison, messaging, verification concepts, and AI-powered property insights into a single user-friendly experience.

> 🚧 **Project Status:** Frontend development / active development

---

## 🌍 About PropIntel

Finding the right property in Nigeria can involve searching through multiple platforms, contacting different agents, verifying property information, understanding locations, and comparing several options manually.

PropIntel is being designed to bring these activities together in one platform.

The long-term vision is to create a trusted property intelligence ecosystem where users can:

- Discover properties across Nigeria
- Compare properties intelligently
- Understand property locations
- Connect with sellers and professionals
- Evaluate potential property uses
- Access property and professional verification information
- Receive AI-assisted property insights

---

## ✨ Key Features

### 🏠 Property Discovery

Users can explore properties based on different criteria, including:

- Property type
- Location
- Price
- Property size
- Bedrooms
- Bathrooms
- Amenities
- Building age
- Listing type
- Other property characteristics

The platform is designed to support properties across all **36 Nigerian states and the Federal Capital Territory (FCT)**.

---

### 🔎 Property Comparison

PropIntel provides a property comparison experience that allows users to evaluate multiple properties side by side.

Potential comparison factors include:

- Price
- Location
- Property type
- Land size
- Building size
- Building age
- Bedrooms
- Bathrooms
- Amenities
- Accessibility
- Development potential
- Rental potential
- User preferences

The platform is being structured to support AI-assisted comparisons and recommendations.

---

### 🤖 AI-Powered Property Intelligence

PropIntel is designed to use AI to help users understand properties beyond basic listing information.

AI capabilities include:

#### Property Comparison

AI can help users determine which property may be more suitable for a particular objective, such as:

- Investment
- Family living
- Rental
- Development
- Value for money

#### Property Use Recommendations

AI can analyse available property information and suggest potentially suitable uses, such as:

- Residential
- Commercial
- Mixed-use
- Agricultural
- Industrial
- Hospitality
- Office
- Retail
- Rental
- Development

AI recommendations are intended as decision-support tools and do not replace professional legal, planning, valuation, surveying, or regulatory advice.

---

### 📍 Property Location Intelligence

Properties are designed to contain location information such as:

- Address
- State
- LGA
- Latitude
- Longitude
- Location description

The platform is structured for Google Maps integration so users can view the property location and interact with its map representation.

---

### 💬 Property Messaging

Users can interact with property owners through the platform's messaging interface.

Property listings can provide a:

**Message Seller**

action that connects the conversation to the relevant property.

The current implementation uses frontend/mock data and is structured for future backend integration.

---

### 👤 Buyer & Seller Accounts

PropIntel supports the concept of user accounts for:

- Buyers
- Sellers
- Buyers & Sellers

User profiles can contain information such as:

- Name
- Profile image
- Email
- Phone number
- Location
- Account type
- Bio
- Verification status

---

### 🧑‍💼 Real Estate Professionals

Professionals can create dedicated professional profiles.

Supported professional categories include:

- Real Estate Agent
- Realtor
- Property Developer
- Estate Manager
- Property Valuer
- Land Surveyor
- Architect
- Quantity Surveyor
- Real Estate Lawyer
- Mortgage / Finance Professional
- Property Manager
- Construction / Engineering Professional
- Real Estate Company
- Other

Professional profiles are designed to showcase:

- Professional role
- Experience
- Company
- Areas served
- Specialisation
- Professional information
- Verification status
- Contact options

---

### ✅ CAC / Business Verification

PropIntel is designed to support business verification for registered companies.

The planned verification process includes:

- CAC registration number
- Optional CAC certificate upload
- Verification submission
- Review status
- Approval/rejection
- CAC verified badge

Possible verification states include:

- Not submitted
- Submitted
- Under review
- Verified
- Rejected

The current frontend implementation does not independently verify CAC records with the Corporate Affairs Commission. It provides the interface and architecture required for future verification integration.

---

### 🛡️ Admin Dashboard

PropIntel includes an administrative management concept for monitoring the platform.

The planned admin area includes:

- User management
- Professional management
- Property moderation
- Verification requests
- CAC verification requests
- Reported properties
- Reported users
- Complaints
- Suspended users
- Banned users
- Activity logs

Administrators can be provided with moderation actions such as:

- Approve
- Reject
- Suspend
- Unsuspend
- Ban
- Remove ban
- Review reports
- Review verification requests

> **Note:** Because PropIntel is currently a frontend project, the admin system is not a substitute for secure server-side authorization. Production authorization will require a backend.

---

## 🇳🇬 Nigerian Location Coverage

PropIntel is designed around Nigeria's:

**36 States + Federal Capital Territory**

The location system includes:

- Abia
- Adamawa
- Akwa Ibom
- Anambra
- Bauchi
- Bayelsa
- Benue
- Borno
- Cross River
- Delta
- Ebonyi
- Edo
- Ekiti
- Enugu
- Gombe
- Imo
- Jigawa
- Kaduna
- Kano
- Katsina
- Kebbi
- Kogi
- Kwara
- Lagos
- Nasarawa
- Niger
- Ogun
- Ondo
- Osun
- Oyo
- Plateau
- Rivers
- Sokoto
- Taraba
- Yobe
- Zamfara
- Federal Capital Territory (FCT)

The location architecture is intended to support future expansion into:

**State → LGA → City → Area**

---

## 🛠️ Technology Stack

PropIntel is currently built as a frontend application using:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **JavaScript/TypeScript-based service abstractions**
- **Responsive UI components**

The application is structured around reusable components and service layers to make future integrations easier.

---

## 🏗️ Project Architecture

The project follows a frontend-first architecture.

Conceptually:

```text
PropIntel Nigeria
│
├── React Frontend
│   │
│   ├── Authentication
│   ├── Property Discovery
│   ├── Property Details
│   ├── Property Listing
│   ├── Property Comparison
│   ├── Professionals
│   ├── Messaging
│   ├── Maps
│   ├── AI Intelligence
│   └── Admin
│
├── Service Layer
│   ├── Authentication
│   ├── Properties
│   ├── Professionals
│   ├── Verification
│   ├── Maps
│   ├── Messaging
│   ├── AI
│   └── Administration
│
└── Future Integrations
    ├── Authentication Provider
    ├── Database
    ├── Google Maps
    ├── Gemini
    ├── CAC Verification
    └── Backend API
