"use client"; // this is a client component 👈🏽

import React from 'react'
import styles from './page.module.css'
import { useDispatch } from 'react-redux'
import refreshToken from '@/checkCr'
import { useEffect } from 'react'

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
    <h1>Terms and conditions</h1>
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
      We operate the website https://doctorphonez.co.uk (the &apos;Site&apos;), as well as any other related products and services that refer or link to these legal terms (the &apos;Legal Terms&apos;) (collectively, the &apos;Services&apos;).
      </span>
      <br></br>
    <br></br>
    <span>You can contact us by phone at 00000000000, email at info@doctorphonez.co.uk, or by mail to Doctorphonez, Ealing Broadway, London, W5 2NU, United Kingdom.</span>
    <br></br>
    <br></br>
    <span>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&apos;you&apos;), and Doctorphonez, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</span>
    <br></br>
    <br></br>
    <span>Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the &apos;Last updated&apos; date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.</span>
    <br></br>
    <br></br>
    <span>All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.</span>
    <br></br>
    <br></br>
    <span>We recommend that you print a copy of these Legal Terms for your records.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>TABLE OF CONTENTS</h3>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>1. OUR SERVICES</span>
    <span>2. INTELLECTUAL PROPERTY RIGHTS</span>
    <span>3. USER REPRESENTATIONS</span>
    <span>4. USER REGISTRATION</span>
    <span>5. PRODUCTS</span>
    <span>6. PURCHASES AND PAYMENT</span>
    <span>7. RETURN POLICY</span>
    <span>8. PROHIBITED ACTIVITIES</span>
    <span>9. USER GENERATED CONTRIBUTIONS</span>
    <span>10. CONTRIBUTION LICENCE </span>
    <span>11. GUIDELINES FOR REVIEWS</span>
    <span>12. SOCIAL MEDIA</span>
    <span>13. THIRD-PARTY WEBSITES AND CONTENT</span>
    <span>14. SERVICES MANAGEMENT</span>
    <span>15. PRIVACY POLICY</span>
    <span>16. TERM AND TERMINATION</span>
    <span>17. MODIFICATIONS AND INTERRUPTIONS</span>
    <span>18. GOVERNING LAW</span>
    <span>19. DISPUTE RESOLUTION</span>
    <span>20. CORRECTIONS</span>
    <span>21. DISCLAIMER</span>
    <span>22. LIMITATIONS OF LIABILITY</span>
    <span>23. INDEMNIFICATION</span>
    <span>24. USER DATA</span>
    <span>25. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</span>
    <span>26. MISCELLANEOUS</span>
    <span>27. CONTACT US</span>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <h3>1. OUR SERVICES</h3>
    <br></br>
    <br></br>
    <span>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>2. INTELLECTUAL PROPERTY RIGHTSO</h3>
    <br></br>
    <br></br>
    <h4>Our intellectual property</h4>
    <br></br>
    <br></br>
    <span>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the &apos;Content&apos;), as well as the trademarks, service marks, and logos contained therein (the &apos;Marks&apos;).</span>
    <br></br>
    <br></br>
    <span>Our Content and Marks are protected by copyright and trademark laws (and various
    other intellectual property rights and unfair competition laws) and treaties in the United
    States and around the world.
    </span>
    <br></br>
    <br></br>
    <span>The Content and Marks are provided in or through the Services &apos;AS IS&apos; for your personal, non-commercial use only.</span>
    <br></br>
    <br></br>
    <h4>Your use of our Services</h4>
    <br></br>
    <br></br>
    <span>Subject to your compliance with these Legal Terms, including the &apos;PROHIBITED ACTIVITIES&apos; section below, we grant you a non-exclusive, non-transferable, revocable licence to:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
    <span>• access the Services; and</span>
    <span>• download or print a copy of any portion of the Content to which you have properly gained access.</span>
    </div>
    <br></br>
    <br></br>
    <span>solely for your personal, non-commercial use.</span>
    <br></br>
    <br></br>
    <span>Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced,
        aggregated, republished, uploaded, posted, publicly displayed, encoded,
        translated, transmitted, distributed, sold, licensed, or otherwise exploited
        for any commercial purpose whatsoever, without our express prior written
        permission.
        </span>
    <br></br>
    <br></br>
    <span>If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: info@doctorphonez.co.uk. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.</span>
    <br></br>
    <br></br>
    <span>We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.</span>
    <br></br>
    <br></br>
    <span>Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</span>
    <br></br>
    <br></br>
    <h4>Your submissions</h4>
    <br></br>
    <br></br>
    <span>Please review this section and the &apos;PROHIBITED ACTIVITIES&apos; section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.</span>
    <br></br>
    <br></br>
    <h4>Submissions</h4>
    <br></br>
    <br></br>
    <span>By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services (&lsquo;Submissions&rsquo;), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.</span>
    <br></br>
    <br></br>
    <h4>You are responsible for what you post or upload:</h4>
    <br></br>
    <br></br>
    <span>By sending us Submissions through any part of the Services you:</span>
    <div className={styles.spandiv}>
    <span>• confirm that you have read and agree with our &apos;PROHIBITED ACTIVITIES&apos; and will not post, send, publish, upload, or transmit through the Services any Submission that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;</span>
    <span>• to the extent permissible by applicable law, waive any and all moral rights to any such Submission;</span>
    <span>• warrant that any such Submission are original to you or that you have the necessary rights and licences to submit such Submissions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions; and</span>
    <span>• warrant and represent that your Submissions do not constitute confidential information.</span>
    </div>
    <br></br>
    <br></br>
    <span>You are solely responsible for your Submissions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party’s intellectual property rights, or (c) applicable law.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>3. USER REPRESENTATIONS</h3>
    <br></br>
    <br></br>
    <span>By using the Services, you represent and warrant that: (1) all registration information you submit
        will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a
        minor in the jurisdiction in which you reside, or if a minor, you have
        received parental permission to use the Services; (5) you will not access the Services through automated or non-human means, whether through a bot, script or
        otherwise; (6) you will not use the Services for any illegal or unauthorised purpose; and (7) your use of the Services will not violate any applicable law or regulation.
    </span>
    <br></br>
    <br></br>
    <span>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>4. USER REGISTRATION</h3>
    <br></br>
    <br></br>
    <span>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>5. PRODUCTS</h3>
    <br></br>
    <br></br>
    <span>We make every effort to display as accurately as possible the colours, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colours, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colours and details of the products. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>6. PURCHASES AND PAYMENT</h3>
    <br></br>
    <br></br>
    <span>We accept the following forms of payment:</span>
    <div className={styles.spandiv}>
        <span>- Visa</span>
        <span>- Mastercard</span>
        <span>-  Klarna</span>
        <span>-  Apple Pay</span>
        <span>-  Google Pay</span>
    
    </div>
    <br></br>
    <br></br>
    <span>You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in British Pounds.</span>
    <br></br>
    <br></br>
    <span>You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorise us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct
        any errors or mistakes in pricing, even if we have already requested or
        received payment.
        </span>
    <br></br>
    <br></br>
    <span>We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgement, appear to be placed by dealers, resellers, or distributors.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>7. RETURN POLICY</h3>
    <br></br>
    <br></br>
    <span>Please review our Return Policy posted on the Services prior to making any purchases.</span>
    <br></br>
    <br></br>
    <br></br>
    <h3>8. PROHIBITED ACTIVITIES</h3>
    <br></br>
    <br></br>
    <span>You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.</span>
    <br></br>
    <br></br>
    <span>As a user of the Services, you agree not to:</span>
    <br></br>
    <br></br>
    <div className={styles.spandiv}>
        <span>- Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</span>
        <span>- Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</span>
        <span>- Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</span>
        <span>- Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</span>
        <span>- Use any information obtained from the Services in order to harass, abuse, or harm another person.</span>
        <span>- Make improper use of our support services or submit false reports of abuse or misconduct.</span>
        <span>- Use the Services in a manner inconsistent with any applicable laws or regulations.</span>
        <span>- Engage in unauthorized framing of or linking to the Services.</span>
        <span>- Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</span>
        <span>- Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</span>
        <span>- Delete the copyright or other proprietary rights notice from any Content. </span>
        <span>- Attempt to impersonate another user or person or use the username of another user.</span>
        <span>- Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware” or “passive collection mechanisms” or “pcms”).</span>
        <span>- Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</span>
        <span>- Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</span>
        <span>- Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</span>
        <span>- Copy or adapt the Services’ software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</span>
        <span>- Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.</span>
        <span>- Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or using or launching any unauthorized script or other software.</span>
        <span>- Use a buying agent or purchasing agent to make purchases on the Services.</span>
        <span>- Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</span>
        <span>- Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavour or commercial enterprise.</span>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <h3>9. USER GENERATED CONTRIBUTIONS</h3>
        <br></br>
        <br></br>
        <span>The Services does not offer users to submit or post content.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>10. CONTRIBUTION LICENCE</h3>
        <br></br>
        <br></br>
        <span>
        You and Services agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).
        </span>
        <br></br>
        <br></br>
        <span>By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>11. GUIDELINES FOR REVIEWS</h3>
        <br></br>
        <br></br>
        <span>We may provide you areas on the Services to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language; (3) your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability; (4) your reviews should not contain references to illegal activity; (5) you should not be affiliated with competitors if posting negative reviews; (6) you should not make any conclusions as to the legality of conduct; (7) you may not post any false or misleading statements; and (8) you may not organise a campaign encouraging others to post reviews, whether positive or negative.</span>
        <br></br>
        <br></br>
        <span>We may accept, reject, or remove reviews in our sole discretion. We have absolutely no obligation to screen reviews or to delete reviews, even if anyone considers reviews objectionable or inaccurate. Reviews are not endorsed by us, and do not necessarily represent our opinions or the views of any of our affiliates or partners. We do not assume liability for any review or for any claims, liabilities, or losses resulting from any review. By posting a review, you hereby grant to us a perpetual, non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable right and licence to reproduce, modify, translate, transmit by any means, display, perform, and/or distribute all content relating to review.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>12. SOCIAL MEDIA</h3>
        <br></br>
        <br></br>
        <span>As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a &apos;Third-Party Account&apos;) by either: (1) providing your Third-Party Account login information through the Services; or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account. You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the third-party service provider of the Third-Party Account. By granting us access to any Third-Party Accounts, you understand that (1) we may access, make available, and store (if applicable) any content that you have provided to and stored in your Third-Party Account (the &apos;Social Network Content&apos;) so that it is available on and through the Services via your account, including without limitation any friend lists and (2) we may submit to and receive from your Third-Party Account additional information to the extent you are notified when you link your account with the Third-Party Account. Depending on the Third-Party Accounts you choose and subject to the privacy settings that you have set in such Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on and through your account on the Services. Please note that if a Third-Party Account or associated service becomes unavailable or our access to such Third-Party Account is terminated by the third-party service provider, then Social Network Content may no longer be available on and through the Services. You will have the ability to disable the connection between your account on the Services and your Third-Party Accounts at any time. PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS. We make no effort to review any Social Network Content for any purpose, including but not limited to, for accuracy, legality, or non-infringement, and we are not responsible for any Social Network Content. You acknowledge and agree that we may access your email address book associated with a Third-Party Account and your contacts list stored on your mobile device or tablet computer solely for purposes of identifying and informing you of those contacts who have also registered to use the Services. You can deactivate the connection between the Services and your Third-Party Account by contacting us using the contact information below or through your account settings (if applicable). We will attempt to delete any information stored on our servers that was obtained through such Third-Party Account, except the username and profile picture that become associated with your account.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>13. THIRD-PARTY WEBSITES AND CONTENT</h3>
        <br></br>
        <br></br>
        <span>The Services may contain (or you may be sent via the Site) links to other websites (&apos;Third-Party Websites&apos;) as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties (&apos;Third-Party Content&apos;). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party. You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>14. SERVICES MANAGEMENT</h3>
        <br></br>
        <br></br>
        <span>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>15. PRIVACY POLICY</h3>
        <br></br>
        <br></br>
        <span>We care about data privacy and security. Please review our Privacy Policy: https://doctorphonez.co.uk/privacy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in the United Kingdom. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in the United Kingdom, then through your continued use of the Services, you are transferring your data to the United Kingdom, and you expressly consent to have your data transferred to and processed in the United Kingdom.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>16. TERM AND TERMINATION</h3>
        <br></br>
        <br></br>
        <span>These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.</span>
        <br></br>
        <br></br>
        <span>If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>17. MODIFICATIONS AND INTERRUPTIONS</h3>
        <br></br>
        <br></br>
        <span>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</span>
        <br></br>
        <br></br>
        <span>We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>18. GOVERNING LAW</h3>
        <br></br>
        <br></br>
        <span>These Legal Terms are governed by and interpreted following the laws of the United Kingdom, and the use of the United Nations Convention of Contracts for the International Sales of Goods is expressly excluded. If your habitual residence is in the EU, and you are a consumer, you additionally possess the protection provided to you by obligatory provisions of the law in your country to residence. Doctorphonez and yourself both agree to submit to the non-exclusive jurisdiction of the courts of UK, which means that you may make a claim to defend your consumer protection rights in regards to these Legal Terms in the United Kingdom, or in the EU country in which you reside.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>19. DISPUTE RESOLUTION</h3>
        <br></br>
        <br></br>
        <span>The European Commission provides an online dispute resolution platform, which you can access. If you would like to bring this subject to our attention, please contact us.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>20. CORRECTIONS</h3>
        <br></br>
        <br></br>
        <span>There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>21. DISCLAIMER</h3>
        <br></br>
        <br></br>
        <span>SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES&apos; CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORISED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGEMENT AND EXERCISE CAUTION WHERE APPROPRIATE.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>22. LIMITATIONS OF LIABILITY</h3>
        <br></br>
        <br></br>
        <span>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE
        AMOUNT PAID, IF ANY, BY YOU TO US DURING THE six (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
        </span>
        <br></br>
        <br></br>
        <br></br>
        <h3>23. INDEMNIFICATION</h3>
        <br></br>
        <br></br>
        <span>You agree to
        defend, indemnify, and hold us harmless, including our subsidiaries,
        affiliates, and all of our respective officers, agents, partners, and
        employees, from and against any loss, damage, liability, claim, or demand, including
        reasonable attorneys’ fees and expenses, made by any third party due to or
        arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defence and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defence of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
        </span>
        <br></br>
        <br></br>
        <br></br>
        <h3>24. USER DATA</h3>
        <br></br>
        <br></br>
        <span>We will maintain
        certain data that you transmit to the Services for the purpose of managing the
        performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups
        of data, you are solely responsible for all data that you transmit or that
        relates to any activity you have undertaken using the Services. You agree
        that we shall have no liability to you for any loss or corruption of any such
        data, and you hereby waive any right of action against us arising from any such
        loss or corruption of such data.
        </span>
        <br></br>
        <br></br>
        <br></br>
        <h3>25. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h3>
        <br></br>
        <br></br>
        <span>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>26. MISCELLANEOUS</h3>
        <br></br>
        <br></br>
        <span>These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defences you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.</span>
        <br></br>
        <br></br>
        <br></br>
        <h3>27. CONTACT US</h3>
        <br></br>
        <br></br>
        <span>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</span>
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
    </div>
        
    </div>
  )
}
