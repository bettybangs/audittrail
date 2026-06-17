# Risk Whisperer
### AI-Powered Security Control Assessor

Risk Whisperer is a GRC portfolio tool that uses Claude AI to assess security controls against major compliance frameworks. Paste in a control description or system detail and instantly receive assessment questions, evidence requirements, potential weaknesses with remediation recommendations, and framework control mappings — the same outputs a senior GRC analyst would produce manually.

![Risk Whisperer Screenshot](risk-whisperer-screenshot.png)

---

## What It Does

| Output | What It Means |
|---|---|
| Risk Score (1-10) | Overall risk level of the described control |
| Control Maturity | How mature the control is (Initial → Optimizing) |
| Assessment Questions | Interview questions an auditor would ask |
| Evidence to Collect | Artifacts and screenshots needed for an audit package |
| Weaknesses & Recommendations | Gaps identified with specific remediation steps |
| Framework Mappings | Which official controls apply, with rationale |

---

## Features

- 🗂 **Collapsible output cards** — expand only what you need
- 💾 **Persistent history** — assessments survive closing the browser tab via localStorage
- 📱 **Installable PWA** — add to your phone or desktop home screen, launches like a native app
- ⏳ **Loading spinner** — animated feedback during API calls
- ⚠️ **Smart error handling** — specific messages for bad API keys, rate limits, and network failures
- 📄 **Export PDF** — save the full assessment report
- 📋 **Copy buttons** — copy individual sections to clipboard
- 🧪 **Example presets** — four pre-filled controls to demo the tool instantly

---

## Supported Frameworks

- NIST SP 800-53 Rev 5
- NIST CSF 2.0
- FedRAMP Moderate / High
- CIS Controls v8
- ISO 27001:2022
- SOC 2 Type II
- PCI DSS v4.0
- HIPAA Security Rule
- CMMC 2.0
- CISA Zero Trust Maturity Model
- NIST SP 800-171
- NERC CIP
- GDPR

## Supported Cloud Environments

AWS · AWS GovCloud · Azure · Azure Government · GCP · Oracle Cloud (OCI) · Multi-cloud · Hybrid · On-premises

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/bettybangs/Risk-Whisperer.git
   cd Risk-Whisperer
```

2. **Install dependencies**
```bash
   npm install
```

3. **Add your API key**
   Create a `.env` file in the root folder:
   ```
   REACT_APP_ANTHROPIC_API_KEY=your-api-key-here
   ```

4. **Start the app**
```bash
   npm start
```
   The app opens at `http://localhost:3000`   