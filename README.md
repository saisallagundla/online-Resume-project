## Project Report: Building an Online Résumé on AWS Using S3, Route 53, CloudFront, and ACM

### Introduction
In this project, I created a professional online résumé using various AWS services, including S3, Route 53, CloudFront, and ACM. The goal was to host a static website for my résumé, secure it with TLS/SSL, and use a custom domain for easy access. This report provides a detailed, step-by-step account of how I accomplished this project.

### Step 1: Create the Code for the Résumé
First, I developed the HTML, CSS, and JavaScript files for my résumé. The HTML file (`index.html`) contained the structure of my résumé, while the CSS file (`styles.css`) added styling to make it visually appealing. The JavaScript file (`script.js`) was used for interactive elements.

#### HTML Code:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Online Résumé</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <img src="headshot.jpg" alt="My Headshot" class="headshot">
        <h1>John Doe</h1>
        <p id="contactInfo">Email: john.doe@example.com | Phone: (123) 456-7890</p>
    </header>
    <div class="container">
        <section>
            <h2>Employment History</h2>
            <div id="timeline">
                <!-- Employment entries will go here -->
            </div>
        </section>
        <section>
            <h2>Education</h2>
            <ul>
                <!-- Education entries will go here -->
            </ul>
        </section>
        <section>
            <h2>Certifications</h2>
            <ul>
                <!-- Certification entries will go here -->
            </ul>
        </section>
        <section>
            <h2>Skills</h2>
            <ul>
                <!-- Skills entries will go here -->
            </ul>
        </section>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

#### CSS Code:
```css
/* Base reset for padding and margin for all elements */
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

/* Body styling */
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background-color: #000;
    color: #fff;
}

/* Container for centering the content */
.container {
    width: 80%;
    margin: auto;
    overflow: hidden;
    padding: 20px;
}

/* Header styling */
header {
    background: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
}

/* Header image and name styling */
.headshot {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
    margin: 20px auto;
}

header h1 {
    margin-bottom: 10px;
    color: #ff6347; /* Vibrant color for the name */
}

/* Contact information styling */
#contactInfo {
    font-size: 1.1em;
    margin-bottom: 20px;
    color: #fff; 
    padding: 15px;
}

/* Section styling for employment, education, certifications and skills */
section {
    background: #222;
    margin: 20px 0;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

section h2 {
    margin-bottom: 10px;
    color: #00ff00; /* Vibrant color for section headings */
}

/* Timeline styling */
#timeline .entry {
    border-left: 3px solid #ff6347;
    margin-bottom: 5px;
    cursor: pointer;
}

#timeline .entry-header {
    background: #e2e2e2;
    padding: 10px;
    margin-left: -3px; 
}

#timeline .entry-header:hover {
    background: #ccc; 
    color: #333; 
}

/* Style for the job description content */
#timeline .entry-content p {
    padding: 5px 10px;
    background: #f9f9f9;
    border-left: 3px solid #ff6347;
    display: block; 
}

/* List styling for education and skills */
section ul {
    list-style: inside square;
    padding: 0 20px;
}

section ul li {
    padding: 2px 0;
}

/* Adjustments for active class */
.entry.active .entry-header {
    background-color: #e2e2e2; 
    color: #333; 
}

.entry.active .entry-content {
    display: block; 
}

/* Visual cue for clickable items */
.entry .entry-header:after {
    content: ' (click to expand)';
    font-size: 0.8em;
    color: #666;
}

.entry.active .entry-header:after {
    content: ' (click to collapse)';
    font-size: 0.8em;
    color: #666; 
}
```

#### JavaScript Code:
```javascript
document.addEventListener("DOMContentLoaded", function() {
    const entries = document.querySelectorAll(".entry");

    entries.forEach(entry => {
        entry.querySelector(".entry-header").addEventListener("click", () => {
            entry.classList.toggle("active");
        });
    });
});
```

