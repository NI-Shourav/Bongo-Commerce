# 🛒 BongoCommerce

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

> A serverless e-commerce platform built on the **DARN Stack** — DynamoDB, AWS Lambda, React, and Node.js.

BongoCommerce is a full-stack product management system that leverages AWS Lambda for compute and DynamoDB for persistence — delivering a fast, cost-efficient shopping experience with virtually zero infrastructure overhead.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser / Client                   │
│                  React + Vite + Tailwind                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              AWS Lambda Function URL                    │
│            (No API Gateway required)                    │
└────────────────────────┬────────────────────────────────┘
                         │ SDK
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Amazon DynamoDB                      │
│                  Table: BongoProducts                   │
└─────────────────────────────────────────────────────────┘
```

| Layer        | Technology           | Purpose                               |
| :----------- | :------------------- | :------------------------------------ |
| **Frontend** | React + Vite         | Fast, reactive user interface         |
| **Styling**  | Tailwind CSS         | Utility-first design system           |
| **Compute**  | AWS Lambda (Node 24) | Serverless backend logic              |
| **Database** | DynamoDB             | Scalable NoSQL data store             |
| **API**      | Lambda Function URL  | Direct HTTP endpoint, no API Gateway  |

---

## 📁 Project Structure

```
bongo-commerce/
├── backend/
│   ├── lambda.js          # Lambda handler (CRUD operations)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   └── main.jsx       # App entry point
    ├── .env               # Environment variables (not committed)
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

Choose your preferred deployment option:

- [**Option 1 — Run Locally**](#-option-1-run-locally) — Quickest way to get started on your machine.
- [**Option 2 — Deploy on AWS EC2**](#️-option-2-deploy-on-aws-ec2) — Host it on a cloud virtual server.

Both options require the [AWS Backend Setup](#-aws-backend-setup) below to be completed first.

---

## ☁️ AWS Backend Setup

> **Complete this section before running the app locally or on EC2.**

### Step 1 — Create the DynamoDB Table

1. Open the [DynamoDB Console](https://console.aws.amazon.com/dynamodb) and click **Create table**.
2. Set the following:
   - **Table name:** `BongoProducts`
   - **Partition key:** `productId` (type: **String**)
3. Leave other settings as default and click **Create table**.

---

### Step 2 — Create the IAM Role

1. Go to **IAM → Roles → Create role**.
2. Select **AWS Service** as the trusted entity type and choose **Lambda**.
3. Attach the following policies:
   - `AmazonDynamoDBFullAccess`
   - `CloudWatchEventsFullAccess`
4. Name the role `Bongo_Commerce_CRUD_Role` and click **Create role**.

---

### Step 3 — Create & Configure the Lambda Function

1. Go to **Lambda → Create function**.
2. Set the following:
   - **Function name:** `Bongo_Commerce_CRUD`
   - **Runtime:** `Node.js 24.x`
   - **Permissions:** Use an existing role → `Bongo_Commerce_CRUD_Role`
3. Click **Create function**.

4. Package and upload the backend code:
   ```bash
   cd backend
   npm install
   zip -r lambda.zip lambda.js package.json node_modules
   ```
   Then upload `lambda.zip` via the **Code** tab in the Lambda console.

5. Go to **Runtime settings → Edit** and set the handler to:
   ```
   lambda.handler
   ```

6. Under **Configuration → Function URL**, create a Function URL with auth type `NONE`.

7. Copy the generated **Function URL** — you'll use it in the next steps.

> **⚠️ Region Note:** In `backend/lambda.js`, make sure the AWS region matches your deployment region. For example, for Sydney:
> ```js
> const client = new DynamoDBClient({ region: "ap-southeast-2" });
> ```

---

## 💻 Option 1: Run Locally

### 1. Clone the Repository

```bash
git clone <your-repo-url> bongo-commerce
cd bongo-commerce/frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_LAMBDA_URL=https://<your-url>.lambda-url.ap-southeast-2.on.aws/
```

> Make sure there are no trailing spaces or extra characters in the URL.

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. That's it! 🎉

---

## 🖥️ Option 2: Deploy on AWS EC2

### Step 1 — Launch an EC2 Instance

1. In the AWS Console, navigate to **EC2 → Launch Instance** with these settings:

   | Setting           | Value                           |
   | :---------------- | :------------------------------ |
   | **Name**          | `BongoCommerce-Frontend`        |
   | **AMI**           | Ubuntu Server 24.04 LTS         |
   | **Instance Type** | `t2.micro` (Free Tier eligible) |
   | **Key Pair**      | Create new → `bongo-key.pem`    |

2. Configure the **Security Group** to allow the following inbound rules:

   | Type       | Port | Source          |
   | :--------- | :--- | :-------------- |
   | SSH        | 22   | My IP           |
   | HTTP       | 80   | 0.0.0.0/0       |
   | Custom TCP | 5173 | 0.0.0.0/0       |

---

### Step 2 — Connect to Your Server

Navigate to the folder where `bongo-key.pem` is saved, then run:

```bash
# Fix key permissions
chmod 400 bongo-key.pem

# SSH into the instance (replace YOUR_EC2_IP with your actual public IP)
ssh -i bongo-key.pem ubuntu@YOUR_EC2_IP
```

---

### Step 3 — Install Node.js via NVM

Once logged into the server:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Load NVM in current session
. ~/.nvm/nvm.sh

# Install Node.js 24
nvm install 24
nvm use 24

# Verify installation
node -v   # v24.x.x
npm -v    # 10.x.x
```

---

### Step 4 — Set Up the Project

```bash
# Clone the repository
git clone https://github.com/shourav/bongo-commerce.git
cd bongo-commerce/frontend

# Install dependencies
npm install

# Create and edit the environment file
nano .env
```

In the editor, paste your Lambda Function URL:

```env
VITE_LAMBDA_URL=https://your-lambda-url.amazonaws.com/
```

Save with `Ctrl + O` → `Enter`, then exit with `Ctrl + X`.

---

### Step 5 — Run the Application

```bash
npm run dev -- --host 0.0.0.0
```

Open your browser and visit: `http://YOUR_EC2_IP:5173`

---

## ✅ Verification Checklist

Once the app is running, verify the full stack is working:

- [ ] Create a product with a title, price, and image URL.
- [ ] Open the DynamoDB Console → select `BongoProducts` → click **Explore table items**.
- [ ] Confirm the new product record appears in the table.

If all three steps pass, your app is fully operational end-to-end. 🚀

---

## 🔧 Troubleshooting

| Issue | Solution |
| :---- | :-------- |
| **Site not loading** | Check your EC2 **Security Group** — is port `5173` open to `0.0.0.0/0`? |
| **SSH: Permission Denied** | Run `chmod 400 bongo-key.pem` and ensure you're using the username `ubuntu`. |
| **Lambda not responding** | Double-check `VITE_LAMBDA_URL` in `.env`. A missing or extra trailing `/` is a common cause. |
| **`nvm` command not found** | Run `. ~/.nvm/nvm.sh` to reload NVM in your current terminal session. |
| **DynamoDB write failing** | Verify the IAM role has `AmazonDynamoDBFullAccess` and is attached to the Lambda function. |

---

*Built with ❤️ by **Shourav***
