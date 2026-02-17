# BongoCommerce

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

> A serverless e-commerce platform built on the **DARN Stack** — DynamoDB, AWS Lambda, React, and Node.js.

BongoCommerce is a full-stack product management system that leverages AWS Lambda for compute and DynamoDB for persistence, delivering a lightning-fast, cost-efficient shopping experience with virtually zero infrastructure overhead.

---

## Architecture Overview

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, reactive user interface |
| **Styling** | Tailwind CSS | Utility-first design system |
| **Compute** | AWS Lambda | Serverless backend logic |
| **Database** | DynamoDB | Scalable NoSQL data store |
| **API** | Lambda Function URL | Direct HTTP endpoint, no API Gateway needed |

---

## AWS Backend Setup

> **This section is required for both Local and EC2 deployment.**

### A. Create the DynamoDB Table

1. Navigate to **DynamoDB** in the AWS Console and select **Create table**.
2. Set the table name to `BongoProducts`.
3. Set the partition key to `productId` with type **String**.
4. Click **Create table**.

### B. Create the IAM Role

1. Navigate to **IAM** → **Roles** → **Create role**.
2. Select **AWS Service** as the trusted entity type and choose **Lambda**.
3. Attach the following policies:
   - `AmazonDynamoDBFullAccess`
   - `CloudWatchEventsFullAccess`
4. Name the role `Bongo_Commerce_CRUD_Role` and click **Create role**.

### C. Create the Lambda Function

1. Navigate to **Lambda** → **Create function**.
2. Set the function name to `Bongo_Commerce_CRUD`.
3. Select **Node.js 24.x** as the runtime.
4. Under **Permissions**, choose **Use an existing role** and select `Bongo_Commerce_CRUD_Role`.
5. Click **Create function**.
6. Package and upload your backend code:
   ```bash
   cd backend
   npm install
   zip -r lambda.zip lambda.js package.json node_modules
   ```
   Upload the resulting `lambda.zip` file via the **Code** tab in the Lambda console.
7. Go to **Runtime settings** → **Edit** and set the handler to `lambda.handler`.
8. Under **Configuration** → **Function URL**, enable a Function URL with auth type set to `NONE`.
9. Copy the generated **Function URL** — you will need it in the next steps.

> **Note:** In `backend/lambda.js`, ensure the AWS region matches your deployment region. For example, if you are deploying to Sydney, line 7 should read:
> ```js
> const client = new DynamoDBClient({ region: "ap-southeast-2" });
> ```

---

## 🖥️ Option 1: Run Locally

### Step 1: Clone the Repository

```bash
git clone <your-repo-url> bongo-commerce
cd bongo-commerce/frontend
npm install
```

### Step 2: Configure the Environment

Create a `.env` file in the `frontend` directory and add your Lambda Function URL:

```env
VITE_LAMBDA_URL=https://<your-url>.lambda-url.ap-southeast-2.on.aws/
```

> Ensure there are no trailing spaces or extra characters in the URL.

### Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Option 2: Run on AWS EC2

### Step 1: Launch EC2 Instance

Launch a new virtual server (EC2) from the AWS Console:

1. **Name:** `BongoCommerce-Frontend`
2. **OS Image (AMI):** `Ubuntu Server 24.04 LTS` (or any recent Ubuntu version).
3. **Instance Type:** `t2.micro` (Suitable for Free Tier).
4. **Key Pair:** Create a new Key Pair (e.g., `bongo-key.pem`), download it, and keep it safe.
5. **Security Group (Firewall):** Keep the following ports open:
   - **SSH (22):** `My IP` (For access only from your IP).
   - **HTTP (80):** `Anywhere (0.0.0.0/0)` (For future Nginx setup).
   - **Custom TCP (5173):** `Anywhere (0.0.0.0/0)` (For Dev Server testing).

### Step 2: Connect to Your Server

Open your terminal and navigate to the folder where your `bongo-key.pem` file is located.

1. **Fix Key Permissions:**
   ```bash
   chmod 400 bongo-key.pem
   ```

2. **SSH into the Server:**
   *(Replace `YOUR_EC2_IP` with your EC2 Public IP)*
   ```bash
   ssh -i bongo-key.pem ubuntu@YOUR_EC2_IP
   ```

### Step 3: System Update & Tools Installation

After logging into the server, run the following commands one by one:

1. **Update System:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js (Version 24) via NVM:**
   ```bash
   # Install NVM
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

   # Load NVM
   . ~/.nvm/nvm.sh

   # Install and use Node.js
   nvm install 24
   nvm use 24

   # Check versions
   node -v  # Should show v24.x.x
   npm -v   # Should show 10.x.x
   ```

### Step 4: Project Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/shourav/bongo-commerce.git
   ```

2. **Enter Directory & Install Dependencies:**
   ```bash
   cd bongo-commerce/frontend
   npm install
   ```

3. **Setup Environment Variables:**
   ```bash
   nano .env
   ```
   Once the editor opens, paste the following line (using your actual URL):
   ```env
   VITE_LAMBDA_URL=https://your-lambda-url.amazonaws.com/
   ```
   *To Save:* `Ctrl + O`, then `Enter`. *To Exit:* `Ctrl + X`.

### Step 5: Run the Application

```bash
npm run dev -- --host 0.0.0.0
```

Visit in your browser: `http://YOUR_EC2_IP:5173`

---

## ✅ Verification

Once the app is running (locally or on EC2), confirm everything is working end-to-end:

- [ ] Create a product by providing a title, price, and image URL.
- [ ] Open the DynamoDB console, select your table, and click **Explore table items** to verify the record was saved.
- [ ] Your data is now live in the cloud.

---

## ❓ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Site not loading?** | Check **Security Groups** in AWS EC2 Console. Is Port `5173` open for `0.0.0.0/0`? |
| **Permission Denied (SSH)?** | Ensure you ran `chmod 400 bongo-key.pem`. Are you using the username `ubuntu`? |
| **Lambda not working?** | Check if `VITE_LAMBDA_URL` is correct in `.env`. Issues often arise from having or missing a trailing `/`. |
| **`nvm` command not found?** | Run `. ~/.nvm/nvm.sh` to reload NVM in the current terminal session. |

---

*Built with care by **Shourav** 🚀*
