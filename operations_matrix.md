# Operations Matrix: The Daughter Coach

**Goal:** A purely logistical map of the infrastructure powering the application, linking services to their login credentials. 
*Security Rule: Never type the actual passwords in this document. Only list the emails.*

### 1. The Core Infrastructure

| Service | Purpose | Master Login Email | Password Location |
|---------|---------|--------------------|-------------------|
| **GitHub** | Code Repository Backup | `[Type your GitHub email here]` | Password Manager |
| **Cloudflare** | Web Hosting & Domains | `[Type your Cloudflare email here]` | Password Manager |
| **Firebase** | Database & Google Auth | `[Type your Google email here]` | Password Manager |
| **Stripe** | Payment Gateway | `[Type your Stripe email here]` | Password Manager |

<br/>

### 2. The Sandbox vs Production Separation 
*The app currently runs in 'Test Mode'. When launching to the public, these switches must be flipped:*
- **Stripe:** You need to toggle Stripe from "Test Mode" to "Live Mode" and replace the keys in `.env.local`.
- **Firebase:** You are currently in "Test Mode" rules. If you go to production, the database rules must be locked down.

<br/>

### 3. API Keys & Secrets Backup
The API keys that tie all of these services together are currently stored directly inside your code editor in the `.env.local` file.
- **Backup Location:** Copy all the text inside `.env.local` and paste it into a "Secure Note" in your password manager.
