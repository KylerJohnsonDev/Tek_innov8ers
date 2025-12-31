## Exploiting vulnerabilities

This section provides instructions on how to exploit known vulnerabilities in the application for educational and testing purposes only. 

DISCLAIMER: In the real world, please ensure you have permission to test applications before attempting any of these types of exploits on live sites. Failure to do so may be illegal and could result in legal repercussions. 

### 1. SQL Injection
The project search feature is vulnerable to SQL Injection attacks. An attacker can manipulate the search input to execute arbitrary SQL commands.

**How to exploit:**
1. Login and navigate to the project search page - note that all of the user's projects are listed under All Projects
2. In the search input, enter a malicious SQL payload, such as:
   ```
   ' OR '1'='1'; --
   ```
3. Submit the search form. If the exploit is successful, this returns all projects in the database, not just the user's projects.


### 2. Cross-site Scripting (XSS)
Project descriptions are not sanitized, allowing an attacker to inject malicious scripts that execute in the context of other users' browsers.

**How to exploit:**
1. Login and create or edit a project.
2. In the project description field, enter a malicious script, such as:
    ```html
    <img src=x onerror=alert('Hacked!')>
    ```
3. Save the project. When any user views the project description, the script will execute, triggering the alert.

Note: Modern browsers may block certain types of XSS payloads. By default, Content Security Policies (CSPs) may prevent some scripts from running. So here we need to use more clever technique to bypass those protections. Instead of using a `script` tag, we use an `img` tag with an `onerror` event handler to execute our JavaScript when the image fails to load.

### 3. Broken Access Control / Insecure Direct Object References (IDOR)
Users can access projects and tasks that do not belong to them by manipulating URL parameters.

**How to exploit:**
1. Login as either John or Jane (One of the seeded users provided in the setup process)
2. Click on a project to navigate to the project details page.
3. Copy the URL.
- The URL should look something like: `http://localhost:3000/projects/0302a69f-f46a-4115-b304-1c9edf957d7d`.
4. Logout and login as the other user. If in step one you logged in as John, now log in as Jane (or vice versa).
5. Paste the copied URL into the browser's address bar and navigate to it. If the exploit is successful, you will be able to access the project details page of a project that does not belong to the currently logged-in user.