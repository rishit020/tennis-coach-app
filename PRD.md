# TennisCoachApp — Product Requirements Document (MVP Build for Cursor)

## 1. Overview
**App name:** TennisCoachApp  
**Purpose:** A tennis-themed mobile app for players to upload match/practice videos, learn about the coaching team, contact creators, and apply to become a coach.  
**Target users:** Tennis players (no authentication required)  
**Tech stack:** React Native + Expo with Expo Router, TypeScript, and NativeWind styling  
**Primary focus:** Build a fully functional MVP with clean navigation, video upload capabilities, and professional UI/UX

## 2. Project Structure (Expo Router)
```
app/
├─ _layout.tsx                    # Root layout with Stack navigator
├─ (tabs)/                        # Tab group (bottom navigation)
│  ├─ _layout.tsx                 # Tab navigator configuration
│  ├─ index.tsx                   # Home screen
│  ├─ upload.tsx                  # Upload screen
│  ├─ coaching.tsx                # Coaching application screen
│  ├─ contact.tsx                 # Contact form screen
│  └─ about.tsx                   # About coaches screen
├─ modal.tsx                      # Modal for additional content
└─ +not-found.tsx                 # 404 screen

components/
├─ ui/                           # Reusable UI components
│  ├─ button.tsx                 # Primary button component
│  ├─ input.tsx                  # Form input component
│  ├─ video-preview.tsx          # Video preview component
│  └─ card.tsx                   # Card component
├─ forms/                        # Form-specific components
│  ├─ upload-form.tsx            # Upload form logic
│  ├─ coaching-form.tsx          # Coaching application form
│  └─ contact-form.tsx           # Contact form
└─ layout/                       # Layout components
   ├─ header.tsx                 # Screen headers
   └─ footer.tsx                 # Screen footers

constants/
├─ colors.ts                     # Color palette
├─ typography.ts                 # Font and text styles
└─ layout.ts                     # Spacing and layout constants
```
## 3. Navigation & User Flow

### 3.1 App Launch Flow
1. **Splash Screen** (2 seconds)
   - Tennis-themed logo with tagline: "Your Tennis Journey Starts Here"
   - Fade-in animation using `expo-splash-screen`
   - Auto-transition to Home screen

### 3.2 Bottom Tab Navigation
**Tab Structure** (using Expo Router file-based routing):
- **Home** (`index.tsx`) - 🏠 Main dashboard
- **Upload** (`upload.tsx`) - 📹 Video upload functionality  
- **Coaching** (`coaching.tsx`) - 🎾 Apply to become a coach
- **Contact** (`contact.tsx`) - ✉️ Contact form
- **About** (`about.tsx`) - ℹ️ Coach information

**Tab Icons:** Use `@expo/vector-icons` (already installed) with MaterialCommunityIcons

## 4. Screen Specifications

### 4.1 Home Screen (`app/(tabs)/index.tsx`)
**Purpose:** Main dashboard and app introduction

**Layout:**
- Hero section with tennis court background image
- Welcome title: "Welcome to TennisCoachApp"
- App description: "Upload your tennis videos, get coaching insights, and connect with our team"
- Three primary CTA buttons:
  - "Upload Video" → Navigate to Upload tab
  - "Apply for Coaching" → Navigate to Coaching tab  
  - "Contact Us" → Navigate to Contact tab
- Tips/announcements section (scrollable)

**Technical Requirements:**
- Use `expo-image` for background images
- Implement smooth navigation between tabs
- Responsive design for different screen sizes

### 4.2 Upload Screen (`app/(tabs)/upload.tsx`)
**Purpose:** Video upload functionality with form collection

**Form Fields:**
- Player Name (required, text input)
- Playing Level (dropdown: Beginner, Intermediate, Advanced, Professional)
- Notes (optional, multiline text)
- Consent checkbox (required)

**Upload Options:**
- "Record with Camera" button
- "Pick from Gallery" button

**Post-Selection:**
- Video preview with play/pause controls
- Submit button with loading state
- Success toast notification

**Technical Requirements:**
- Use `expo-image-picker` for camera/gallery access
- Implement video preview with `expo-av`
- Form validation with proper error handling
- No backend integration (MVP - local state only)

### 4.3 Coaching Screen (`app/(tabs)/coaching.tsx`)
**Purpose:** Coach application form

**Content:**
- Header: "Become a Tennis Coach"
- Description: "Join our coaching team and earn $45/hour helping players improve their game"
- Application form with fields:
  - Full Name (required)
  - Email (required, with validation)
  - Experience Summary (required, multiline)
  - Video Link (optional, URL input)
- Submit button with success alert

**Technical Requirements:**
- Email validation using regex
- Form state management
- Success/error feedback

### 4.4 Contact Screen (`app/(tabs)/contact.tsx`)
**Purpose:** Contact form for general inquiries

**Form Fields:**
- Name (required)
- Email (required, with validation)
- Message (required, multiline text area)

**Technical Requirements:**
- Keyboard-friendly layout with proper spacing
- Form validation and error handling
- Success message display

### 4.5 About Screen (`app/(tabs)/about.tsx`)
**Purpose:** Coach information and team showcase

