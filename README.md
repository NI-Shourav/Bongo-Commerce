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

## Getting Started

Follow the steps below to have BongoCommerce running locally with a fully connected AWS backend.

### 1. Clone the Repository

```bash
git clone <your-repo-url> bongo-commerce
cd bongo-commerce/frontend
npm install
```

---

### 2. Set Up the AWS Backend

You will need an active **AWS Account** to complete this section.

#### A. Create the DynamoDB Table

1. Navigate to **DynamoDB** in the AWS Console and select **Create table**.
2. Set the table name to `BongoProducts`.
3. Set the partition key to `productId` with type **String**.
4. Click **Create table**.

#### B. Create the IAM Role

1. Navigate to **IAM** → **Roles** → **Create role**.
2. Select **AWS Service** as the trusted entity type and choose **Lambda**.
3. Attach the following policies:
   - `AmazonDynamoDBFullAccess`
   - `CloudWatchEventsFullAccess`
4. Name the role `Bongo_Commerce_CRUD_Role` and click **Create role**.

#### C. Create the Lambda Function

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
9. Copy the generated Function URL — you will need it in the next step.

> **Note:** In `backend/lambda.js`, ensure the AWS region matches your deployment region. For example, if you are deploying to Sydney, line 7 should read:
> ```js
> const client = new DynamoDBClient({ region: "ap-southeast-2" });
> ```

---

### 3. Configure the Environment

Create a `.env` file in the `frontend` directory and add your Lambda Function URL:

```env
VITE_LAMBDA_URL=https://<your-url>.lambda-url.ap-southeast-2.on.aws/
```

> Ensure there are no trailing spaces or extra characters in the URL.

---

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Verification

Once the app is running, confirm everything is working end-to-end:

- [ ] Create a product by providing a title, price, and image URL.
- [ ] Open the DynamoDB console, select your table, and click **Explore table items** to verify the record was saved.
- [ ] Your data is now live in the cloud.

---

Built with care by **Shourav**