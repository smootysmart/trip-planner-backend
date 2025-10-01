## Workshop Task: Building Your CI/CD Pipelines (Backend Edition)

In this exercise, you’ll create two automated workflows for your backend application using reusable actions. We’ll focus only on security scanning for PRs and Docker image deployment for pushes to `main`.

**Our Goals:**

1.  **Pull Request Pipeline:** Run a security scan on every Pull Request to `main`.
2.  **Deployment Pipeline:** Deploy the backend Docker image to Docker Hub *only* when code is pushed to `main`.

-----

### **Prerequisites: Configure Your Repository Secrets**

Add your Docker Hub credentials as secrets:

- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: Your Docker Hub [Access Token](https://docs.docker.com/docker-hub/access-tokens/).

-----

### **Part 1: The Pull Request Pipeline (Security Scan Only)**

This pipeline runs a vulnerability scan on every PR to `main`.

1.  In your repo, go to **Actions** > **New workflow** > **set up a workflow yourself**.
2.  Name the file `pr-security-scan.yml`.
3.  Paste the following code:

```yaml
# .github/workflows/pr-security-scan.yml

name: PR Security Scan

on:
  pull_request:
    branches: [ main ]

jobs:
  run-security-scan:
    name: Trivy Vulnerability Scan
    uses: LSEG-Immersion-Day-DevOps-workshop-2025/actions/.github/workflows/security-scan-ci.yml@main
```

4.  Commit the file to your `main` branch.

-----

### **Part 2: The Deployment Pipeline (Push Only)**

This pipeline builds and pushes your backend Docker image to Docker Hub when code is pushed to `main`.

1.  Go to **Actions** > **New workflow** > **set up a workflow yourself**.
2.  Name the file `deploy-to-dockerhub.yml`.
3.  Paste the following code (replace `your-dockerhub-username`):

```yaml
# .github/workflows/deploy-to-dockerhub.yml

name: Deploy Backend to Docker Hub

on:
  push:
    branches: [ main ]

jobs:
  build-and-push-image:
    name: Push to Docker Hub
    uses: LSEG-Immersion-Day-DevOps-workshop-2025/actions/.github/workflows/docker-push-ci.yml@main
    with:
      image_name: your-dockerhub-username/trip-planner-backend
      tag: ${{ github.sha }}
    secrets:
      DOCKER_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }}
      DOCKER_PASSWORD: ${{ secrets.DOCKERHUB_TOKEN }}
```

4.  Commit the file to your `main` branch.

-----

### **Part 3: Testing Your Pipelines**

1.  **Create a new branch:**  
    ```bash
    git checkout -b my-feature-update
    ```
2.  **Make a change:** Edit any backend file.
3.  **Commit and push:**  
    ```bash
    git add .
    git commit -m "feat: backend update"
    git push -u origin my-feature-update
    ```
4.  **Open a Pull Request:**  
    - Observe the "PR Security Scan" workflow running.
5.  **Merge the PR:**  
    - The "Deploy Backend to Docker Hub" workflow will run on `main`.
6.  **Check Docker Hub:**  
    - Your backend image should be updated.

Congratulations! You now have streamlined CI/CD pipelines for your backend repo.