**Content:**
- Header: "Meet Our Coaches"
- Coach cards with:
  - Profile photo placeholder
  - Name and credentials
  - Short bio
  - Social media links (if applicable)
- Mission statement section

**Technical Requirements:**
- Card-based layout using reusable components
- Image placeholders with proper aspect ratios
- Accessible typography and contrast

## 5. Design System & Styling

### 5.1 Color Palette
```typescript
// constants/colors.ts
export const colors = {
  primary: {
    green: '#2E8B57',      // Tennis court green
    dark: '#1B5E3A',       // Darker green for accents
  },
  accent: {
    yellow: '#FFD60A',      // Tennis ball yellow
    orange: '#FF8C00',      // Warm accent
  },
  neutral: {
    white: '#FFFFFF',
    gray: {
      100: '#F5F5F5',
      300: '#D1D5DB', 
      500: '#6B7280',
      700: '#374151',
      900: '#111827',
    },
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  }
} as const;
```

### 5.2 Typography System
```typescript
// constants/typography.ts
export const typography = {
  fontFamily: {
    regular: 'System', // Uses platform default (SF Pro / Roboto)
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
} as const;
```

### 5.3 Component Examples
**Button Component:**
```tsx
// components/ui/button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Usage:
<Button
  title="Upload Your Video"
  onPress={handleUpload}
  variant="primary"
  size="lg"
/>
```

### 5.4 Icons & Assets
- **Tab Icons:** `@expo/vector-icons/MaterialCommunityIcons`
- **Button Icons:** `@expo/vector-icons/MaterialCommunityIcons`
- **Images:** Use `expo-image` for optimized loading
- **Icons:** Home (🏠), Upload (📹), Coaching (🎾), Contact (✉️), About (ℹ️)

## 6. Dependencies & Installation

### 6.1 Required Dependencies
```bash
# Core dependencies (already installed)
expo-router
@expo/vector-icons
expo-image
expo-splash-screen
expo-haptics

# Additional dependencies needed for MVP
npx expo install expo-image-picker    # For camera/gallery access
npx expo install expo-av              # For video playback
npx expo install @react-native-async-storage/async-storage  # For local storage

# Optional dependencies for enhanced UX
npx expo install expo-linear-gradient  # For gradient backgrounds
npx expo install expo-blur              # For blur effects
```

### 6.2 Alternative Dependencies (if needed)
```bash
# For dropdown/picker components (if expo-image-picker doesn't suffice)
npm install @react-native-picker/picker

# For form validation
npm install react-hook-form
npm install @hookform/resolvers
npm install yup
```

### 6.3 Development Dependencies
```bash
# TypeScript support (already installed)
typescript
@types/react
eslint-config-expo

# Additional dev dependencies (if needed)
npm install --save-dev @types/react-native
npm install --save-dev prettier
npm install --save-dev eslint-plugin-react-native
```

## 7. MVP Development Phases

### Phase 1: Foundation (Priority 1)
1. **Setup project structure**
   - Configure Expo Router with tab navigation
   - Create all screen files in `app/(tabs)/`
   - Setup constants for colors, typography, layout

2. **Implement navigation**
   - Configure tab navigator with proper icons
   - Test navigation between all tabs
   - Implement splash screen with auto-transition

### Phase 2: Core Screens (Priority 2)
3. **Home Screen**
   - Hero section with background image
   - CTA buttons with navigation
   - Responsive layout

4. **About Screen**
   - Coach cards with placeholder content
   - Mission statement section
   - Clean, accessible typography

### Phase 3: Forms & Functionality (Priority 3)
5. **Contact Screen**
   - Form with validation
   - Success/error feedback
   - Keyboard-friendly layout

6. **Coaching Screen**
   - Application form
   - Email validation
   - Success alert

### Phase 4: Video Upload (Priority 4)
7. **Upload Screen**
   - Form with player details
   - Video picker integration
   - Video preview functionality
   - Submit flow with loading states

## 8. Testing & Quality Assurance

### 8.1 Functional Testing
- [ ] Navigation between all tabs works correctly
- [ ] Splash screen transitions smoothly to Home
- [ ] Video picker works in both camera and gallery modes
- [ ] Form validation works for all input fields
- [ ] Success/error states display properly

### 8.2 Device Testing
- [ ] Test on different screen sizes (iPhone SE, iPhone 14, iPad)
- [ ] Verify keyboard behavior on form screens
- [ ] Test video recording and playback
- [ ] Check accessibility features (VoiceOver/TalkBack)

### 8.3 Performance Testing
- [ ] App launches quickly (< 3 seconds)
- [ ] Smooth animations and transitions
- [ ] No memory leaks during video operations
- [ ] Proper image optimization

## 9. Build & Deployment

### 9.1 Development Testing
```bash
# Run on Expo Go
npx expo start

# Test on specific platforms
npx expo start --ios
npx expo start --android
```

### 9.2 Production Build
```bash
# Configure EAS Build
npx eas build:configure

# Build for production
npx eas build --platform all
```

### 9.3 MVP Limitations
- No backend integration (local state only)
- No user authentication
- No data persistence beyond app session
- No real video upload to servers
- Placeholder content for coach profiles