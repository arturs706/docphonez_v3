"use client"; // this is a client component 👈🏽

import React from 'react'
import styles from './page.module.css'
import { useEffect } from 'react'
import refreshToken from '@/checkCr'
import { useDispatch } from 'react-redux'


export default function Page() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function checkRefreshToken() {
      await refreshToken(dispatch);
    }
    checkRefreshToken();
  }, [dispatch]);


  return (
    <div className={styles.main}>
    <div className={styles.ovalblurdyn}></div>
    <div className={styles.divwrap}>
    <h1>Privacy Policy</h1>
    <br />
    <br />
    <h3>Last updated April 18, 2023</h3>
    <br></br>

    <span>
     We are Doctorphonez (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
     </span>
     <br></br>
    <br></br>
     <span>
      We operate the website https://doctorphonez.co.uk (the &apos;Site&apos;), as well as any other related products and services that refer or link to these legal terms (the &apos;Legal Terms&apos;) (collectively, the &apos;Services&apos;). </span>
    <br></br>
    <br></br>

    <span>•	Visit our website at https://doctorphonez.co.uk, or any website of ours that links to this privacy notice</span>
    <br></br>
    <br></br>
    <span>•	Engage with us in other related ways, including any sales, marketing, or events</span>
    <br></br>
    <br></br>
    <span>
    Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at info@doctorphonez.co.uk.
    </span>
    <br></br>
    <br></br>
    <br></br>
    <h3>SUMMARY OF KEY POINTS</h3>
    <br></br>
    <h4><em>This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.</em></h4>
    <br></br>
    <h4>What personal information do we process?</h4>
    <br></br>
    <span>When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Doctorphonez and the Services, the choices you make, and the products and features you use. Learn more about personal information you disclose to us.</span>
    <br></br>
    <br></br>
    <h4>Do we receive any information from third parties?</h4>
    <br></br>
    <span>We do not receive any information from third parties.</span>
    <br></br>
    <br></br>
    <h4>How do we process your information?</h4>
    <br></br>
    <span>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about how we process your information.</span>
    <br></br>
    <br></br>
    <h4>In what situations and with which types of parties do we share personal information?</h4>
    <br></br>
    <span>We may share information in specific situations and with specific categories of third parties. Learn more about when and with whom we share your personal information.</span>
    <br></br>
    <br></br>
    <h4>How do we keep your information safe?</h4>
    <br></br>
    <span>We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about how we keep your information safe.</span>
    <br></br>
    <br></br>
    <h4>What are your rights?</h4>
    <br></br>
    <span>The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</span>
    <br></br>
    <br></br>
    <span>Want to learn more about what Doctorphonez does with any information we collect? Review the privacy notice in full.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>SUMMARY OF KEY POINTS</h3>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>1. WHAT INFORMATION DO WE COLLECT?</span>
    <span>2. HOW DO WE PROCESS YOUR INFORMATION?</span>
    <span>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</span>
    <span>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</span>
    <span>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</span>
    <span>6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</span>
    <span>7. HOW LONG DO WE KEEP YOUR INFORMATION?</span>
    <span>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</span>
    <span>9. DO WE COLLECT INFORMATION FROM MINORS?</span>
    <span>10. WHAT ARE YOUR PRIVACY RIGHTS?</span>
    <span>11. CONTROLS FOR DO-NOT-TRACK FEATURES</span>
    <span>12. DO WE MAKE UPDATES TO THIS NOTICE?</span>
    <span>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</span>
    <span>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</span>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <h3>1. WHAT INFORMATION DO WE COLLECT?</h3>
    <br></br>
    <br></br>
    <h4>Personal information you disclose to us</h4>
    <br></br>
    <br></br>
    <span>In Short: We collect personal information that you provide to us.</span>
    <br></br>
    <br></br>
    <span>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</span>
    <br></br>
    <br></br>
    <h4>Personal Information Provided by You.</h4>
    <br></br>
    <span>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>• names</span>
    <span>• phone</span>
    <span>•	numbers</span>
    <span>•	email</span>
    <span>•	addresses</span>
    <span>•	mailing </span>
    <span>•	addresses</span>
    <span>•	passwords</span>
    <span>•	billing </span>
    <span>•	addresses</span>
    <span>•	debit/credit card numbers</span>
    </div>

    <br></br>
    <br></br>
    <h4>Sensitive Information.</h4>
    <br></br>
    <br></br>
    <span>We do not process sensitive information.</span>
    <br></br>
    <br></br>
    <h4>Payment Data.</h4>
    <br></br>
    <br></br>
    <span>We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here: https://stripe.com/gb/privacy.</span>
    <br></br>
    <br></br>
    <h4>Social Media Login Data.</h4>
    <br></br>
    <br></br>
    <span>Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called &ldquo;HOW DO WE HANDLE YOUR SOCIAL LOGINS?&rdquo; below.</span>
    <br></br>
    <br></br>
    <span>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</span>
    <br></br>
    <br></br>
    <h4>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</h4>
    <br></br>
    <br></br>
    <span>•	To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.</span>
    <br></br>
    <br></br>
    <span>•	To save or protect an individual&apos;s vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</span>
    <br></br>
    <br></br>
    <h4><u><em>If you are located in the EU or UK, this section applies to you.</em></u></h4>
    <br></br>
    <br></br>
    <span>The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</span>
    <br></br>
    <br></br>
    <h4>Consent.</h4>
    <br></br>
    <br></br>
    <span>We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent.</span>
    <br></br>
    <br></br>
    <h4>Legal Obligations.</h4>
    <br></br>
    <br></br>
    <span>We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</span>
    <br></br>
    <br></br>
    <h4>Vital Interests.</h4>
    <br></br>
    <br></br>
    <span>We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</span>
    <br></br>
    <br></br>
    <span>In legal terms, we are generally the &quot;data controller&quot; under European data protection laws of the personal information described in this privacy notice, since we determine the means and/or purposes of the data processing we perform. This privacy notice does not apply to the personal information we process as a &quot;data processor&quot; on behalf of our customers. In those situations, the customer that we provide services to and with whom we have entered into a data processing agreement is the &quot;data controller&quot; responsible for your personal information, and we merely process your information on their behalf in accordance with your instructions. If you want to know more about our customers&apos; privacy practices, you should read their privacy policies and direct any questions you have to them.</span>
    <br></br>
    <br></br>
    <h4><u><em>If you are located in Canada, this section applies to you.</em></u></h4>
    <br></br>
    <br></br>
    <span>We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.</span>
    <br></br>
    <br></br>
    <span>In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>•	If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</span>
    <span>•	For investigations and fraud detection and prevention</span>
    <span>•	For business transactions provided certain conditions are met</span>
    <span>•	If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</span>
    <span>•	For identifying injured, ill, or deceased persons and communicating with next of kin</span>
    <span>•	If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</span>
    <span>•	If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</span>
    <span>•	If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</span>
    <span>•	If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</span>
    <span>•	If the collection is solely for journalistic, artistic, or literary purposes</span>
    <span>•	If the information is publicly available and is specified by the regulations</span>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <h3>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We may share information in specific situations described in this section and/or with the following categories of third parties.</span>
    <br></br>
    <br></br>
    <h4>Vendors, Consultants, and Other Third-Party Service Providers.</h4>
    <br></br>
    <br></br>
    <span>Vendors, Consultants, and Other Third-Party Service Providers. We may share your data with third-party vendors, service providers, contractors, or agents (&quot;third parties&quot;) who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any organization apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct. The categories of third parties we may share personal information with are as follows:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>•	Payment Processors</span>
    <span>•	Order Fulfillment Service Providers</span>
    </div>
    <br></br>
    <br></br>
    <span>We also may need to share your personal information in the following situations:</span>
    <br></br>
    <br></br>
    <h4>Business Transfers.</h4>
    <br></br>
    <br></br>
    <span>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</span>
    <br></br>
    <br></br>
    <h4>When we use Google Maps Platform APIs.</h4>
    <br></br>
    <br></br>
    <span>We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). We use certain Google Maps Platform APIs to retrieve certain information when you make location-specific requests. This includes: Location; and other similar information. A full list of what we use information for can be found in this section and in the previous section titled &ldquo;HOW DO WE PROCESS YOUR INFORMATION?&rdquo;. The Google Maps Platform APIs that we use store and access cookies and other information on your devices. If you are a user currently in the European Economic Area (EU countries, Iceland, Liechtenstein, and Norway) or the United Kingdom, please take a look at our Cookie Notice.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We may use cookies and other tracking technologies to collect and store your information.</span>
    <br></br>
    <br></br>
    <span>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</span>
    <br></br>
    <br></br>
    <span>Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</span>
    <br></br>
    <br></br>
    <span>We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>7. HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</span>
    <br></br>
    <br></br>
    <span>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</span>
    <br></br>
    <br></br>
    <span>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We aim to protect your personal information through a system of organizational and technical security measures.</span>
    <br></br>
    <br></br>
    <span>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>9. DO WE COLLECT INFORMATION FROM MINORS?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>We do not knowingly collect data from or market to children under 18 years of age.</span>
    <br></br>
    <br></br>
    <span>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at info@doctorphonez.co.uk.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>10. WHAT ARE YOUR PRIVACY RIGHTS?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</span>
    <br></br>
    <br></br>
    <span>In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section &quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot; below.</span>
    <br></br>
    <br></br>
    <span>We will consider and act upon any request in accordance with applicable data protection laws. </span>
    <br></br>
    <br></br>
    <span>If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority.</span>
    <br></br>
    <br></br>
    <span>If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner.</span>
    <br></br>
    <br></br>
    <h4>Withdrawing your consent:</h4>
    <br></br>
    <br></br>
    <span>If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section &ldquo;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&rdquo; below or updating your preferences.</span>
    <br></br>
    <br></br>
    <span>However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</span>
    <br></br>
    <br></br>
    <h4>Opting out of marketing and promotional communications:</h4>
    <br></br>
    <br></br>
    <span>You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section &ldquo;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&rdquo; below. You will then be removed from the marketing lists. However, we may still communicate with you &mdash; for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.</span>    <br></br>
    <br></br>
    <h4>Account Information</h4>
    <br></br>
    <br></br>
    <span>If you would at any time like to review or change the information in your account or terminate your account, you can:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>•	Log in to your account settings and update your user account.</span>
    </div>
    <br></br>
    <br></br>
    <span>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</span>
    <br></br>
    <br></br>
    <h4><u>Cookies and similar technologies:</u></h4>
    <br></br>
    <br></br>
    <span>Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. You may also opt out of interest-based advertising by advertisers on our Services.</span>
    <br></br>
    <br></br>
    <span>If you have questions or comments about your privacy rights, you may email us at info@doctorphonez.co.uk.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>11. CONTROLS FOR DO-NOT-TRACK FEATURES</h3>
    <br></br>
    <br></br>
    <span>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&ldquo;DNT&rdquo;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>12. DO WE MAKE UPDATES TO THIS NOTICE?</h3>
    <br></br>
    <br></br>
    <h4>In Short:</h4>
    <br></br>
    <br></br>
    <span>Yes, we will update this notice as necessary to stay compliant with relevant laws.</span>
    <br></br>
    <br></br>
    <span>
    We may update this privacy notice from time to time. The updated version will be indicated by an updated &ldquo;Revised&rdquo; date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
    </span>
    <br></br>
    <br></br>
    <br></br>
    <h3>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h3>
    <br></br>
    <br></br>
    <span>If you have questions or comments about this notice, you may email us at info@doctorphonez.co.uk or by post to:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>Doctorphonez</span>
    <span>Ealing Broadway</span>
    <span>London</span>
    <span>W5 2NU</span>
    <span>United Kingdom</span>
    </div>
    <br></br>
    <br></br>
    <span>If you are a resident in the United Kingdom, the &ldquo;data controller&rdquo; of your personal information is Doctorphonez. Doctorphonez has appointed one of its representatives in the UK to deal with such cases. If you wish to contact them, below are the contact details:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
          <h5>Doctorphonez</h5>
          <h5>Ealing Broadway</h5>
          <h5>London</h5>
          <h5>W5 5JY</h5>
          <h5>United Kingdom</h5>
          <h5>Phone: 00000000000</h5>
          <h5>Email: info@doctorphonez.co.uk</h5>
        </div>
    <br></br>
    <br></br>
    <br></br>
    <h3>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h3>
    <br></br>
    <br></br>
    <span>Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.</span>
    </div>
 
    </div>
  )
}
