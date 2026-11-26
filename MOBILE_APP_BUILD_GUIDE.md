# NEXORA WORKFORCE — NATIVE MOBILE APPLICATION BUILD GUIDE (CAPACITOR)

This guide documents the procedures for compiling and releasing native **Android (APK/AAB)** and **iOS (IPA)** packages for **Nexora Workforce** using Capacitor.

---

## 1. Application Identifiers & Branding

- **Application Name:** Nexora Workforce
- **Package ID (Android):** `com.nexoratechnologies.workforce`
- **Bundle ID (iOS):** `com.nexoratechnologies.workforce`
- **Production API URL:** `https://nexora-technologies-server.onrender.com`
- **Theme Color:** `#060D1F` (Dark) / `#2563EB` (Electric Blue Accent)

---

## 2. Prerequisites

### For Android:
- Node.js 18+ & npm
- Android Studio (Electric Eel or newer)
- Android SDK Platform 34 (API 34)
- JDK 17 (Java Development Kit)

### For iOS:
- macOS Sonoma or newer
- Xcode 15+
- Active Apple Developer Account (for device deployment and App Store submission)
- CocoaPods (`sudo gem install cocoapods`)

---

## 3. Initial Project Scaffolding

From the `frontend` folder:

```bash
cd frontend

# 1. Install Capacitor core and CLI
npm install @capacitor/core
npm install -D @capacitor/cli

# 2. Build the production web distribution bundle
npm run build

# 3. Add Android and iOS native platforms
npx cap add android
npx cap add ios
```

---

## 4. Building Android Native Application

### Step 1: Sync Assets & Plugins
Every time you build the React frontend:
```bash
npm run build
npx cap sync android
```

### Step 2: Open in Android Studio
```bash
npx cap open android
```

### Step 3: Configure Android Permissions (`AndroidManifest.xml`)
Ensure the following permissions are present in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

### Step 4: Build APK / AAB
In Android Studio:
- **Debug APK (for local testing):** `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.
- **Release AAB (for Google Play Store):** `Build` -> `Generate Signed Bundle / APK` -> Select `Android App Bundle`, provide your keystore credentials, and generate.

---

## 5. Building iOS Native Application

### Step 1: Sync Assets
```bash
npm run build
npx cap sync ios
```

### Step 2: Open in Xcode
```bash
npx cap open ios
```

### Step 3: Configure Signing & Capabilities
In Xcode:
1. Select the `App` target in the project navigator.
2. Navigate to the **Signing & Capabilities** tab.
3. Check **Automatically manage signing** and select your **Apple Developer Team**.
4. Set Bundle Identifier to `com.nexoratechnologies.workforce`.

### Step 4: Add Privacy Descriptions (`Info.plist`)
Add to `ios/App/App/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Nexora Workforce requires camera access to capture employee profile photos and document proofs.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Nexora Workforce requires photo library access to upload documents and expense receipts.</string>
```

### Step 5: Archive & Upload to TestFlight / App Store
- Select destination **Any iOS Device (arm64)**.
- Choose **Product** -> **Archive**.
- Once compiled, click **Distribute App** -> **App Store Connect** -> Upload.

---

## 6. Continuous Synchronization Command
For rapid development:
```bash
# In frontend/package.json
"cap:sync": "vite build && cap sync"
```
Run `npm run cap:sync` whenever frontend UI components are updated.