### Step 2: Create an S3 Bucket and Configure it for Static Website Hosting and Public Access
Next, I needed a place to host my résumé files. Amazon S3 is a great option for hosting static websites. Here’s how I set it up:

#### Create an S3 Bucket
1. Navigate to the S3 console in AWS Management Console.
2. Click on "Create bucket".
3. Enter a bucket name that matches my domain name (e.g., `my-resume-site.com`).
4. Choose a region close to me.
5. Leave "Object Ownership" as default.
6. Deselect "Block all public access" and acknowledge the warning.
7. Click "Create bucket".

#### Enable Static Website Hosting
1. In the S3 bucket, navigate to the "Properties" tab.
2. Scroll down to "Static website hosting" and click "Edit".
3. Select "Enable" and enter `index.html` as the "Index document".
4. Save changes.

#### Add a Bucket Policy for Public Access
1. Go to the "Permissions" tab in the S3 bucket.
2. Scroll down to "Bucket policy" and click "Edit".
3. Add the following bucket policy, replacing `Bucket-Name` with my bucket name:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject"
                ],
                "Resource": [
                    "arn:aws:s3:::my-resume-site.com/*"
                ]
            }
        ]
    }
    ```
4. Save changes.

#### Upload Files to S3
1. Go to the "Objects" tab in the S3 bucket.
2. Click "Upload" and upload `index.html`, `styles.css`, `script.js`, and `headshot.jpg`.

### Step 3: Use Route 53 to Set Up a Custom Domain
To make my résumé more professional, I set up a custom domain using Route 53.

#### Register a Domain with Route 53
1. Navigate to Route 53 in the AWS Management Console.
2. Enter the desired domain name and check its availability.
3. If available, select it and complete the purchase.

#### Create a Hosted Zone
1. After purchasing the domain, a hosted zone is automatically created.
2. Navigate to "Hosted zones" and click into the one that matches my domain name.

#### Create an A Record with an Alias to Point to the S3 Website
1. In the hosted zone, click "Create record".
2. Use the "quick create" mode.
3. Enter the following details:
    - Record name: Leave blank (root domain).
    - Record type: A
    - Alias: Yes
    - Alias target: Select the S3 website endpoint.
4. Click "Create records".

### Step 4: Set Up a TLS/SSL Certificate with AWS Certificate Manager (ACM)
To secure my website with HTTPS, I set up a TLS/SSL certificate using ACM.

#### Request a Certificate
1. Navigate to ACM in the AWS Management Console.
2. Change the region to `us-east-1`.
3. Click "Request a certificate" and select "Request a public certificate".
4. Enter my domain name and click "Next".
5. Select DNS validation and click "Next".
6. Click "Request" and then "View certificate".

#### Validate the Certificate
1. In the certificate details, click "Create records in Route 53".
2. Follow the prompts to create the necessary DNS records.
3. Wait for the certificate status to change to "Issued".

### Step 5: Create a CloudFront Distribution
Since S3 doesn't support HTTPS directly, I used CloudFront to distribute my content and apply the certificate.

#### Create a CloudFront Distribution
1.Navigate to CloudFront in the AWS Management Console.
2. Click "Create Distribution".
3. Enter the following details:
    - Origin domain: My S3 bucket website endpoint.
    - Viewer protocol policy: Redirect HTTP to HTTPS.
    - Allowed HTTP methods: GET, HEAD.
4. Under "Settings", add my domain name to the "Alternate Domain Names (CNAMEs)" field.
5. Select the ACM certificate I created earlier.
6. Click "Create Distribution".

#### Update Route 53 to Point to the CloudFront Distribution
1. Go back to Route 53 and select my hosted zone.
2. Edit the A record created earlier.
3. Change the alias target to the CloudFront distribution domain name.
4. Save changes.

### Conclusion
By following these steps, I successfully created an online résumé hosted on AWS. This project gave me hands-on experience with S3, Route 53, CloudFront, and ACM, enhancing my understanding of AWS services and their integration. My résumé is now accessible at `https://my-resume-site.com`, providing a professional and secure platform to showcase my credentials.


