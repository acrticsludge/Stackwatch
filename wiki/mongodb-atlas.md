# Connecting MongoDB Atlas

Stackwatch connects to MongoDB Atlas via the Atlas Admin API to track storage and connection usage across your clusters. Optionally, you can add a MongoDB connection string to get real-time data from M0/free-tier clusters and unlock per-database breakdowns on Pro.

---

## What Stackwatch tracks

### Always (Atlas Admin API)

| Metric | Plan | Description |
|--------|------|-------------|
| **Storage Used** | Free + Pro | Total data size across all databases, compared against your tier's storage limit |
| **Active Connections** | Free + Pro | Current open connection count vs the connection limit for your cluster tier |
| **Network In** (MB/h) | Pro only | Inbound network throughput (bytes/sec → MB/hour), compared against a 10 GB/day reference |
| **Network Out** (MB/h) | Pro only | Outbound network throughput, same reference |

> **M0 note:** M0/shared clusters do not expose process measurements via the Atlas Admin API. Without a connection string, Storage and Active Connections will show as 0/limit. Add a connection string (Step 4) to get real values.

### With connection string (optional)

| Metric | Plan | Description |
|--------|------|-------------|
| **Storage Used** | Free + Pro | Real compressed storage from `db.stats()` — replaces the 0/limit placeholder |
| **Active Connections** | Free + Pro | Real connection count from `serverStatus` |
| **DB Size** per database | Pro only | Per-database storage breakdown, shown as an expandable accordion in the dashboard |
| **Collection Size** per collection | Pro only | Per-collection storage, visible under each database in the accordion |

### Atlas tier limits used

| Instance | Storage | Max connections |
|----------|---------|-----------------|
| M0 (Free) | 512 MB | 500 |
| M2 | 2 GB | 300 |
| M5 | 5 GB | 500 |
| M10 | 10 GB | 1,500 |
| M20+ | from disk config | 3,000+ |

---

## Prerequisites

- A MongoDB Atlas account with at least one cluster
- Ability to create API keys in your Atlas organization (Organization Owner or Project Owner role)

---

## Step 1 — Find your Project ID

1. Log in to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Select your **Organization** in the top-left dropdown
3. Click the project you want to monitor
4. Look at the URL — it contains your Project ID:
   ```
   https://cloud.mongodb.com/v2/<PROJECT_ID>#/clusters
   ```
   Copy that 24-character hex string.

---

## Step 2 — Create an API key

1. In your Atlas project, go to **Identity & Access** → **Applications** → **API Keys**
2. Click **Create API Key**
3. Enter a description (e.g. `Stackwatch monitoring`)
4. Assign the **Project Read Only** role — Stackwatch only ever reads data, it never modifies your cluster
5. Click **Next**
6. Copy both the **Public Key** (short alphanumeric string) and the **Private Key** (shown only once — save it now)
7. Add your outbound IP to the access list if your Atlas project requires IP allowlisting. If you're on Vercel, you may need to allowlist `0.0.0.0/0` or use a static egress IP.

---

## Step 3 — Connect in Stackwatch

1. Go to **Integrations** in Stackwatch
2. Find **MongoDB Atlas** and click **Add account**
3. Fill in the form:
   - **Atlas Public Key** — the short key from Step 2
   - **Atlas Private Key** — the long private key from Step 2 (stored encrypted)
   - **Project ID** — the 24-character ID from Step 1
   - **Account label** — a friendly name (e.g. `prod-cluster`)
4. Click **Connect**

Stackwatch will poll your cluster on the next cycle (within 15 minutes on Free, 5 minutes on Pro).

---

## Step 4 — Add a connection string (optional, for live M0 data)

If you're on an M0/free-tier cluster, or you want per-database and per-collection breakdowns on Pro, add a MongoDB connection string. This gives Stackwatch direct read-only access via `db.stats()` and `serverStatus`.

### Create a monitoring-only DB user

1. In Atlas, go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Set a username (e.g. `stackwatch-monitor`) and a strong password
4. Under **Built-In Role**, select **`clusterMonitor`** — this role grants access to all monitoring commands (`dbStats`, `collStats`, `serverStatus`, `listCollections`) with **zero read/write access to your data**
5. Click **Add User**

### Get your connection string

1. In Atlas, go to **Database** → click **Connect** on your cluster
2. Choose **Drivers**
3. Copy the connection string and replace `<username>` and `<password>` with the credentials from above
4. The string looks like: `mongodb+srv://stackwatch-monitor:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Add it in Stackwatch

1. Go to **Integrations** → find your MongoDB Atlas account → click the **edit (pencil)** icon
2. Paste the connection string into the **Connection String (optional)** field
3. Click **Save changes**

The next poll cycle will use the direct connection path. The "M0: add a connection string" warning in your dashboard will disappear once real data is returned.

---

## Troubleshooting

### Status shows `error` with "Invalid API key"
- Double-check the **Public Key** and **Private Key** (no extra spaces)
- Verify the key pair hasn't been deleted in Atlas → Identity & Access → Applications → API Keys

### Status shows `error` with "lacks required access"
- The API key must have at least the **Project Read Only** role on the project
- Org-level roles alone are not sufficient — the key needs a project-level assignment

### Status shows `error` with "Project ID not found"
- Confirm the Project ID (24-character hex) is correct
- Make sure the API key is assigned to that specific project

### Dashboard shows 0/512 MB after connecting (M0 cluster)
- This is expected without a connection string — Atlas M0 clusters do not expose process measurements via the Admin API
- Follow Step 4 above to add a connection string and get real values

### Dashboard shows no data after adding connection string
- Verify the DB user has the `clusterMonitor` built-in role (not a custom role)
- Check that the worker's IP is in the Atlas network access list (or set to `0.0.0.0/0`)
- Confirm the connection string format is correct (use SRV format: `mongodb+srv://...`)

### IP allowlist errors
- Both the Atlas Admin API and direct connections require the worker's IP to be allowed
- Add the Railway egress IP, or set Atlas access to `0.0.0.0/0` for unrestricted access

---

## Security

- Your **Atlas Private Key** is encrypted with AES-256-GCM before being stored in the database
- Your **Connection String** (if provided) is also encrypted with AES-256-GCM — only the encrypted value is stored, the plaintext is never persisted
- The `clusterMonitor` role grants **zero read/write access to your collection data** — Stackwatch only runs monitoring commands (`dbStats`, `serverStatus`, etc.)
- Stackwatch uses the Admin API key **read-only** — it never creates, modifies, or deletes any Atlas resource
- Row-level security ensures your credentials are only accessible to your own account
- To revoke access: delete the integration in Stackwatch, delete the API key in Atlas, and remove the DB user created in Step 4
